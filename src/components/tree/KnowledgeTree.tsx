import { useCallback, useEffect, useState } from 'react';
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
import { Dialog } from '@/components/ui/dialog';
import AddNoteModal from './AddNoteModal';
import EditNoteModal from './EditNoteModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { fetchNotes, addNote, updateNote, deleteNote } from '@/api/notes';

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
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // Start empty
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [isAddNoteOpen, setAddNoteOpen] = useState(false);
  const [isEditNoteOpen, setEditNoteOpen] =  useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNode, setDeletingNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes from backend on mount
  useEffect(() => {
    setLoading(true);
    fetchNotes()
      .then(fetchedNotes => {
        console.log('Fetched notes:', fetchedNotes); // Debug log
        setNodes(fetchedNotes.map((note, index) => ({
          id: note._id,
          type: 'sub',
          position: note.position && typeof note.position.x === 'number' && typeof note.position.y === 'number' 
            ? note.position 
            : { x: 400, y: 350 + index * 60 },
          data: {
            label: note.name,
            description: note.content,
            color: note.color,
            tag: note.tag,
            imageUrl: note.imageUrl,
            type: 'subtopic',
          },
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notes:', err);
        setError('Failed to fetch notes');
        setLoading(false);
      });
  }, []);

  // Add note handler
  const handleAddNoteSubmit = async (data: { name: string; content: string; color: string; tag: string; imageUrl?: string }) => {
    setLoading(true);
    try {
      // Calculate position based on current nodes count
      const newPosition = { 
        x: 400, 
        y: 350 + nodes.length * 60 
      };
      
      const note = await addNote({
        name: data.name,
        content: data.content,
        color: data.color,
        tag: data.tag,
        imageUrl: data.imageUrl,
        position: newPosition,
      });
      
      // Use the position returned from the server, or fallback to calculated position
      const finalPosition = note.position || newPosition;
      
      setNodes(prev => ([
        ...prev,
        {
          id: note._id,
          type: 'sub',
          position: finalPosition,
          data: {
            label: note.name,
            description: note.content,
            color: note.color,
            tag: note.tag,
            imageUrl: note.imageUrl,
            type: 'subtopic',
          },
        },
      ]));
      setAddNoteOpen(false);
      toast({ title: 'Note added', description: `Note "${data.name}" was added.` });
    } catch (err) {
      setError('Failed to add note');
    }
    setLoading(false);
  };

  // Edit note handler
  const handleEditNoteSubmit = async (data: { name: string; content: string; color: string; tag: string; imageUrl?: string }) => {
    if (!editingNode) return;
    setLoading(true);
    try {
      const note = await updateNote(editingNode.id, {
        name: data.name,
        content: data.content,
        color: data.color,
        tag: data.tag,
        imageUrl: data.imageUrl,
        position: editingNode.position,
      });
      setNodes(prev => prev.map(node =>
        node.id === editingNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                label: note.name,
                description: note.content,
                color: note.color,
                tag: note.tag,
                imageUrl: note.imageUrl,
              },
            }
          : node
      ));
      setEditNoteOpen(false);
      setEditingNode(null);
      toast({ title: 'Note updated', description: `Note "${data.name}" was updated.` });
    } catch (err) {
      setError('Failed to update note');
    }
    setLoading(false);
  };



  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node position updates when nodes are dragged
  const onNodeDragStop = useCallback(async (event: any, node: Node) => {
    try {
      // Update the node position in the database
      await updateNote(node.id, {
        position: node.position
      });
      console.log('Node position updated:', node.id, node.position);
    } catch (err) {
      console.error('Failed to update node position:', err);
      toast({
        title: "Position update failed",
        description: "Could not save the new position",
        variant: "destructive"
      });
    }
  }, []);

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
    setAddNoteOpen(true);
  };

  const handleEditNode = (nodeId: string) => {
    console.log('Edit node triggered for:', nodeId); // Debug log
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log('Opening edit modal for node:', node.data.label); // Debug log
      setEditingNode(node);
      setEditNoteOpen(true);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    console.log('Delete node triggered for:', nodeId); // Debug log
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log('Opening delete dialog for node:', node.data.label); // Debug log
      setDeletingNode(node);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNode) return;
    
    setLoading(true);
    try {
      await deleteNote(deletingNode.id);
      
      // Remove the node from the local state
      setNodes(prev => prev.filter(node => node.id !== deletingNode.id));
      
      toast({ 
        title: 'Note deleted', 
        description: `Note "${deletingNode.data.label}" was deleted.` 
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingNode(null);
    } catch (err) {
      setError('Failed to delete note');
      toast({
        title: "Delete failed",
        description: "Could not delete the note",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen bg-tree-background relative">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 z-50 bg-black/80 text-white p-2 text-xs max-w-xs">
          <div>Nodes: {nodes.length}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
          {nodes.length > 0 && (
            <div>
              First node position: {JSON.stringify(nodes[0].position)}
            </div>
          )}
        </div>
      )}
      
      {/* Header with search and add button */}
      <TreeHeader 
        onSearch={handleSearch}
        onAddNote={handleAddNote}
        searchQuery={searchQuery}
      />
      {/* Add Note Modal */}
      <Dialog open={isAddNoteOpen} onOpenChange={setAddNoteOpen}>
        <AddNoteModal onClose={() => setAddNoteOpen(false)} onAddNote={handleAddNoteSubmit} />
      </Dialog>
      {/* Edit Note Modal */}
      {editingNode && (
        <Dialog open={isEditNoteOpen} onOpenChange={setEditNoteOpen}>
          <EditNoteModal
            onClose={() => setEditNoteOpen(false)}
            onEditNote={handleEditNoteSubmit}
            initialValues={{
              name: editingNode.data.label,
              content: editingNode.data.description,
              color: editingNode.data.color || 'red',
              tag: editingNode.data.tag || '',
            }}
          />
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingNode(null);
        }}
        onConfirm={handleConfirmDelete}
        noteName={deletingNode?.data.label || ''}
      />
      {/* ReactFlow Tree */}
      <div className="pt-20 h-full">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onEdit: handleEditNode,
              onDelete: handleDeleteNode,
              id: node.id
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
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