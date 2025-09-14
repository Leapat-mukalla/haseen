import BlogShowSection from "@/components/blog/BlogShowSection";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import React from "react";
import { cn } from "@/lib/utils";
import { getBlogs } from "@/lib/markdown";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import BlogSearchForm from "@/components/blog/BlogSearchForm";

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search?.toLowerCase().trim();

  const baseTitle = "مدونة الأمان الرقمي";
  const baseDescription =
    "تعلم المزيد عن الأمان الرقمي وحماية البيانات الشخصية من خلال مقالات ونصائح الخبراء في مجال الأمن السيبراني.";

  if (searchQuery) {
    return generateSEOMetadata({
      title: `البحث عن "${searchQuery}" - ${baseTitle}`,
      description: `نتائج البحث عن "${searchQuery}" في مدونة الأمان الرقمي. ${baseDescription}`,
      keywords: [
        "مدونة الأمان الرقمي",
        "نصائح الأمان",
        "حماية البيانات",
        "الأمن السيبراني",
        "تعليم الأمان",
        searchQuery,
        "cybersecurity blog",
        "digital security tips",
      ],
      url: `https://haseen.leapat.org/blog?search=${encodeURIComponent(
        searchQuery
      )}`,
      type: "website",
    });
  }

  return generateSEOMetadata({
    title: baseTitle,
    description: baseDescription,
    keywords: [
      "مدونة الأمان الرقمي",
      "نصائح الأمان",
      "حماية البيانات",
      "الأمن السيبراني",
      "تعليم الأمان",
      "مقالات الأمان",
      "cybersecurity blog",
      "digital security tips",
      "privacy protection",
    ],
    url: "https://haseen.leapat.org/blog",
    type: "website",
  });
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
            tag.toLowerCase().includes(searchQuery)
          ) ||
          blog.content.toLowerCase().includes(searchQuery)
      )
    : allBlogs;

  return (
    <>
      <HeroSection showLogo={false} view="list" title="المقالات">
        {/* <BlogSearchForm /> */}
      </HeroSection>

      <h2
        className={cn(
          "mt-18 flex items-end justify-center gap-2 text-4xl text-primary"
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
