import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface AdjacentNodeProps {
  data: {
    label: string;
    category?: string;
  };
}

const AdjacentNode = memo(({ data }: AdjacentNodeProps) => {
  return (
    <div className="bg-card border border-tree-adjacent rounded-md p-3 min-w-[120px] shadow-sm">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
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