import { Note, CreateNoteRequest, UpdateNoteRequest, UploadResponse } from '../types/Note';

const API_URL = 'http://localhost:5000';

// Note-related types
export interface Edge {
  id: string;
  source: string;
  target: string;
  style: {
    stroke: string;
    strokeWidth: number;
  };
  type: string;
  animated: boolean;
  label: string;
}

export interface CreateEdgeRequest {
  source: string;
  target: string;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  type?: string;
  animated?: boolean;
  label?: string;
}

// NOTES API

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/notes/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data: UploadResponse = await res.json();
  return data.url;
}

export async function addNote(note: CreateNoteRequest): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function updateNote(id: string, note: UpdateNoteRequest): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
}

// EDGES API

export async function fetchEdges(): Promise<Edge[]> {
  const res = await fetch(`${API_URL}/notes/edges`);
  if (!res.ok) throw new Error('Failed to fetch edges');
  return res.json();
}

export async function createEdge(edge: CreateEdgeRequest): Promise<Edge> {
  const res = await fetch(`${API_URL}/notes/edges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(edge),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create edge');
  }
  return res.json();
}

export async function deleteEdge(edgeId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/notes/edges/${edgeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete edge');
  return res.json();
}

export async function fetchEdgesForNote(noteId: string): Promise<Edge[]> {
  const res = await fetch(`${API_URL}/notes/edges/note/${noteId}`);
  if (!res.ok) throw new Error('Failed to fetch edges for note');
  return res.json();
}