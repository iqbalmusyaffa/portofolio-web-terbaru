import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

import {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialEducations,
  initialProjects,
  initialCertificates
} from '@/lib/initialData';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';

export const revalidate = 0; // Dynamic data for real-time CRUD reflection

async function getPortfolioData() {
  try {
    await ensureDatabaseAndTables();

    const [profiles, skills, experiences, educations, projects, certificates] = await Promise.all([
      query('SELECT * FROM profile LIMIT 1').catch(() => []),
      query('SELECT * FROM skills ORDER BY category ASC, id ASC').catch(() => []),
      query('SELECT * FROM experiences ORDER BY id DESC').catch(() => []),
      query('SELECT * FROM educations ORDER BY id ASC').catch(() => []),
      query('SELECT * FROM projects ORDER BY featured DESC, id DESC').catch(() => []),
      query('SELECT * FROM certificates ORDER BY id ASC').catch(() => [])
    ]);

    return {
      profile: (profiles && profiles.length > 0) ? profiles[0] : initialProfile,
      skills: (skills && skills.length > 0) ? skills : initialSkills,
      experiences: (experiences && experiences.length > 0) ? experiences : initialExperiences,
      educations: (educations && educations.length > 0) ? educations : initialEducations,
      projects: (projects && projects.length > 0) ? projects : initialProjects,
      certificates: (certificates && certificates.length > 0) ? certificates : initialCertificates
    };
  } catch (err) {
    console.error('Error loading data for page:', err);
    const fallback = getFallbackData();
    return {
      profile: fallback.profile || initialProfile,
      skills: fallback.skills || initialSkills,
      experiences: fallback.experiences || initialExperiences,
      educations: fallback.educations || initialEducations,
      projects: fallback.projects || initialProjects,
      certificates: fallback.certificates || initialCertificates
    };
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <main className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030014] text-gray-900 dark:text-white overflow-hidden bg-grid-pattern transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="bg-glow-spot top-0 left-1/4 bg-purple-600/20" />
      <div className="bg-glow-spot top-1/3 right-10 bg-indigo-600/15" />
      <div className="bg-glow-spot top-2/3 left-10 bg-fuchsia-600/15" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero profile={data.profile} />

      {/* About Section */}
      <About
        profile={data.profile}
        projectCount={data.projects?.length}
        certCount={data.certificates?.length}
        expCount={data.experiences?.length}
      />

      {/* Skills Section */}
      <Skills skills={data.skills} />

      {/* Experience Section */}
      <Experience experiences={data.experiences} />

      {/* Education Section */}
      <Education educations={data.educations} />

      {/* Projects Section */}
      <Projects projects={data.projects} />

      {/* Certifications Section */}
      <Certifications certificates={data.certificates} />

      {/* Contact Section */}
      <Contact profile={data.profile} />

      {/* Footer */}
      <Footer profile={data.profile} />
    </main>
  );
}
