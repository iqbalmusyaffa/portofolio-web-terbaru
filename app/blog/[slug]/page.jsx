import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostView from '@/components/BlogPostView';
import { query, ensureDatabaseAndTables, getFallbackData } from '@/lib/db';
import { initialProfile, initialBlogs } from '@/lib/initialData';

export const revalidate = 0; // Dynamic data for real-time article updates

async function getBlogData(slug) {
  try {
    await ensureDatabaseAndTables();

    const [rows, allBlogs, profiles] = await Promise.all([
      query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug]).catch(() => []),
      query('SELECT * FROM blogs WHERE slug != ? ORDER BY is_featured DESC, id DESC LIMIT 4', [slug]).catch(() => []),
      query('SELECT * FROM profile LIMIT 1').catch(() => [])
    ]);

    let blog = null;
    if (rows && rows.length > 0) {
      blog = rows[0];
    } else {
      const fallbackList = getFallbackData().blogs || initialBlogs;
      blog = fallbackList.find((b) => b.slug === slug);
    }

    if (!blog) return null;

    const related = (allBlogs && allBlogs.length > 0)
      ? allBlogs.filter((b) => b.slug !== slug)
      : (getFallbackData().blogs || initialBlogs).filter((b) => b.slug !== slug);

    const profile = (profiles && profiles.length > 0)
      ? profiles[0]
      : (getFallbackData().profile || initialProfile);

    return { blog, related, profile };
  } catch (err) {
    console.error('Error fetching blog page:', err);
    const fallbackList = getFallbackData().blogs || initialBlogs;
    const blog = fallbackList.find((b) => b.slug === slug);
    if (!blog) return null;

    return {
      blog,
      related: fallbackList.filter((b) => b.slug !== slug),
      profile: getFallbackData().profile || initialProfile
    };
  }
}

export async function generateMetadata({ params }) {
  const data = await getBlogData(params.slug);
  if (!data || !data.blog) {
    return {
      title: 'Artikel Tidak Ditemukan - Iqbal Musyaffa',
      description: 'Artikel yang Anda cari tidak ditemukan.'
    };
  }

  const { blog } = data;
  const title = `${blog.title} - Iqbal Musyaffa`;
  const description = blog.summary || 'Artikel Software Engineering oleh Iqbal Musyaffa';
  const img = blog.image_url || '/foto2.jpg';

  return {
    title,
    description,
    keywords: blog.tags || 'Software Engineering, Next.js, MySQL, REST API',
    authors: [{ name: 'Iqbal Musyaffa' }],
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: img,
          width: 1200,
          height: 630,
          alt: blog.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img]
    }
  };
}

export default async function BlogPostPage({ params }) {
  const data = await getBlogData(params.slug);

  if (!data || !data.blog) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030014] text-gray-900 dark:text-white overflow-hidden bg-grid-pattern transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="bg-glow-spot top-0 left-1/4 bg-purple-600/20" />
      <div className="bg-glow-spot top-1/3 right-10 bg-indigo-600/15" />
      <div className="bg-glow-spot top-2/3 left-10 bg-fuchsia-600/15" />

      {/* Navigation */}
      <Navbar />

      {/* Article Content */}
      <BlogPostView blog={data.blog} relatedBlogs={data.related} />

      {/* Footer */}
      <Footer profile={data.profile} />
    </main>
  );
}
