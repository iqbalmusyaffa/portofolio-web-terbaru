import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Blog from '@/components/Blog';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { initialProfile, initialBlogs } from '@/lib/initialData';

export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Blog & Artikel Teknis - Iqbal Musyaffa',
    description: 'Kumpulan artikel teknis, best practices arsitektur backend, optimasi database, dan strategi keamanan web oleh Iqbal Musyaffa.',
    keywords: 'Blog Software Engineer, Next.js, MySQL, REST API, Web Security, Iqbal Musyaffa',
  };
}

async function getBlogArchiveData() {
  try {
    await ensureDatabaseAndTables();

    const [blogs, profiles] = await Promise.all([
      query('SELECT * FROM blogs ORDER BY is_featured DESC, id DESC').catch(() => []),
      query('SELECT * FROM profile LIMIT 1').catch(() => [])
    ]);

    return {
      blogs: (blogs && blogs.length > 0) ? blogs : (getFallbackData().blogs || initialBlogs),
      profile: (profiles && profiles.length > 0) ? profiles[0] : (getFallbackData().profile || initialProfile)
    };
  } catch (err) {
    console.error('Error fetching blog archive data:', err);
    return {
      blogs: getFallbackData().blogs || initialBlogs,
      profile: getFallbackData().profile || initialProfile
    };
  }
}

export default async function BlogArchivePage() {
  const data = await getBlogArchiveData();

  return (
    <main className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030014] text-gray-900 dark:text-white overflow-hidden bg-grid-pattern transition-colors duration-300 pt-16">
      {/* Background ambient lighting */}
      <div className="bg-glow-spot top-0 left-1/4 bg-purple-600/20" />
      <div className="bg-glow-spot top-1/3 right-10 bg-indigo-600/15" />
      <div className="bg-glow-spot top-2/3 left-10 bg-fuchsia-600/15" />

      {/* Navigation */}
      <Navbar />

      {/* Blog Directory */}
      <Blog blogs={data.blogs} />

      {/* Footer */}
      <Footer profile={data.profile} />
    </main>
  );
}
