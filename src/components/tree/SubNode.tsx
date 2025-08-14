import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import NodeActionMenu from './NodeActionMenu';

interface SubNodeProps {
  data: {
    label: string;
    type?: string;
    imageUrl?: string;
    onEdit?: (nodeId: string) => void;
    onDelete?: (nodeId: string) => void;
    id?: string;
    color?: string;
    description?: string;
  };
  id?: string;
  selected?: boolean;
}

const SubNode = memo(({ data, id, selected }: SubNodeProps) => {
  return (
    <div 
      className="bg-card border rounded-md p-4 shadow-md relative group h-full w-full min-w-[140px] min-h-[80px]"
      style={{
        borderColor: data.color || '#e2e8f0',
        borderWidth: '3px',
        backgroundColor: data.color ? `${data.color}15` : undefined,
      }}
    >
      {/* Node Resizer - only show when selected */}
      <NodeResizer
        color={data.color || '#ff0071'}
        isVisible={selected}
        minWidth={140}
        minHeight={80}
        maxWidth={400}
        maxHeight={300}
      />
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 bg-tree-connection border-tree-connection" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 bg-tree-connection border-tree-connection" 
      />
      
      {/* Node Action Menu */}
      <NodeActionMenu
        onEdit={() => data.onEdit?.(id || '')}
        onDelete={() => data.onDelete?.(id || '')}
        nodeId={id || ''}
        nodeType="sub"
      />
      
      <div className="text-center h-full flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-tree-sub mb-1 break-words">
          {data.label}
        </h3>
        {data.type && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {data.type}
          </span>
        )}
        {data.description && (
          <p className="text-sm text-muted-foreground mb-2 break-words overflow-hidden">
            {data.description}
          </p>
        )}
        {data.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={data.imageUrl}
              alt={data.label}
              className="max-w-full h-auto object-contain rounded"
              style={{ 
                maxHeight: '120px',
                margin: '8px auto',
              }}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
});

SubNode.displayName = 'SubNode';

export default SubNode;