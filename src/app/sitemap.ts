import { getBlogs } from "@/lib/markdown";

export default async function sitemap() {
  const baseUrl = "https://haseen.leapat.org";

  try {
    // Get all blog posts
    const blogs = await getBlogs();

    // Create blog URLs
    const blogUrls = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.filePath}`,
      lastModified: blog.data.date ? new Date(blog.data.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ];

    return [...staticPages, ...blogUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Fallback to static pages only
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ];
  }
}
