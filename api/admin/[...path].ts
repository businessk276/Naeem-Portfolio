import {
  ENTITY_ROUTES,
  EntityPath,
  createEntityRecord,
  deleteEntityRecord,
  getBearerUser,
  getPathSegments,
  parseRequestBody,
  publicError,
  reorderEntityRecords,
  updateEntityRecord,
  updateProfileRecord,
  updateSettingsRecord,
  updateSocialLinks,
  uploadImage,
} from '../../server/admin-api.js';
import { db } from '../../server/db.js';

export default async function handler(req: any, res: any) {
  const auth = getBearerUser(req);
  if ('error' in auth) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const segments = getPathSegments(req);
  const method = String(req.method || 'GET').toUpperCase();
  const body = parseRequestBody(req.body) as Record<string, any>;

  try {
    await db.ready;

    if (segments[0] === 'upload' && method === 'POST') {
      const result = await uploadImage(body.dataUrl, body.filename);
      return res.status(200).json(result);
    }

    if (segments[0] === 'profile' && method === 'PUT') {
      const profile = await updateProfileRecord(body);
      return res.status(200).json({ success: true, profile });
    }

    if (segments[0] === 'settings' && method === 'PUT') {
      const settings = await updateSettingsRecord(body);
      return res.status(200).json({ success: true, settings });
    }

    if (segments[0] === 'social_links' && method === 'PUT') {
      const social_links = await updateSocialLinks(body);
      return res.status(200).json({ success: true, social_links });
    }

    const entityPath = segments[0] as EntityPath;
    if (entityPath && ENTITY_ROUTES[entityPath]) {
      if (method === 'GET' && segments.length === 1) {
        const raw = db.getRaw() as any;
        return res.status(200).json(raw[ENTITY_ROUTES[entityPath].key] || []);
      }

      if (method === 'POST' && segments[1] === 'reorder') {
        if (!Array.isArray(body.ids)) {
          return res.status(400).json({ error: 'ids array required' });
        }
        const items = await reorderEntityRecords(entityPath, body.ids);
        return res.status(200).json({ success: true, items });
      }

      if (method === 'POST' && segments.length === 1) {
        const item = await createEntityRecord(entityPath, body);
        return res.status(201).json({ success: true, item });
      }

      if (method === 'PUT' && segments[1]) {
        const item = await updateEntityRecord(entityPath, String(segments[1]), body);
        return res.status(200).json({ success: true, item });
      }

      if (method === 'DELETE' && segments[1]) {
        await deleteEntityRecord(entityPath, String(segments[1]));
        return res.status(200).json({ success: true, message: 'Item deleted' });
      }
    }

    return res.status(404).json({ error: 'Admin route not found' });
  } catch (error: any) {
    console.error('Admin API error:', error);
    const status = error?.status === 404 ? 404 : 500;
    return res.status(status).json({
      error: publicError(error, 'Failed to save changes to Firebase'),
    });
  }
}
