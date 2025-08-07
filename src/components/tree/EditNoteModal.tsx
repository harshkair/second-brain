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
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
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
                <RadioGroupItem key={opt.value} value={opt.value} className={`border-2 flex items-center ${color === opt.value ? 'ring-2 ring-offset-2' : ''}`}> 
                  <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: opt.value }} />
                  {opt.label}
                </RadioGroupItem>
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