import { NextResponse } from 'next/server';
import { ensureDatabaseAndTables, getDbStatus, query } from '@/lib/db';
import { requireAdminAuth } from '@/lib/security';
import {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialEducations,
  initialProjects,
  initialCertificates
} from '@/lib/initialData';

export async function GET() {
  try {
    await ensureDatabaseAndTables();
    const status = getDbStatus();

    let counts = {
      projects: 0,
      skills: 0,
      experiences: 0,
      educations: 0,
      certificates: 0,
      messages: 0
    };

    if (status.connected) {
      const [p] = await query('SELECT COUNT(*) as c FROM projects');
      const [s] = await query('SELECT COUNT(*) as c FROM skills');
      const [e] = await query('SELECT COUNT(*) as c FROM experiences');
      const [ed] = await query('SELECT COUNT(*) as c FROM educations');
      const [c] = await query('SELECT COUNT(*) as c FROM certificates');
      const [m] = await query('SELECT COUNT(*) as c FROM messages');

      counts = {
        projects: p?.c || 0,
        skills: s?.c || 0,
        experiences: e?.c || 0,
        educations: ed?.c || 0,
        certificates: c?.c || 0,
        messages: m?.c || 0
      };
    }

    return NextResponse.json({
      success: true,
      status,
      counts
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
      status: getDbStatus()
    });
  }
}

export async function POST(request) {
  // Protect seed/reset action with Admin Authentication
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return NextResponse.json(auth.response, { status: 401 });

  try {
    const { action } = await request.json();

    if (action === 'seed_reset') {
      await ensureDatabaseAndTables();

      // Clear existing records
      await query('DELETE FROM profile');
      await query('DELETE FROM skills');
      await query('DELETE FROM experiences');
      await query('DELETE FROM educations');
      await query('DELETE FROM projects');
      await query('DELETE FROM certificates');

      // Insert fresh seed data
      await query(
        `INSERT INTO profile (name, full_name, tagline, roles, bio, avatar_url, cv_url, github_url, linkedin_url, instagram_url, facebook_url, email, location)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          initialProfile.name, initialProfile.full_name, initialProfile.tagline,
          initialProfile.roles, initialProfile.bio, initialProfile.avatar_url,
          initialProfile.cv_url, initialProfile.github_url, initialProfile.linkedin_url,
          initialProfile.instagram_url, initialProfile.facebook_url, initialProfile.email,
          initialProfile.location
        ]
      );

      for (const s of initialSkills) {
        await query('INSERT INTO skills (category, name, icon, level) VALUES (?, ?, ?, ?)', [s.category, s.name, s.icon, s.level]);
      }

      for (const e of initialExperiences) {
        await query('INSERT INTO experiences (role, company, period, type, description, technologies, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [e.role, e.company, e.period, e.type, e.description, e.technologies, e.location]
        );
      }

      for (const ed of initialEducations) {
        await query('INSERT INTO educations (school, degree, period, grade, location, description) VALUES (?, ?, ?, ?, ?, ?)',
          [ed.school, ed.degree, ed.period, ed.grade, ed.location, ed.description]
        );
      }

      for (const p of initialProjects) {
        await query('INSERT INTO projects (title, description, live_url, github_url, image_url, tags, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.title, p.description, p.live_url, p.github_url, p.image_url, p.tags, p.featured]
        );
      }

      for (const c of initialCertificates) {
        await query('INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url) VALUES (?, ?, ?, ?, ?)',
          [c.title, c.issuer, c.issue_date, c.credential_url, c.image_url]
        );
      }

      return NextResponse.json({ success: true, message: 'Database reset & seeded with Iqbal Musyaffa portfolio data successfully!' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
