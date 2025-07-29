import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CentralNode from './CentralNode';
import SubNode from './SubNode';
import AdjacentNode from './AdjacentNode';
import TreeHeader from './TreeHeader';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  central: CentralNode,
  sub: SubNode,
  adjacent: AdjacentNode,
};

// Sample data for demonstration
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'central',
    position: { x: 400, y: 300 },
    data: { 
      label: 'Artificial Intelligence',
      description: 'Core knowledge area'
    },
  },
  {
    id: '2',
    type: 'sub',
    position: { x: 100, y: 200 },
    data: { 
      label: 'Machine Learning',
      type: 'subtopic'
    },
  },
  {
    id: '3',
    type: 'sub',
    position: { x: 100, y: 400 },
    data: { 
      label: 'Neural Networks',
      type: 'subtopic'
    },
  },
  {
    id: '4',
    type: 'sub',
    position: { x: 700, y: 200 },
    data: { 
      label: 'Computer Vision',
      type: 'subtopic'
    },
  },
  {
    id: '5',
    type: 'sub',
    position: { x: 700, y: 400 },
    data: { 
      label: 'Natural Language',
      type: 'subtopic'
    },
  },
  {
    id: '6',
    type: 'adjacent',
    position: { x: 400, y: 100 },
    data: { 
      label: 'Data Science',
      category: 'related field'
    },
  },
  {
    id: '7',
    type: 'adjacent',
    position: { x: 400, y: 500 },
    data: { 
      label: 'Robotics',
      category: 'related field'
    },
  },
  {
    id: '8',
    type: 'adjacent',
    position: { x: 0, y: 300 },
    data: { 
      label: 'Mathematics',
      category: 'foundation'
    },
  },
  {
    id: '9',
    type: 'adjacent',
    position: { x: 800, y: 300 },
    data: { 
      label: 'Philosophy',
      category: 'related field'
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 2 } },
  { id: 'e1-4', source: '1', target: '4', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 2 } },
  { id: 'e1-5', source: '1', target: '5', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 2 } },
  { id: 'e1-6', source: '1', target: '6', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 1 } },
  { id: 'e1-7', source: '1', target: '7', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 1 } },
  { id: 'e8-1', source: '8', target: '1', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 1 } },
  { id: 'e1-9', source: '1', target: '9', style: { stroke: 'hsl(var(--tree-connection))', strokeWidth: 1 } },
];

const KnowledgeTree = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    if (query) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${query}`,
      });
    }
  };

  const handleAddNote = () => {
    toast({
      title: "Add new note",
      description: "Opening note editor...",
    });
    // TODO: Implement add note functionality
  };

  const handleNodeAction = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    toast({
      title: "Node action",
      description: `Opened actions for: ${node?.data.label}`,
    });
    // TODO: Implement node action menu
  };

  return (
    <div className="w-full h-screen bg-tree-background relative">
      {/* Header with search and add button */}
      <TreeHeader 
        onSearch={handleSearch}
        onAddNote={handleAddNote}
        searchQuery={searchQuery}
      />
      {/* ReactFlow Tree */}
      <div className="pt-20 h-full">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onNodeAction: handleNodeAction,
              id: node.id
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-tree-background"
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="bg-card border border-border" />
          <Background 
            color="hsl(var(--tree-connection))" 
            size={1} 
            className="opacity-10"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default KnowledgeTree;