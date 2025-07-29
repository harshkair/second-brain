import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface SubNodeProps {
  data: {
    label: string;
    type?: string;
  };
}

const SubNode = memo(({ data }: SubNodeProps) => {
  return (
    <div className="bg-card border border-tree-sub rounded-md p-4 min-w-[140px] shadow-md">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-tree-sub mb-1">{data.label}</h3>
        {data.type && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{data.type}</span>
        )}
      </div>
    </div>
  );
});

SubNode.displayName = 'SubNode';

export default SubNode;