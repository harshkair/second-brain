import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TreeHeaderProps {
  onSearch: (query: string) => void;
  onAddNote: () => void;
  searchQuery: string;
}

const TreeHeader = ({ onSearch, onAddNote, searchQuery }: TreeHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search knowledge tree..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>

        {/* Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-foreground">Knowledge Tree</h1>
        </div>

        {/* Add Note Button */}
        <Button 
          onClick={onAddNote}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Note
        </Button>
      </div>
    </div>
  );
};

export default TreeHeader;