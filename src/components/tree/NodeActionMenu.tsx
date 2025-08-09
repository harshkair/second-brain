import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NodeActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  nodeId: string;
  nodeType?: 'central' | 'sub' | 'adjacent';
}

const NodeActionMenu = ({ onEdit, onDelete, nodeId, nodeType = 'sub' }: NodeActionMenuProps) => {
  const getButtonStyles = () => {
    switch (nodeType) {
      case 'central':
        return "absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-central/20 cursor-pointer";
      case 'adjacent':
        return "absolute top-1 right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-adjacent/20 cursor-pointer";
      default:
        return "absolute top-1 right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-tree-sub/20 cursor-pointer";
    }
  };

  const getIconStyles = () => {
    switch (nodeType) {
      case 'central':
        return "w-3 h-3 text-tree-central";
      case 'adjacent':
        return "w-2 h-2 text-tree-adjacent";
      default:
        return "w-2.5 h-2.5 text-tree-sub";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={getButtonStyles()}
          title="Node actions"
        >
          <MoreVertical className={getIconStyles()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => {
          console.log('Edit clicked for node:', nodeId);
          onEdit();
        }} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          console.log('Delete clicked for node:', nodeId);
          onDelete();
        }} className="cursor-pointer text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeActionMenu;
