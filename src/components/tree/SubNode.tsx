import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeActionMenu from './NodeActionMenu';

interface SubNodeProps {
  data: {
    label: string;
    type?: string;
    imageUrl?: string;
    onEdit?: (nodeId: string) => void;
    onDelete?: (nodeId: string) => void;
    id?: string;
  };
  id?: string;
}

const SubNode = memo(({ data, id }: SubNodeProps) => {
  return (
    <div className="bg-card border border-tree-sub rounded-md p-4 min-w-[140px] shadow-md relative group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Menu */}
      <NodeActionMenu
        onEdit={() => data.onEdit?.(id || '')}
        onDelete={() => data.onDelete?.(id || '')}
        nodeId={id || ''}
        nodeType="sub"
      />
      
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