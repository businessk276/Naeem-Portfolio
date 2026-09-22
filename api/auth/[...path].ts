import bcrypt from 'bcryptjs';
import { getBearerUser, publicError } from '../../server/admin-api.js';
import { db } from '../../server/db.js';

function getPathSegments(req: { query?: Record<string, unknown>; url?: string }) {
  const raw = req.query?.path;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) return raw.split('/').filter(Boolean);
  const urlPath = String(req.url || '').split('?')[0];
  return urlPath.replace(/^\/api\/auth\/?/, '').split('/').filter(Boolean);
}

export default async function handler(req: any, res: any) {
  const segments = getPathSegments(req);
  const method = String(req.method || 'GET').toUpperCase();
  const route = segments[0] || '';

  try {
    await db.ready;

    if (route === 'me' && method === 'GET') {
      const auth = getBearerUser(req);
      if ('error' in auth) return res.status(auth.status).json({ error: auth.error });
      const user = db.getRaw().users.find(item => item.id === auth.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ id: user.id, email: user.email, name: user.name, role: user.role });
    }

    if (route === 'update-credentials' && method === 'PUT') {
      const auth = getBearerUser(req);
      if ('error' in auth) return res.status(auth.status).json({ error: auth.error });

      const { email, current_password, new_password, name } = req.body || {};
      const raw = db.getRaw();
      const userIndex = raw.users.findIndex(item => item.id === auth.user.id);
      if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

      const user = raw.users[userIndex];
      if (new_password) {
        if (!current_password) {
          return res.status(400).json({ error: 'Current password is required to set a new password' });
        }
        if (!bcrypt.compareSync(current_password, user.password_hash)) {
          return res.status(400).json({ error: 'Current password does not match' });
        }
        if (String(new_password).length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        user.password_hash = bcrypt.hashSync(new_password, 10);
      }

      if (email) user.email = String(email).trim();
      if (name) user.name = String(name).trim();
      user.updated_at = new Date().toISOString();
      raw.users[userIndex] = user;
      await db.save(raw);

      return res.status(200).json({
        success: true,
        message: 'Account credentials updated successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }

    return res.status(404).json({ error: 'Auth route not found' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: publicError(error, 'Unable to update account') });
  }
}
