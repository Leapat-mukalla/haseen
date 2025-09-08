import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import { getBlog, getBlogs } from "@/lib/markdown";

import BlogCard from "@/components/blog/BlogCard";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RelatedBlogCard from "@/components/blog/RelatedBlogCard";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({
    id: blog.filePath,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  let blog;
  try {
    blog = await getBlog(params.id);
  } catch (error) {
    notFound();
  }

  const allBlogs = await getBlogs();
  const relatedBlogs = allBlogs
    .filter((b) => b.filePath !== params.id)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <HeroSectionWithPwnedForm />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="p-5 lg:col-span-3">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300"></div>
                  <div className="pr-2">
                    <h2 className="mb-1 text-2xl font-bold text-[#171717]">
                      {blog.data.author}
                    </h2>
                    <p className="text-sm text-[#646464]">
                      خبير الأمن السيبراني
                    </p>
                  </div>
                </div>

                <div className="text-2xl text-[#171717]">{blog.data.date}</div>
              </div>

              <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ol:text-gray-700 prose-ul:text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </article>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="mb-6 text-3xl font-bold text-gray-900">
                  مقالات أخرى قد تفيدك
                </h3>
                <div className="space-y-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <RelatedBlogCard
                      key={relatedBlog.filePath}
                      data={{
                        ...relatedBlog.data,
                        authorTitle: "خبير الأمن السيبراني",
                      }}
                      filePath={relatedBlog.filePath}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
