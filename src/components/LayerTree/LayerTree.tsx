import React, { useEffect, useState } from "react";
import { Box, Fade, IconButton, styled } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useDigitalTwinContext } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";
import { useHeader } from "@/contexts/HeaderContext";

const TreeContainer = styled(Box)({
  height: "100%",
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  direction: "rtl", // Right-to-left to move scrollbar to left
  "& > *": {
    direction: "ltr", // Reset content to left-to-right
  },
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(255, 255, 255, 0.8)",
  },
});

const StyledTreeView = styled(SimpleTreeView)({
  color: "rgba(255, 255, 255, 0.8)",
  "& .MuiTreeItem-root": {
    "& .MuiTreeItem-content": {
      backgroundColor: "transparent !important",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1) !important",
      },
      "&.Mui-focused": {
        backgroundColor: "transparent !important",
      },
      "&.Mui-selected": {
        backgroundColor: "transparent !important",
      },
    },
    "& .MuiTreeItem-label": {
      fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)", // Responsive: 12px - 14px
      color: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
});

const VisibilityButton = styled(IconButton)({
  padding: "4px",
  color: "rgba(255, 255, 255, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

export interface LayerTreeItem {
  id: string;
  label: string;
  index: number;
  parentIndex: number;
  visibility: boolean;
  color: string;
  style: number;
  type: string;
  children?: LayerTreeItem[];
}

// Mapping of technical layer names to user-friendly names
const layerNameMapping: Record<string, string> = {
  HX_CG_3DM_PLGN_RVT22: "SECURITY, NORTH",
  HX_CG_3DM_PLGS_RVT22: "SECURITY, SOUTH",
  HX_EL_3DM_PLGN_RVT22: "ELECTRICAL, NORTH",
  HX_EL_3DM_PLGS_RVT22: "ELECTRICAL, SOUTH",
  HX_IR_3DM_PLGS_RVT22: "IRRIGATION, SOUTH",
  HX_MV_3DM_PLGN_RVT22: "ACMV, NORTH",
  HX_MV_3DM_PLGS_RVT22: "ACMV, SOUTH",
  HX_PL_3DM_PLGS_RVT22: "PLUMBING, SOUTH",
  HX_PLU_3DM_PLGN_RVT22: "PLUMBING, NORTH",
  HX_SAN_3DM_PLGN_RVT22: "SANITARY, NORTH",
  HX_SAN_3DM_PLGS_RVT22: "SANITARY, SOUTH",
  HX_ST_3DM_PLGN_RVT22: "STRUCTURAL, NORTH",
  HX_ST_3DM_PLGS_RVT22: "STRUCTURAL, SOUTH",
  HX_SW_3DM_PLGS_RVT22: "SIPHONIC RWDP, SOUTH",
  SCH_LIFT_3DM_PLGN_RVT22: "LIFTS, NORTH",
  SCH_LIFT_3DM_PLGS_RVT22: "LIFTS, SOUTH",
  HX_FC_3DM_PLGN_RVT22: "FACADE, NORTH",
  HX_FC_3DM_PLGS_RVT22: "FACADE, SOUTH",
  HX_FP_3DM_PLGN_RVT22: "FIRE PROTECTION, NORTH",
  HX_FP_3DM_PLGS_RVT22: "FIRE PROTECTION, SOUTH",
  HX_AR_3DM_PLGN_RVT22: "ARCHITECTURAL MODEL, NORTH",
  HX_AR_3DM_PLGS_RVT22: "ARCHITECTURAL MODEL, SOUTH",
};

// Helper function to get display name
const getDisplayName = (technicalName: string): string => {
  return layerNameMapping[technicalName] || technicalName;
};

const formatInfoTree = (data: any[]): LayerTreeItem[] => {
  const fixedArr = data.map((item) => ({
    label: getDisplayName(item.name),
    id: item.iD || item.id,
    visibility: item.visiblity !== undefined ? item.visiblity : item.visibility,
    index: item.index,
    parentIndex: item.parentIndex,
    color: item.color ? item.color.replace("RGB", "rgb") : "rgb(255, 255, 255)",
    style: item.style || 0,
    type: item.type,
  }));

  const map: { [key: number]: LayerTreeItem } = {};
  fixedArr.forEach((item) => {
    map[item.index] = item;
  });

  const result: LayerTreeItem[] = [];
  fixedArr.forEach((item) => {
    const parent = map[item.parentIndex];
    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    } else {
      result.push(item);
    }
  });

  return result;
};

const LayerTree: React.FC = () => {
  const { state } = useDigitalTwinContext();
  const { state: headerState } = useHeader();
  const { xrayColor } = state;
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibilityState, setVisibilityState] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const {
    toggleLayerVisibility,
    setStyleForTreeLayers,
    setXrayForLayers,
    focusOnTileLayer,
  } = useDigitalTwinApi();

  const layerTree = formatInfoTree(state.layerTree);

  // Initialize visibility state from layerTree data
  useEffect(() => {
    const initVisibility = (nodes: LayerTreeItem[]) => {
      const newState: { [key: string]: boolean } = {};

      const traverse = (items: LayerTreeItem[]) => {
        items.forEach((item) => {
          newState[item.index.toString()] = item.visibility;
          if (item.children) {
            traverse(item.children);
          }
        });
      };

      traverse(nodes);
      return newState;
    };

    setVisibilityState(initVisibility(layerTree));

    // Expand all top-level parent nodes by default
    if (layerTree.length > 0) {
      const topLevelIds = layerTree.map((node) => node.index.toString());
      setExpanded(topLevelIds);
    }
  }, [state.layerTree]);

  // Clear selection when layer tree is hidden
  useEffect(() => {
    if (!headerState.showLayerTree) {
      setSelectedLayerId(null);
    }
  }, [headerState.showLayerTree]);

  // Helper function to get all layer IDs from the entire tree
  const getAllLayerIds = (nodes: LayerTreeItem[]): string[] => {
    const ids: string[] = [];

    const traverse = (item: LayerTreeItem) => {
      ids.push(item.id);
      if (item.children) {
        item.children.forEach((child) => traverse(child));
      }
    };

    nodes.forEach((node) => traverse(node));
    return ids;
  };

  const handleExpandToggle = (
    event: React.SyntheticEvent | null,
    nodeIds: string[]
  ) => {
    setExpanded(nodeIds);
  };

  const handleSelectLayer = async (
    event: React.MouseEvent,
    node: LayerTreeItem
  ) => {
    event.stopPropagation();
    const selectedNodeId = node.id;

    // Get all layer IDs from the entire tree
    const allLayerIds = getAllLayerIds(layerTree);

    // Filter out the selected layer
    const layerIdsToXray = allLayerIds.filter(
      (id) => id !== selectedNodeId && id !== "ProjectTree_Root"
    );

    console.log("Setting X-ray for layers:", layerIdsToXray);
    console.log("X-ray color:", xrayColor);

    await setXrayForLayers(true, layerIdsToXray, xrayColor);
    await setXrayForLayers(false, selectedNodeId, undefined);
    // await setStyleForTreeLayers(layerIdsToXray, xrayColor);
    // await setStyleForTreeLayers(selectedNodeId, white);
    await focusOnTileLayer(selectedNodeId, 50, 1, [0, 120, 0]); // setting distance to 0 will make it auto-calculate.

    // Update selected layer state
    setSelectedLayerId(selectedNodeId);
  };

  const handleVisibilityToggle = async (
    event: React.MouseEvent,
    node: LayerTreeItem
  ) => {
    event.stopPropagation(); // Prevent tree expansion when clicking icon

    const nodeId = node.index.toString();
    const currentVisibility = visibilityState[nodeId];
    const newVisibility = !currentVisibility;

    // Helper function to get all descendant node IDs
    const getAllDescendants = (parentNode: LayerTreeItem): string[] => {
      const descendants: string[] = [];

      const traverse = (node: LayerTreeItem) => {
        descendants.push(node.index.toString());
        if (node.children) {
          node.children.forEach((child) => traverse(child));
        }
      };

      if (parentNode.children) {
        parentNode.children.forEach((child) => traverse(child));
      }

      return descendants;
    };

    // Get all descendants of the toggled node
    const descendantIds = getAllDescendants(node);

    // Update visibility for the node and all its descendants
    setVisibilityState((prev) => {
      const updated = { ...prev, [nodeId]: newVisibility };

      // Set all descendants to the same visibility as parent
      descendantIds.forEach((id) => {
        updated[id] = newVisibility;
      });

      return updated;
    });

    try {
      // Toggle the main node
      await toggleLayerVisibility(node.id, newVisibility);

      // Also toggle all descendants
      const toggleDescendants = async (parentNode: LayerTreeItem) => {
        if (parentNode.children) {
          for (const child of parentNode.children) {
            await toggleLayerVisibility(child.id, newVisibility);
            if (child.children) {
              await toggleDescendants(child);
            }
          }
        }
      };

      await toggleDescendants(node);
    } catch (error) {
      console.error("Error toggling layer visibility:", error);
      // Revert on error
      setVisibilityState((prev) => {
        const reverted = { ...prev, [nodeId]: currentVisibility };

        // Revert descendants too
        descendantIds.forEach((id) => {
          reverted[id] = prev[id]; // Use original state
        });

        return reverted;
      });
    }
  };

  const renderTreeItems = (nodes: LayerTreeItem[]): React.ReactNode => {
    return nodes.map((node) => {
      const nodeId = node.index.toString();
      const isVisible = visibilityState[nodeId] ?? node.visibility;
      const isSelected = selectedLayerId === node.id; // Check if this layer is selected

      return (
        <TreeItem
          key={nodeId}
          itemId={nodeId}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <VisibilityButton
                size="small"
                onClick={(e) => handleVisibilityToggle(e, node)}
              >
                {isVisible ? (
                  <VisibilityIcon sx={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
                ) : (
                  <VisibilityOffOutlinedIcon
                    sx={{ fontSize: "clamp(16px, 2vw, 24px)" }}
                  />
                )}
              </VisibilityButton>
              <span
                style={{
                  color: isSelected ? "#000000" : node.color,
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                  opacity: isVisible ? 1 : 0.25,
                  transition: "opacity 0.2s ease",
                  backgroundColor: isSelected ? "#7afafe" : "transparent",
                }}
                onClick={(e) => handleSelectLayer(e, node)}
              >
                {node.label}
              </span>
            </Box>
          }
        >
          {node.children && renderTreeItems(node.children)}
        </TreeItem>
      );
    });
  };

  return (
    <Fade in={true} timeout={800}>
      <TreeContainer>
        <StyledTreeView
          slots={{
            collapseIcon: ExpandMore,
            expandIcon: ChevronRight,
          }}
          expandedItems={expanded}
          onExpandedItemsChange={handleExpandToggle}
        >
          {renderTreeItems(layerTree)}
        </StyledTreeView>
      </TreeContainer>
    </Fade>
  );
};

export default LayerTree;
