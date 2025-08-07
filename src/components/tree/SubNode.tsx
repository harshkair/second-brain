import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubNodeProps {
  data: {
    label: string;
    type?: string;
    imageUrl?: string;
  };
  onNodeAction?: (nodeId: string) => void;
  id?: string;
}

const SubNode = memo(({ data, onNodeAction, id }: SubNodeProps) => {
  return (
    <div className="bg-card border border-tree-sub rounded-md p-4 min-w-[140px] shadow-md relative group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Button */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-1 right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-sub/20"
        onClick={() => onNodeAction?.(id || '')}
      >
        <MoreVertical className="w-2.5 h-2.5 text-tree-sub" />
      </Button>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-tree-sub mb-1">{data.label}</h3>
        {data.type && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{data.type}</span>
        )}
        {data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.label}
            style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, margin: '8px auto' }}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
});

SubNode.displayName = 'SubNode';

export default SubNode;