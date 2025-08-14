import { useForm, FormProvider } from 'react-hook-form';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { uploadImage } from '@/api/notes';

interface EditNoteModalProps {
  onClose: () => void;
  onEditNote: (data: { name: string; content: string; color: string; tag: string; imageUrl?: string }) => void;
  initialValues: { name: string; content: string; color: string; tag: string; imageUrl?: string };
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

export default function EditNoteModal({ onClose, onEditNote, initialValues }: EditNoteModalProps) {
  const methods = useForm({ defaultValues: initialValues });
  const { handleSubmit, register, setValue, watch } = methods;
  const color = watch('color');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialValues.imageUrl || null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(initialValues.imageUrl || null);
    }
  };

  const onSubmit = async (data: any) => {
    let imageUrl = initialValues.imageUrl || '';
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
    onEditNote({ ...data, imageUrl });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Note</DialogTitle>
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
            <RadioGroup value={color} onValueChange={val => setValue('color', val)} className="flex gap-4 mt-2">
              {colorOptions.map(opt => (
                <div key={opt.value} className="flex items-center">
                  <label 
                    htmlFor={opt.value} 
                    className="cursor-pointer"
                  >
                    <RadioGroupItem 
                      value={opt.value} 
                      id={opt.value}
                      className={`w-6 h-6 border-2 ${color === opt.value ? 'ring-2 ring-offset-2 ring-black-400' : ''}`}
                      style={{ backgroundColor: opt.color, borderColor: 'white' }}
                    />
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormItem>
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
            <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
} 