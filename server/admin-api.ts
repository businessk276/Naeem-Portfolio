import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { db, Database } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'md-jobaer-portfolio-super-secret-key-2026';

export const ENTITY_ROUTES = {
  projects: { key: 'projects', idPrefix: 'proj_' },
  skills: { key: 'skills', idPrefix: 'sk_' },
  services: { key: 'services', idPrefix: 'srv_' },
  experience: { key: 'experience', idPrefix: 'exp_' },
  education: { key: 'education', idPrefix: 'edu_' },
  certifications: { key: 'certifications', idPrefix: 'cert_' },
  awards: { key: 'awards', idPrefix: 'aw_' },
  activities: { key: 'activities', idPrefix: 'act_' },
  process: { key: 'process_steps', idPrefix: 'prc_' },
  testimonials: { key: 'testimonials', idPrefix: 'test_' },
  videos: { key: 'youtube_videos', idPrefix: 'yt_' },
  hobbies: { key: 'hobbies', idPrefix: 'hb_' },
} as const;

export type EntityPath = keyof typeof ENTITY_ROUTES;

type AuthSuccess = { user: { id: string; email: string; role: string } };
type AuthFailure = { error: string; status: 401 };

export function getBearerUser(req: { headers: Record<string, unknown> }): AuthSuccess | AuthFailure {
  const authHeader = String(req.headers.authorization || req.headers.Authorization || '');
  if (!authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized. Admin token required.', status: 401 };
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as { id: string; email: string; role: string };
    return { user: decoded };
  } catch {
    return { error: 'Invalid or expired token.', status: 401 };
  }
}

export function parseRequestBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body && typeof body === 'object' ? body : {};
}

export function getPathSegments(req: { query?: Record<string, unknown>; url?: string }): string[] {
  const raw = req.query?.path;
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return raw.split('/').filter(Boolean);
  }

  const urlPath = String(req.url || '').split('?')[0];
  const stripped = urlPath.replace(/^\/api\/admin\/?/, '');
  return stripped.split('/').filter(Boolean);
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function updateProfileRecord(body: Record<string, unknown>) {
  await db.ready;
  const raw = db.getRaw();
  raw.profile = {
    ...raw.profile,
    ...body,
    id: raw.profile.id,
    updated_at: new Date().toISOString(),
  } as typeof raw.profile;
  await db.save(raw);
  return raw.profile;
}

export async function updateSettingsRecord(body: Record<string, unknown>) {
  await db.ready;
  const raw = db.getRaw();
  raw.site_settings = {
    ...raw.site_settings,
    ...body,
    id: raw.site_settings.id,
  } as typeof raw.site_settings;
  await db.save(raw);
  return raw.site_settings;
}

export async function updateSocialLinks(body: unknown) {
  await db.ready;
  const raw = db.getRaw();
  if (!Array.isArray(body)) {
    throw new Error('social_links must be an array');
  }
  raw.social_links = body as typeof raw.social_links;
  await db.save(raw);
  return raw.social_links;
}

export async function createEntityRecord(entityPath: EntityPath, itemData: Record<string, any>) {
  await db.ready;
  const { key, idPrefix } = ENTITY_ROUTES[entityPath];
  const raw = db.getRaw() as any;
  const list = raw[key] || [];

  if (key === 'youtube_videos') {
    const extractedId = Database.extractYouTubeId(itemData.youtube_url);
    if (extractedId) {
      itemData.video_id = extractedId;
      if (!itemData.thumbnail_url) {
        itemData.thumbnail_url = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
      }
    }
  }

  const newItem = {
    ...itemData,
    id: itemData.id || `${idPrefix}${Date.now()}`,
    sort_order: itemData.sort_order ?? list.length + 1,
    created_at: itemData.created_at || new Date().toISOString(),
  };

  list.push(newItem);
  raw[key] = list;
  await db.save(raw);
  return newItem;
}

export async function updateEntityRecord(entityPath: EntityPath, id: string, itemData: Record<string, any>) {
  await db.ready;
  const { key } = ENTITY_ROUTES[entityPath];
  const raw = db.getRaw() as any;
  const list = raw[key] || [];
  const idx = list.findIndex((item: any) => String(item.id) === String(id));
  if (idx === -1) {
    const error = new Error('Item not found');
    (error as any).status = 404;
    throw error;
  }

  if (key === 'youtube_videos' && itemData.youtube_url) {
    const extractedId = Database.extractYouTubeId(itemData.youtube_url);
    if (extractedId) {
      itemData.video_id = extractedId;
      if (!itemData.thumbnail_url || String(itemData.thumbnail_url).includes('youtube.com')) {
        itemData.thumbnail_url = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
      }
    }
  }

  list[idx] = { ...list[idx], ...itemData, id };
  raw[key] = list;
  await db.save(raw);
  return list[idx];
}

export async function deleteEntityRecord(entityPath: EntityPath, id: string) {
  await db.ready;
  const { key } = ENTITY_ROUTES[entityPath];
  const raw = db.getRaw() as any;
  raw[key] = (raw[key] || []).filter((item: any) => String(item.id) !== String(id));
  await db.save(raw);
}

export async function reorderEntityRecords(entityPath: EntityPath, ids: string[]) {
  await db.ready;
  const { key } = ENTITY_ROUTES[entityPath];
  const raw = db.getRaw() as any;
  const list = raw[key] || [];
  const map = new Map(list.map((item: any) => [String(item.id), item]));
  const reordered = ids
    .map((id, index) => {
      const item = map.get(String(id));
      return item ? { ...item, sort_order: index + 1 } : null;
    })
    .filter(Boolean);

  list.forEach((item: any) => {
    if (!ids.includes(String(item.id))) {
      reordered.push({ ...item, sort_order: reordered.length + 1 });
    }
  });

  raw[key] = reordered;
  await db.save(raw);
  return reordered;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid base64 image format');
  }
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 4.5 * 1024 * 1024) {
    throw new Error('Image size exceeds 4.5MB Vercel upload limit');
  }
  return { ext, buffer };
}

function candidateBuckets() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '';
  return [...new Set([
    process.env.FIREBASE_STORAGE_BUCKET,
    process.env.VITE_FIREBASE_STORAGE_BUCKET,
    projectId ? `${projectId}.appspot.com` : '',
    projectId ? `${projectId}.firebasestorage.app` : '',
  ].filter(Boolean) as string[])];
}

async function saveToFirebaseStorage(buffer: Buffer, storagePath: string, contentType: string) {
  const apps = getApps();
  if (apps.length === 0) {
    throw new Error('Firebase Admin is not initialized');
  }

  const downloadToken = randomUUID();
  let lastError: unknown;

  for (const bucketName of candidateBuckets()) {
    try {
      const bucket = getStorage(apps[0]).bucket(bucketName);
      const file = bucket.file(storagePath);
      await file.save(buffer, {
        resumable: false,
        metadata: {
          contentType,
          metadata: { firebaseStorageDownloadTokens: downloadToken },
        },
        public: false,
      });

      return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Firebase Storage upload failed');
}

function saveToLocalDisk(buffer: Buffer, uniqueFilename: string) {
  const uploadsDir = process.env.VERCEL === '1'
    ? path.join('/tmp', 'uploads')
    : path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, uniqueFilename), buffer);
  return `/uploads/${uniqueFilename}`;
}

export async function uploadImage(dataUrl: string, filename?: string) {
  if (!dataUrl) {
    throw new Error('dataUrl is required');
  }

  const { ext, buffer } = parseDataUrl(dataUrl);
  const safeName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueFilename = `${safeName}_${Date.now()}.${ext}`;
  const storagePath = `uploads/${uniqueFilename}`;
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  try {
    const url = await saveToFirebaseStorage(buffer, storagePath, contentType);
    return { success: true, url, filename: uniqueFilename, size: buffer.length };
  } catch (error) {
    if (process.env.VERCEL === '1') {
      throw new Error(
        `Firebase Storage upload failed: ${errorMessage(error, 'unknown error')}. Enable Storage in the Firebase console and set FIREBASE_STORAGE_BUCKET.`,
      );
    }

    const url = saveToLocalDisk(buffer, uniqueFilename);
    return { success: true, url, filename: uniqueFilename, size: buffer.length };
  }
}

export function publicError(error: unknown, fallback: string) {
  return errorMessage(error, fallback);
}
