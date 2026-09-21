import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db, Database } from './server/db.js';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'md-jobaer-portfolio-super-secret-key-2026';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

async function startServer() {
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
  app.post('/api/contact', (req, res) => {
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
      db.save(raw);

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

  app.put('/api/auth/update-credentials', authenticateAdmin, (req: AuthRequest, res) => {
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
    db.save(raw);

    res.json({
      success: true,
      message: 'Account credentials updated successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
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
  app.put('/api/admin/profile', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    raw.profile = {
      ...raw.profile,
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    db.save(raw);
    res.json({ success: true, profile: raw.profile });
  });

  // Site Settings
  app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    raw.site_settings = {
      ...raw.site_settings,
      ...req.body,
    };
    db.save(raw);
    res.json({ success: true, settings: raw.site_settings });
  });

  // Social Links
  app.put('/api/admin/social_links', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    raw.social_links = req.body;
    db.save(raw);
    res.json({ success: true, social_links: raw.social_links });
  });

  // Generic Entity CRUD Helper
  const entityRoutes = [
    { path: 'projects', key: 'projects', idPrefix: 'proj_' },
    { path: 'skills', key: 'skills', idPrefix: 'sk_' },
    { path: 'services', key: 'services', idPrefix: 'srv_' },
    { path: 'experience', key: 'experience', idPrefix: 'exp_' },
    { path: 'education', key: 'education', idPrefix: 'edu_' },
    { path: 'certifications', key: 'certifications', idPrefix: 'cert_' },
    { path: 'awards', key: 'awards', idPrefix: 'aw_' },
    { path: 'activities', key: 'activities', idPrefix: 'act_' },
    { path: 'process', key: 'process_steps', idPrefix: 'prc_' },
    { path: 'testimonials', key: 'testimonials', idPrefix: 'test_' },
    { path: 'videos', key: 'youtube_videos', idPrefix: 'yt_' },
    { path: 'hobbies', key: 'hobbies', idPrefix: 'hb_' },
  ] as const;

  entityRoutes.forEach(({ path: routePath, key, idPrefix }) => {
    // GET all items of key
    app.get(`/api/admin/${routePath}`, authenticateAdmin, (req, res) => {
      const raw = db.getRaw() as any;
      res.json(raw[key] || []);
    });

    // POST create item
    app.post(`/api/admin/${routePath}`, authenticateAdmin, (req, res) => {
      const raw = db.getRaw() as any;
      const list = raw[key] || [];
      const itemData = req.body;

      // Special YouTube video helper
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
        sort_order: itemData.sort_order ?? (list.length + 1),
        created_at: new Date().toISOString(),
      };

      list.push(newItem);
      raw[key] = list;
      db.save(raw);
      res.status(201).json({ success: true, item: newItem });
    });

    // PUT update item
    app.put(`/api/admin/${routePath}/:id`, authenticateAdmin, (req, res) => {
      const raw = db.getRaw() as any;
      const list = raw[key] || [];
      const { id } = req.params;
      const idx = list.findIndex((x: any) => String(x.id) === String(id));

      if (idx === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const itemData = req.body;
      if (key === 'youtube_videos' && itemData.youtube_url) {
        const extractedId = Database.extractYouTubeId(itemData.youtube_url);
        if (extractedId) {
          itemData.video_id = extractedId;
          if (!itemData.thumbnail_url || itemData.thumbnail_url.includes('youtube.com')) {
            itemData.thumbnail_url = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
          }
        }
      }

      list[idx] = { ...list[idx], ...itemData, id };
      raw[key] = list;
      db.save(raw);
      res.json({ success: true, item: list[idx] });
    });

    // DELETE item
    app.delete(`/api/admin/${routePath}/:id`, authenticateAdmin, (req, res) => {
      const raw = db.getRaw() as any;
      const list = raw[key] || [];
      const { id } = req.params;
      raw[key] = list.filter((x: any) => String(x.id) !== String(id));
      db.save(raw);
      res.json({ success: true, message: 'Item deleted' });
    });

    // REORDER items
    app.post(`/api/admin/${routePath}/reorder`, authenticateAdmin, (req, res) => {
      const { ids } = req.body; // array of IDs in new order
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'ids array required' });
      }
      const raw = db.getRaw() as any;
      const list = raw[key] || [];
      const map = new Map(list.map((x: any) => [String(x.id), x]));
      const reordered = ids
        .map((id, index) => {
          const item = map.get(String(id));
          if (item) {
            return { ...item, sort_order: index + 1 };
          }
          return null;
        })
        .filter(Boolean);

      // append any items missing from ids list
      list.forEach((item: any) => {
        if (!ids.includes(String(item.id))) {
          reordered.push({ ...item, sort_order: reordered.length + 1 });
        }
      });

      raw[key] = reordered;
      db.save(raw);
      res.json({ success: true, items: reordered });
    });
  });

  // Messages Management
  app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    res.json(raw.contact_messages || []);
  });

  app.put('/api/admin/messages/:id', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    const { id } = req.params;
    const msg = raw.contact_messages.find(m => m.id === id);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }
    Object.assign(msg, req.body);
    db.save(raw);
    res.json({ success: true, message: msg });
  });

  app.delete('/api/admin/messages/:id', authenticateAdmin, (req, res) => {
    const raw = db.getRaw();
    const { id } = req.params;
    raw.contact_messages = raw.contact_messages.filter(m => m.id !== id);
    db.save(raw);
    res.json({ success: true, message: 'Message deleted' });
  });

  // Media Upload (supports base64 image data payload)
  app.post('/api/admin/upload', authenticateAdmin, (req, res) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'dataUrl is required' });
      }

      // Check format: data:image/png;base64,...
      const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: 'Invalid base64 image format' });
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Max file size 15MB
      if (buffer.length > 15 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image size exceeds 15MB limit' });
      }

      const safeName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFilename = `${safeName}_${Date.now()}.${ext}`;
      const destPath = path.join(UPLOADS_DIR, uniqueFilename);

      fs.writeFileSync(destPath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      res.json({
        success: true,
        url: fileUrl,
        filename: uniqueFilename,
        size: buffer.length,
      });
    } catch (err) {
      console.error('Error handling upload:', err);
      res.status(500).json({ error: 'Server error processing file upload' });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
