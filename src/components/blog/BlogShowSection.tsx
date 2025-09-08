import BlogCard from "@/components/blog/BlogCard";
import { BlogMatter } from "@/lib/markdown";
import NoResults from "@/components/NoResults";

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
    <section className="bg-background py-20">
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
