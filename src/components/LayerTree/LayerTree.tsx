import React, { useEffect, useState } from "react";
import { Box, Fade, styled } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { useDigitalTwin } from "@/contexts/DigitalTwinContext";
import { useDigitalTwinApi } from "@/hooks/useDigitalTwinApi";

const TreeContainer = styled(Box)({
  position: "absolute",
  height: "70vh",
  width: "300px",
  margin: "50px 0 50px 50px",
  overflowY: "auto",
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
    },
    "& .MuiTreeItem-label": {
      fontSize: "14px",
      color: "rgba(255, 255, 255, 0.8)",
    },
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
    id: item.iD || item.id, // Handle both naming conventions
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

const getLayerTreeChecked = (root: LayerTreeItem[]): number[] => {
  const result: number[] = [];

  const traverse = (items: LayerTreeItem[]) => {
    items.forEach((item) => {
      if (item.visibility) {
        result.push(item.index);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(root);
  return result;
};

const renderTreeItems = (nodes: LayerTreeItem[]): React.ReactNode => {
  return nodes.map((node) => (
    <TreeItem
      key={node.index}
      itemId={node.index.toString()}
      label={node.label}
      sx={{
        "& .MuiTreeItem-content": {
          color: node.color,
        },
      }}
    >
      {node.children && renderTreeItems(node.children)}
    </TreeItem>
  ));
};

const LayerTree: React.FC = () => {
  const { state } = useDigitalTwin();
  const [expanded, setExpanded] = useState<string[]>(["0"]);
  const [selected, setSelected] = useState<string[]>([]);

  // Use the consolidated hook instead of direct API calls
  const { toggleLayerVisibility } = useDigitalTwinApi();

  const layerTree = formatInfoTree(state.layerTree);

  useEffect(() => {
    const checkedItems = getLayerTreeChecked(layerTree);
    setSelected(checkedItems.map((item) => item.toString()));
  }, [layerTree]);

  // Expansion handler
  const handleToggle = (
    event: React.SyntheticEvent | null,
    nodeIds: string[]
  ) => {
    setExpanded(nodeIds);
  };

  const handleSelect = async (
    event: React.SyntheticEvent | null,
    nodeIds: string | string[] | null
  ) => {
    // Normalize to array
    const ids =
      nodeIds == null ? [] : Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    setSelected(ids);

    // Find the clicked node (last one in the array)
    const clickedNodeId = ids[ids.length - 1];

    const findNode = (
      nodes: LayerTreeItem[],
      id: string
    ): LayerTreeItem | null => {
      for (const node of nodes) {
        if (node.index.toString() === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (clickedNodeId) {
      const node = findNode(layerTree, clickedNodeId);
      if (node) {
        try {
          // Use the hook method instead of direct API call
          const isVisible = ids.includes(clickedNodeId);
          await toggleLayerVisibility(node.id, isVisible);
        } catch (error) {
          console.error("Error toggling layer visibility:", error);
        }
      }
    }
  };

  return (
    <Fade in={true} timeout={1000} style={{ transitionDelay: "300ms" }}>
      <TreeContainer>
        <StyledTreeView
          slots={{
            collapseIcon: ExpandMore,
            expandIcon: ChevronRight,
          }}
          expandedItems={expanded} // array of itemIds
          onExpandedItemsChange={handleToggle}
          selectedItems={selected} // string | string[]
          onSelectedItemsChange={handleSelect}
        >
          {renderTreeItems(layerTree)}
        </StyledTreeView>
      </TreeContainer>
    </Fade>
  );
};

export default LayerTree;
