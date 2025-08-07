import typesense from '../typesenseClient.js';

export async function addOrUpdateNote(note) {
  const doc = {
    id: note._id.toString(),
    name: note.name,
    content: note.content,
    color: note.color,
    tag: note.tag,
    position_x: note.position?.x || 0,
    position_y: note.position?.y || 0,
    createdAt: new Date(note.createdAt).getTime(),
    updatedAt: new Date(note.updatedAt).getTime(),
  };
  await typesense.collections('notes').upsertDocument(doc);
}

export async function deleteNote(noteId) {
  await typesense.collections('notes').documents(noteId).delete();
}