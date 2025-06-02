export interface IFile {
  filename: string;
  path: string;
  encoding?: string;
  buffer: Buffer;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface IFileResultUploaded {
  originFileUrl: string;
  thumbFileUrl?: string;
  message?: string;
  fileName: string;
  originalName: string;
  size?: number;
  mimetype?: string;
  type?: string | null;
}

