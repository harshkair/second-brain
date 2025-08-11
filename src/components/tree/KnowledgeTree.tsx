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

// Default position calculator for new nodes
const calculateDefaultPosition = (existingNodes: Node[]) => ({
  x: 400,
  y: 350 + existingNodes.length * 60
});

const KnowledgeTree = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [isAddNoteOpen, setAddNoteOpen] = useState(false);
  const [isEditNoteOpen, setEditNoteOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNode, setDeletingNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes from backend on mount
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedNotes = await fetchNotes();
        console.log('Fetched notes:', fetchedNotes); // Debug log
        
        const transformedNodes = fetchedNotes.map((note, index) => ({
          id: note._id,
          type: 'sub' as const,
          position: note.position && 
                   typeof note.position.x === 'number' && 
                   typeof note.position.y === 'number' 
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
        }));
        
        setNodes(transformedNodes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to fetch notes');
        toast({
          title: "Load failed",
          description: "Could not load notes from database",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [setNodes, toast]);

  // Add note handler
  const handleAddNoteSubmit = async (data: { 
    name: string; 
    content: string; 
    color: string; 
    tag: string; 
    imageUrl?: string 
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPosition = calculateDefaultPosition(nodes);
      
      const note = await addNote({
        name: data.name,
        content: data.content,
        color: data.color,
        tag: data.tag,
        imageUrl: data.imageUrl,
        position: newPosition,
      });
      
      const finalPosition = note.position || newPosition;
      
      const newNode: Node = {
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
      };
      
      setNodes(prev => [...prev, newNode]);
      setAddNoteOpen(false);
      
      toast({ 
        title: 'Note added', 
        description: `Note "${data.name}" was added successfully.` 
      });
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note');
      toast({
        title: "Add failed",
        description: "Could not add the note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit note handler
  const handleEditNoteSubmit = async (data: { 
    name: string; 
    content: string; 
    color: string; 
    tag: string; 
    imageUrl?: string 
  }) => {
    if (!editingNode) return;
    
    setLoading(true);
    setError(null);
    
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
      
      toast({ 
        title: 'Note updated', 
        description: `Note "${data.name}" was updated successfully.` 
      });
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note');
      toast({
        title: "Update failed",
        description: "Could not update the note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node position updates when nodes are dragged
  const onNodeDragStop = useCallback(async (event: any, node: Node) => {
    try {
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
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality with database
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
    console.log('Edit node triggered for:', nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log('Opening edit modal for node:', node.data.label);
      setEditingNode(node);
      setEditNoteOpen(true);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    console.log('Delete node triggered for:', nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log('Opening delete dialog for node:', node.data.label);
      setDeletingNode(node);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteNote(deletingNode.id);
      
      setNodes(prev => prev.filter(node => node.id !== deletingNode.id));
      
      toast({ 
        title: 'Note deleted', 
        description: `Note "${deletingNode.data.label}" was deleted successfully.` 
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingNode(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
      toast({
        title: "Delete failed",
        description: "Could not delete the note",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && nodes.length === 0) {
    return (
      <div className="w-full h-screen bg-tree-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your knowledge tree...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && nodes.length === 0) {
    return (
      <div className="w-full h-screen bg-tree-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load knowledge tree</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-tree-background relative">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 z-50 bg-black/80 text-white p-2 text-xs max-w-xs">
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
      {/* Edit Note Modal */}
{editingNode && (
  <Dialog open={isEditNoteOpen} onOpenChange={setEditNoteOpen}>
    <EditNoteModal
      onClose={() => setEditNoteOpen(false)}
      onEditNote={handleEditNoteSubmit}
      initialValues={{
        name: String(editingNode.data.label || ''),
        content: String(editingNode.data.description || ''),
        color: String(editingNode.data.color || 'red'),
        tag: String(editingNode.data.tag || ''),
        imageUrl: editingNode.data.imageUrl ? String(editingNode.data.imageUrl) : undefined,
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
        noteName={String(deletingNode?.data.label || '')}
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