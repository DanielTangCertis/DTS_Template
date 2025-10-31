import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define custom data structure for your equipment nodes
interface EquipmentMetadata {
  serialNumber: string;
  status: string;
}

interface EquipmentNodeData {
  label: string;
  equipmentType: 'parent' | 'affected' | 'child';
  metadata: EquipmentMetadata;
}

// Type for your equipment nodes
type EquipmentNode = Node<EquipmentNodeData>;

// Define the structure of your equipment data
interface EquipmentData {
  nodes: EquipmentNode[];
  edges: Edge[];
}

// Sample data with proper typing
const equipmentData: EquipmentData = {
  nodes: [
    {
      id: "parent-1",
      type: "default",
      data: { 
        label: "Parent 1",
        equipmentType: "parent",
        metadata: { serialNumber: "P001", status: "operational" }
      },
      position: { x: 250, y: 0 }
    },
    {
      id: "affected-equipment",
      type: "default",
      data: { 
        label: "Affected Equipment",
        equipmentType: "affected",
        metadata: { serialNumber: "AE001", status: "maintenance" }
      },
      position: { x: 250, y: 100 }
    },
    {
      id: "child-1",
      type: "default",
      data: { 
        label: "Child 1",
        equipmentType: "child",
        metadata: { serialNumber: "C001", status: "operational" }
      },
      position: { x: 150, y: 200 }
    },
    {
      id: "child-2",
      type: "default",
      data: { 
        label: "Child 2",
        equipmentType: "child",
        metadata: { serialNumber: "C002", status: "operational" }
      },
      position: { x: 350, y: 200 }
    }
  ],
  edges: [
    {
      id: "e-parent-affected",
      source: "parent-1",
      target: "affected-equipment",
      type: "smoothstep"
    },
    {
      id: "e-affected-child1",
      source: "affected-equipment",
      target: "child-1",
      type: "smoothstep"
    },
    {
      id: "e-affected-child2",
      source: "affected-equipment",
      target: "child-2",
      type: "smoothstep"
    }
  ]
};

const EquipmentFlowChart: React.FC = () => {
  // Handle node clicks with proper typing
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    const equipmentNode = node as EquipmentNode;
    console.log('Node clicked:', equipmentNode);
    
    // Example: You can trigger different logic based on equipment type
    switch(equipmentNode.data.equipmentType) {
      case 'parent':
        console.log('Parent equipment clicked:', equipmentNode.data.metadata);
        // Your custom logic here
        break;
      case 'affected':
        console.log('Affected equipment clicked:', equipmentNode.data.metadata);
        // Your custom logic here
        break;
      case 'child':
        console.log('Child equipment clicked:', equipmentNode.data.metadata);
        // Your custom logic here
        break;
      default:
        break;
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={equipmentData.nodes}
        edges={equipmentData.edges}
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default EquipmentFlowChart;