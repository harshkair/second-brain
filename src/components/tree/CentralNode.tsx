import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CentralNodeProps {
  data: {
    label: string;
    description?: string;
  };
  onNodeAction?: (nodeId: string) => void;
  id?: string;
}

const CentralNode = memo(({ data, onNodeAction, id }: CentralNodeProps) => {
  return (
    <div className="bg-card border-2 border-tree-central rounded-lg p-6 min-w-[200px] shadow-lg relative group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Button */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-central/20"
        onClick={() => onNodeAction?.(id || '')}
      >
        <MoreVertical className="w-3 h-3 text-tree-central" />
      </Button>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-tree-central mb-2">{data.label}</h2>
        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description}</p>
        )}
      </div>
    </div>
  );
});

CentralNode.displayName = 'CentralNode';

export default CentralNode;