import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeActionMenu from './NodeActionMenu';

interface AdjacentNodeProps {
  data: {
    label: string;
    category?: string;
    onEdit?: (nodeId: string) => void;
    onDelete?: (nodeId: string) => void;
    id?: string;
  };
  id?: string;
}

const AdjacentNode = memo(({ data, id }: AdjacentNodeProps) => {
  return (
    <div className="bg-card border border-tree-adjacent rounded-md p-3 min-w-[120px] shadow-sm relative group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Menu */}
      <NodeActionMenu
        onEdit={() => data.onEdit?.(id || '')}
        onDelete={() => data.onDelete?.(id || '')}
        nodeId={id || ''}
        nodeType="adjacent"
      />
      
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