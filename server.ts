import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import {
  createEntityRecord,
  deleteEntityRecord,
  ENTITY_ROUTES,
  EntityPath,
  publicError,
  reorderEntityRecords,
  updateEntityRecord,
  updateProfileRecord,
  updateSettingsRecord,
  updateSocialLinks,
  uploadImage,
} from './server/admin-api.js';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'md-jobaer-portfolio-super-secret-key-2026';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (error) {
  console.warn('Could not create uploads directory:', error);
}

// Copy default profile image to uploads if available
try {
  const defaultProfPath = path.join(process.cwd(), 'src/assets/images/jobaer_profile_1789985465704.jpg');
  const targetProfPath = path.join(UPLOADS_DIR, 'jobaer_profile.jpg');
  if (fs.existsSync(defaultProfPath) && !fs.existsSync(targetProfPath)) {
    fs.copyFileSync(defaultProfPath, targetProfPath);
  }
} catch (e) {
  console.warn('Could not copy profile image:', e);
}

// Auth middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export async function createApp() {
  await db.ready;
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================
  // PUBLIC API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Public portfolio data
  app.get('/api/portfolio', (req, res) => {
    try {
      const data = db.getPublicPortfolio();
      res.json(data);
    } catch (err) {
      console.error('Error fetching public portfolio:', err);
      res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
  });

  // Download CV endpoint
  app.get('/api/download-cv', (req, res) => {
    try {
      const data = db.getPublicPortfolio();
      const profile = data.profile;
      
      // If a custom resume URL is set, redirect to it
      if (profile.resume_url && profile.resume_url.trim() !== '') {
        return res.redirect(profile.resume_url);
      }

      // Generate a clean, styled HTML printable CV document
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Curriculum Vitae - ${profile.name}</title>
  <style>
    @page { margin: 15mm; size: A4; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; line-height: 1.5; font-size: 13px; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; text-transform: uppercase; margin: 0 0 4px 0; color: #000; letter-spacing: 0.05em; }
    .subtitle { color: #d32f2f; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
    .contact { font-size: 12px; color: #444; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px; display: flex; flex-wrap: wrap; gap: 12px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #d32f2f; border-bottom: 1.5px solid #d32f2f; padding-bottom: 3px; margin: 20px 0 10px 0; }
    .item { margin-bottom: 12px; }
    .item-header { display: flex; justify-content: space-between; font-weight: bold; }
    .item-sub { color: #555; font-size: 12px; margin-bottom: 4px; }
    ul { margin: 4px 0 0 18px; padding: 0; }
    li { margin-bottom: 3px; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .skill-box { background: #f9f9f9; border: 1px solid #eee; padding: 5px 8px; border-radius: 4px; font-size: 11.5px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; padding: 12px 16px; background: #fff3f2; border: 1px solid #ffcdd2; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-weight: 600; color: #c62828;">Official Candidate CV • ${profile.name}</span>
    <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; text-transform: uppercase; font-size: 11px;">Print / Save as PDF</button>
  </div>

  <h1>${profile.name}</h1>
  <div class="subtitle">${profile.professional_title}</div>
  <div class="contact">
    <span>📍 ${profile.location}</span>
    <span>📞 ${profile.phone}</span>
    <span>✉️ ${profile.email}</span>
    <span>🛡️ ${profile.iqama_status}</span>
    <span>🔗 linkedin.com/in/md-jobaer-ahamed-82a382186</span>
  </div>

  <div class="section-title">Professional Summary</div>
  <p style="margin: 0 0 15px 0;">${profile.about_description || profile.short_intro}</p>

  <div class="section-title">Core Competencies & Technical Skills</div>
  <div class="skills-grid">
    ${data.skills.map(s => `<div class="skill-box"><strong>${s.name}</strong> • <span style="color: #666;">${s.category}</span></div>`).join('')}
  </div>

  <div class="section-title">Professional Experience</div>
  ${data.experience.map(exp => `
    <div class="item">
      <div class="item-header">
        <span>${exp.position}</span>
        <span style="font-family: monospace; font-size: 11px;">${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date}</span>
      </div>
      <div class="item-sub">${exp.company} • ${exp.location}</div>
      ${exp.responsibilities ? `<ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')}

  <div class="section-title">Verified Certifications</div>
  ${data.certifications.map(c => `
    <div class="item" style="margin-bottom: 8px;">
      <div class="item-header">
        <span>${c.name}</span>
        <span style="font-family: monospace; font-size: 11px;">${c.issue_date}</span>
      </div>
      <div class="item-sub">${c.issuer}</div>
    </div>
  `).join('')}

  <div class="section-title">Education</div>
  ${data.education.map(e => `
    <div class="item" style="margin-bottom: 8px;">
      <div class="item-header">
        <span>${e.degree}</span>
        <span style="font-family: monospace; font-size: 11px;">${e.start_year} – ${e.end_year} ${e.grade ? `(CGPA: ${e.grade})` : ''}</span>
      </div>
      <div class="item-sub">${e.institution}, ${e.location}</div>
    </div>
  `).join('')}

</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="Md_Jobaer_IT_Support_Engineer_CV.html"`);
      return res.send(html);
    } catch (err) {
      console.error('Error generating CV download:', err);
      res.status(500).send('Unable to generate CV file');
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, project_type, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      const raw = db.getRaw();
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
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

      res.status(201).json({
        success: true,
        message: 'Your message has been received! Md. Jobaer will get back to you shortly.',
      });
    } catch (err) {
      console.error('Error saving contact message:', err);
      res.status(500).json({ error: 'Server error processing contact message' });
    }
  });

  // Dynamic Sitemap
  app.get('/sitemap.xml', (req, res) => {
    const raw = db.getRaw();
    const domain = process.env.APP_URL || `http://localhost:${PORT}`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/#about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/#services</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/#work</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/#process</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/#insights</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/#contact</loc>
    <priority>0.8</priority>
  </url>
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Dynamic Robots.txt
  app.get('/robots.txt', (req, res) => {
    const domain = process.env.APP_URL || `http://localhost:${PORT}`;
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${domain}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const raw = db.getRaw();
    const user = raw.users.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  app.get('/api/auth/me', authenticateAdmin, (req: AuthRequest, res) => {
    const raw = db.getRaw();
    const user = raw.users.find(u => u.id === req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });

  app.put('/api/auth/update-credentials', authenticateAdmin, async (req: AuthRequest, res) => {
    try {
      const { email, current_password, new_password, name } = req.body;
      const raw = db.getRaw();
      const userIndex = raw.users.findIndex(u => u.id === req.user?.id);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = raw.users[userIndex];
      if (new_password) {
        if (!current_password) {
          return res.status(400).json({ error: 'Current password is required to set a new password' });
        }
        if (!bcrypt.compareSync(current_password, user.password_hash)) {
          return res.status(400).json({ error: 'Current password does not match' });
        }
        if (new_password.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        user.password_hash = bcrypt.hashSync(new_password, 10);
      }

      if (email) user.email = email.trim();
      if (name) user.name = name.trim();
      user.updated_at = new Date().toISOString();

      raw.users[userIndex] = user;
      await db.save(raw);

      res.json({
        success: true,
        message: 'Account credentials updated successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      console.error('Credentials update error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to update credentials') });
    }
  });

  // ==========================================
  // ADMIN CRUD API ROUTES (PROTECTED)
  // ==========================================

  // Full raw database state for CMS
  app.get('/api/admin/all', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    // Exclude password hash
    const safeUsers = raw.users.map(({ password_hash, ...u }) => u);
    res.json({
      ...raw,
      users: safeUsers,
      stats: {
        total_projects: raw.projects.length,
        published_projects: raw.projects.filter(p => p.status === 'published').length,
        total_videos: raw.youtube_videos.length,
        total_messages: raw.contact_messages.length,
        unread_messages: raw.contact_messages.filter(m => !m.is_read).length,
        skills_count: raw.skills.length,
        experience_count: raw.experience.length,
        education_count: raw.education.length,
      },
    });
  });

  // Profile
  app.put('/api/admin/profile', authenticateAdmin, async (req, res) => {
    try {
      const profile = await updateProfileRecord(req.body || {});
      res.json({ success: true, profile });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to save profile to Firebase') });
    }
  });

  // Site Settings
  app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
      const settings = await updateSettingsRecord(req.body || {});
      res.json({ success: true, settings });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to save settings to Firebase') });
    }
  });

  // Social Links
  app.put('/api/admin/social_links', authenticateAdmin, async (req, res) => {
    try {
      const social_links = await updateSocialLinks(req.body);
      res.json({ success: true, social_links });
    } catch (error) {
      console.error('Social links update error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to save social links to Firebase') });
    }
  });

  (Object.keys(ENTITY_ROUTES) as EntityPath[]).forEach((routePath) => {
    const { key } = ENTITY_ROUTES[routePath];
    // GET all items of key
    app.get(`/api/admin/${routePath}`, authenticateAdmin, (req, res) => {
      const raw = db.getRaw() as any;
      res.json(raw[key] || []);
    });

    // POST create item
    app.post(`/api/admin/${routePath}`, authenticateAdmin, async (req, res) => {
      try {
        const item = await createEntityRecord(routePath as EntityPath, req.body || {});
        res.status(201).json({ success: true, item });
      } catch (error) {
        console.error(`Create ${routePath} error:`, error);
        res.status(500).json({ error: publicError(error, `Failed to create ${routePath}`) });
      }
    });

    // PUT update item
    app.put(`/api/admin/${routePath}/:id`, authenticateAdmin, async (req, res) => {
      try {
        const item = await updateEntityRecord(routePath as EntityPath, String(req.params.id), req.body || {});
        res.json({ success: true, item });
      } catch (error: any) {
        console.error(`Update ${routePath} error:`, error);
        res.status(error?.status === 404 ? 404 : 500).json({
          error: publicError(error, `Failed to update ${routePath}`),
        });
      }
    });

    // DELETE item
    app.delete(`/api/admin/${routePath}/:id`, authenticateAdmin, async (req, res) => {
      try {
        await deleteEntityRecord(routePath as EntityPath, String(req.params.id));
        res.json({ success: true, message: 'Item deleted' });
      } catch (error) {
        console.error(`Delete ${routePath} error:`, error);
        res.status(500).json({ error: publicError(error, `Failed to delete ${routePath}`) });
      }
    });

    // REORDER items
    app.post(`/api/admin/${routePath}/reorder`, authenticateAdmin, async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
          return res.status(400).json({ error: 'ids array required' });
        }
        const reordered = await reorderEntityRecords(routePath as EntityPath, ids);
        res.json({ success: true, items: reordered });
      } catch (error) {
        console.error(`Reorder ${routePath} error:`, error);
        res.status(500).json({ error: publicError(error, `Failed to reorder ${routePath}`) });
      }
    });
  });

  // Messages Management
  app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    res.json(raw.contact_messages || []);
  });

  app.put('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
    try {
      const raw = db.getRaw();
      const { id } = req.params;
      const msg = raw.contact_messages.find(m => m.id === id);
      if (!msg) {
        return res.status(404).json({ error: 'Message not found' });
      }
      Object.assign(msg, req.body);
      await db.save(raw);
      res.json({ success: true, message: msg });
    } catch (error) {
      console.error('Message update error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to update message') });
    }
  });

  app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
    try {
      const raw = db.getRaw();
      const { id } = req.params;
      raw.contact_messages = raw.contact_messages.filter(m => m.id !== id);
      await db.save(raw);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      console.error('Message delete error:', error);
      res.status(500).json({ error: publicError(error, 'Failed to delete message') });
    }
  });

  // Media Upload (supports base64 image data payload)
  app.post('/api/admin/upload', authenticateAdmin, async (req, res) => {
    try {
      const result = await uploadImage(req.body?.dataUrl, req.body?.filename);
      res.json(result);
    } catch (err) {
      console.error('Error handling upload:', err);
      res.status(500).json({ error: publicError(err, 'Server error processing file upload') });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

export const appReady = createApp();

if (process.env.VERCEL !== '1') {
  appReady.then(app => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
  });
}
