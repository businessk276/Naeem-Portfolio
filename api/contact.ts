import { db } from '../server/db.js';
import { publicError } from '../server/admin-api.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await db.ready;
    const { name, email, project_type, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const raw = db.getRaw();
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 100),
      project_type: String(project_type || 'General Inquiry').trim().slice(0, 100),
      message: String(message).trim().slice(0, 3000),
      is_read: false,
      is_replied: false,
      created_at: new Date().toISOString(),
    };

    raw.contact_messages.unshift(newMessage);
    await db.save(raw);

    return res.status(201).json({
      success: true,
      message: 'Your message has been received! Md. Jobaer will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: publicError(error, 'Server error processing contact message') });
  }
}
