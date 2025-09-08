import BlogCard from "@/components/blog/BlogCard";
import { BlogMatter } from "@/lib/markdown";
import NoResults from "@/components/NoResults";
import { cn } from "@/lib/utils";

interface BlogShowSectionProps {
  blogs: BlogMatter[];
  searchQuery?: string;
  searchParams?: {
    search?: string;
  };
}

export default function BlogShowSection({
  blogs,
  searchQuery,
  searchParams,
}: BlogShowSectionProps) {
  return (
    <section className="bg-background py-16">
      <div className="text-center mb-12">
        <h2
          className={cn(
            "mt-18 flex items-end justify-center gap-2 mb-4 text-3xl lg:text-5xl text-primary"
          )}
        >
          ثقف نفسك أكثر
          <span className="mb-2 inline-block h-[9px] lg:w-[370px] rounded bg-primary"></span>
        </h2>
        <h3 className="mb-12 text-center text-4xl lg:text-6xl font-bold text-[#262626]">
          تعرف أكثر عن الأمان الرقمي
        </h3>
      </div>

      <div className="mx-auto max-w-[1100px]">
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              {blogs.length} نتيجة للبحث عن `&quot;
              {searchParams?.search}`&quot;
            </p>
          </div>
        )}

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard {...blog} key={blog.filePath} />
            ))}
          </div>
        ) : (
          <NoResults
            title={searchQuery ? "لا توجد نتائج" : "لا توجد مقالات متاحة"}
            message={
              searchQuery
                ? "لم يتم العثور على مقالات تطابق بحثك. حاول استخدام كلمات بحث أخرى"
                : "لا توجد مقالات متاحة حالياً. تحقق مرة أخرى لاحقاً"
            }
            buttonText="عودة لقائمة المقالات"
            buttonHref="/blog"
            searchQuery={searchQuery}
          />
        )}
      </div>
    </section>
  );
}
