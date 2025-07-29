import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdjacentNodeProps {
  data: {
    label: string;
    category?: string;
  };
  onNodeAction?: (nodeId: string) => void;
  id?: string;
}

const AdjacentNode = memo(({ data, onNodeAction, id }: AdjacentNodeProps) => {
  return (
    <div className="bg-card border border-tree-adjacent rounded-md p-3 min-w-[120px] shadow-sm relative group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Button */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-1 right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-adjacent/20"
        onClick={() => onNodeAction?.(id || '')}
      >
        <MoreVertical className="w-2 h-2 text-tree-adjacent" />
      </Button>
      
      <div className="text-center">
        <h4 className="text-base font-medium text-tree-adjacent">{data.label}</h4>
        {data.category && (
          <span className="text-xs text-muted-foreground">{data.category}</span>
        )}
      </div>
    </div>
  );
});

AdjacentNode.displayName = 'AdjacentNode';

export default AdjacentNode;