import React, { useEffect, useState } from "react";
import { Box, Fade, IconButton, styled } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useDigitalTwin } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";

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

interface LayerTreeItem {
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

const formatInfoTree = (data: any[]): LayerTreeItem[] => {
  const fixedArr = data.map((item) => ({
    label: item.name,
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
  const { state } = useDigitalTwin();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visibilityState, setVisibilityState] = useState<{ [key: string]: boolean }>({});
  
  const { toggleLayerVisibility } = useDigitalTwinApi();

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
  }, [state.layerTree]);

  const handleToggle = (
    event: React.SyntheticEvent | null,
    nodeIds: string[]
  ) => {
    setExpanded(nodeIds);
  };

  const handleVisibilityToggle = async (
    event: React.MouseEvent,
    node: LayerTreeItem
  ) => {
    event.stopPropagation(); // Prevent tree expansion when clicking icon
    
    const nodeId = node.index.toString();
    const currentVisibility = visibilityState[nodeId];
    const newVisibility = !currentVisibility;

    // Optimistically update local state
    setVisibilityState((prev) => ({
      ...prev,
      [nodeId]: newVisibility,
    }));

    try {
      await toggleLayerVisibility(node.id, newVisibility);
    } catch (error) {
      console.error("Error toggling layer visibility:", error);
      // Revert on error
      setVisibilityState((prev) => ({
        ...prev,
        [nodeId]: currentVisibility,
      }));
    }
  };

  const renderTreeItems = (nodes: LayerTreeItem[]): React.ReactNode => {
    return nodes.map((node) => {
      const nodeId = node.index.toString();
      const isVisible = visibilityState[nodeId] ?? node.visibility;

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
                  <VisibilityOffOutlinedIcon sx={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
                )}
              </VisibilityButton>
              <span 
                style={{ 
                  color: node.color, 
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                  opacity: isVisible ? 1 : 0.25,
                  transition: "opacity 0.2s ease"
                }}
                onClick={(e) => handleVisibilityToggle(e, node)}
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
          onExpandedItemsChange={handleToggle}
        >
          {renderTreeItems(layerTree)}
        </StyledTreeView>
      </TreeContainer>
    </Fade>
  );
};

export default LayerTree;