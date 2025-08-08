export interface Note {
  _id?: string;
  name: string;
  content: string;
  color: string;
  tag?: string;
  imageUrl?: string;
  position: {
    x: number;
    y: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  name: string;
  content: string;
  color: string;
  tag?: string;
  imageUrl?: string;
  position: {
    x: number;
    y: number;
  };
}

export interface UpdateNoteRequest {
  name?: string;
  content?: string;
  color?: string;
  tag?: string;
  imageUrl?: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  url: string;
}
