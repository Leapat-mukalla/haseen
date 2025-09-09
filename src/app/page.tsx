import BlogShowSection from "@/components/blog/BlogShowSection";
import Footer from "@/components/Footer";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import { cn } from "@/lib/utils";
import { getBlogs } from "@/lib/markdown";

export default async function Home() {
  const allBlogs = await getBlogs();

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <HeroSectionWithPwnedForm />
      {/* Arabic Features Section */}
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2
              className={cn(
                "mt-18 flex items-end justify-center gap-2 mb-4 text-3xl lg:text-5xl text-primary"
              )}
            >
              مميزات الأداة
              <span className="mb-2 inline-block h-[9px] lg:w-[370px] rounded bg-primary"></span>
            </h2>
            <h3 className="mb-12 text-center text-4xl lg:text-6xl font-bold text-[#262626]">
              خصائص مصممة لتعزيز أمانك
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-6 flex">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2247 62.8158C14.9743 68.3833 19.5858 72.745 25.1976 73.003C29.9196 73.2201 34.7164 73.3333 39.9987 73.3333C45.281 73.3333 50.0778 73.2201 54.7998 73.003C60.4116 72.745 65.0231 68.3833 65.7727 62.8158C66.2619 59.1823 66.6654 55.4587 66.6654 51.6667C66.6654 47.8746 66.2619 44.1511 65.7727 40.5175C65.0231 34.9501 60.4116 30.5883 54.7998 30.3303C50.0778 30.1132 45.281 30 39.9987 30C34.7164 30 29.9196 30.1132 25.1976 30.3303C19.5858 30.5883 14.9743 34.9501 14.2247 40.5175C13.7355 44.151 13.332 47.8746 13.332 51.6667C13.332 55.4587 13.7355 59.1823 14.2247 62.8158Z"
                      stroke="#1542D4"
                      strokeWidth="4"
                    />
                    <path
                      d="M25 29.9998V21.6665C25 13.3822 31.7157 6.6665 40 6.6665C48.2843 6.6665 55 13.3822 55 21.6665V29.9998"
                      stroke="#1542D4"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M39.9844 51.6665H40.0143"
                      stroke="#1542D4"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-2xl lg:text-4xl font-bold text-foreground">
                آمن وخاص
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                بياناتك لا تُحفظ أو تُسجل أبداً. جميع عمليات البحث مشفرة ومجهولة
                الهوية.
              </p>
            </div>

            <div>
              <div className="mb-6 flex">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.3363 21.6318L44.2882 16.6799C49.864 11.1042 57.1637 8.7914 64.8891 8.41347C67.8939 8.26648 69.3963 8.19298 70.6011 9.39775C71.8059 10.6025 71.7324 12.1049 71.5854 15.1098C71.2075 22.8352 68.8947 30.1349 63.319 35.7106L58.3671 40.6625C54.289 44.7406 53.1296 45.9 53.9857 50.3236C54.8305 53.7025 55.6484 56.9746 53.1914 59.4316C50.211 62.412 47.4924 62.4119 44.5121 59.4316L20.5673 35.4867C17.587 32.5064 17.5869 29.7878 20.5673 26.8075C23.0243 24.3505 26.2963 25.1683 29.6753 26.0131C34.0988 26.8693 35.2583 25.7098 39.3363 21.6318Z"
                      stroke="#1542D4"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M56.6517 23.3335H56.6816"
                      stroke="#1542D4"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.33203 71.6667L24.9987 55"
                      stroke="#1542D4"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28.332 71.6667L34.9987 65"
                      stroke="#171717"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.33203 51.6667L14.9987 45"
                      stroke="#171717"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-2xl lg:text-4xl font-bold text-foreground">
                نتائج فورية
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                احصل على نتائج التسريب في ثوانٍ من قاعدة بيانات شاملة للتسريبات
                المعروفة.
              </p>
            </div>

            <div>
              <div className="mb-6 flex">
                <div className="rounded-2xl bg-blue-50 p-6">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M71.8145 36.8165C72.8279 38.2375 73.3346 38.9481 73.3346 39.9998C73.3346 41.0516 72.8279 41.7622 71.8145 43.1832C67.261 49.5684 55.632 63.3332 40.0013 63.3332C24.3706 63.3332 12.7416 49.5684 8.18811 43.1832C7.17468 41.7622 6.66797 41.0516 6.66797 39.9998C6.66797 38.9481 7.17468 38.2375 8.1881 36.8165C12.7416 30.4313 24.3706 16.6665 40.0013 16.6665C55.632 16.6665 67.261 30.4313 71.8145 36.8165Z"
                      stroke="#1542D4"
                      strokeWidth="4"
                    />
                    <path
                      d="M50 40C50 34.4772 45.5228 30 40 30C34.4772 30 30 34.4772 30 40C30 45.5228 34.4772 50 40 50C45.5228 50 50 45.5228 50 40Z"
                      stroke="#1542D4"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-4 text-2xl lg:text-4xl font-bold text-foreground">
                تغطية شاملة
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                نراقب آلاف تسريبات البيانات عبر المنصات والخدمات الرئيسية.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BlogShowSection blogs={allBlogs} />
      <Footer />
    </main>
  );
}
