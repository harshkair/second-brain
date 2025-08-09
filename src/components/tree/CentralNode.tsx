import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeActionMenu from './NodeActionMenu';

interface CentralNodeProps {
  data: {
    label: string;
    description?: string;
    onEdit?: (nodeId: string) => void;
    onDelete?: (nodeId: string) => void;
    id?: string;
  };
  id?: string;
}

const CentralNode = memo(({ data, id }: CentralNodeProps) => {
  return (
    <div className="bg-card border-2 border-tree-central rounded-lg p-6 min-w-[200px] shadow-lg relative group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-tree-connection border-tree-connection" />
      
      {/* Node Action Menu */}
      <NodeActionMenu
        onEdit={() => data.onEdit?.(id || '')}
        onDelete={() => data.onDelete?.(id || '')}
        nodeId={id || ''}
        nodeType="central"
      />
      
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