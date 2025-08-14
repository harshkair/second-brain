import { useForm, FormProvider } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { uploadImage } from '@/api/notes';

interface AddNoteModalProps {
  onClose: () => void;
  onAddNote: (data: { name: string; content: string; color: string; tag: string; imageUrl?: string }) => void;
}

const colorOptions = [
  { value: 'red', color: '#ef4444', label: 'Red' },
  { value: 'blue', color: '#3b82f6', label: 'Blue' },
  { value: 'green', color: '#1db981', label: 'Green' },
  { value: 'purple', color: '#8b5cf6', label: 'Purple' },  
  { value: 'yellow', color: '#eab308', label: 'Yellow' }, 
];

const tagOptions = [
  'Work',
  'Personal',
  'Important',
  'Idea',
  'Other',
];

export default function AddNoteModal({ onClose, onAddNote }: AddNoteModalProps) {
  const methods = useForm({ defaultValues: { name: '', content: '', color: 'red', tag: '' } });
  const { handleSubmit, register, setValue, watch } = methods;
  const color = watch('color');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: any) => {
    let imageUrl = '';
    if (file) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(file);
      } catch (err) {
        setUploading(false);
        alert('Image upload failed');
        return;
      }
      setUploading(false);
    }
    onAddNote({ ...data, imageUrl });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Note</DialogTitle>
      </DialogHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Note Name</FormLabel>
            <Input {...register('name', { required: true })} placeholder="Enter note name" />
          </FormItem>
          <FormItem>
            <FormLabel>Note Content</FormLabel>
            <Textarea {...register('content', { required: true })} placeholder="Enter note content" />
          </FormItem>
          <FormItem>
            <FormLabel>Color</FormLabel>
            <div className="flex gap-3 mt-2">
              {colorOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setValue('color', opt.value);
                    console.log('Color selected:', opt.value); // Debug log
                  }}
                  className={`w-8 h-8 rounded-full border-4 transition-all duration-200 flex items-center justify-center focus:outline-none ${
                    color === opt.value 
                      ? 'border-white shadow-lg ring-2 ring-gray-800 ring-offset-2 scale-110' 
                      : 'border-gray-400 hover:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: opt.color }}
                  aria-label={`Select ${opt.label} color`}
                >
                  {/* More visible selection indicator */}
                  {color === opt.value && (
                    <div className="w-0 h-0 bg-white rounded-full shadow-md border border-gray-300"></div>
                  )}
                </button>
              ))}
            </div>
            {/* Debug display - remove this after testing */}
            <div className="text-xs text-gray-500 mt-2">
              Selected: {color}
            </div>
            <input
              type="hidden"
              {...register('color')}
              value={color}
            />
          </FormItem>
          {/* <div className="p-2 bg-gray-100 rounded text-sm">     Debugging info for color
            <strong>Debug:</strong> Current selected color: {color}
            <br />
            <strong>Form values:</strong> {JSON.stringify(watch())}
          </div> */}
          <FormItem>
            <FormLabel>Tag</FormLabel>
            <Select value={watch('tag')} onValueChange={val => setValue('tag', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {tagOptions.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          <FormItem>
            <FormLabel>Image</FormLabel>
            <Input type="file" accept="image/*" onChange={onFileChange} />
            {preview && (
              <img src={preview} alt="Preview" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
            )}
          </FormItem>
          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Note'}</Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
}