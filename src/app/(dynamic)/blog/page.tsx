import BlogShowSection from "@/components/blog/BlogShowSection";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import React from "react";
import { cn } from "@/lib/utils";
import { getBlogs } from "@/lib/markdown";

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allBlogs = await getBlogs();
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search?.toLowerCase().trim();

  const filteredBlogs = searchQuery
    ? allBlogs.filter(
        (blog) =>
          blog.data.title.toLowerCase().includes(searchQuery) ||
          blog.data.excerpt.toLowerCase().includes(searchQuery) ||
          blog.data.author.toLowerCase().includes(searchQuery) ||
          blog.data.category.toLowerCase().includes(searchQuery) ||
          blog.data.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery),
          ) ||
          blog.content.toLowerCase().includes(searchQuery),
      )
    : allBlogs;

  return (
    <>
      <HeroSectionWithPwnedForm />
      {/* <BlogSearchForm /> */}

      <h2
        className={cn(
          "mt-18 flex items-end justify-center gap-2 text-4xl text-primary",
        )}
      >
        ثقف نفسك أكثر{" "}
        <span className="mb-2 inline-block h-[9px] w-[200px] bg-primary"></span>
      </h2>
      <h3 className="mb-12 text-center text-6xl text-[#262626]">
        تعرف أكثر عن الأمان الرقمي{" "}
      </h3>

      <BlogShowSection
        blogs={filteredBlogs}
        searchQuery={searchQuery}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
