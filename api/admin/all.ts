import jwt from 'jsonwebtoken';
import { db } from '../../server/db.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  try {
    jwt.verify(
      authorization.slice(7),
      process.env.JWT_SECRET || 'md-jobaer-portfolio-super-secret-key-2026',
    );

    await db.ready;
    const raw = db.getRaw();
    const safeUsers = raw.users.map(({ password_hash, ...user }) => user);

    return res.status(200).json({
      ...raw,
      users: safeUsers,
      stats: {
        total_projects: raw.projects.length,
        published_projects: raw.projects.filter(project => project.status === 'published').length,
        total_videos: raw.youtube_videos.length,
        total_messages: raw.contact_messages.length,
        unread_messages: raw.contact_messages.filter(message => !message.is_read).length,
        skills_count: raw.skills.length,
        experience_count: raw.experience.length,
        education_count: raw.education.length,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    console.error('Admin state API error:', error);
    return res.status(500).json({ error: 'Unable to load admin state' });
  }
}