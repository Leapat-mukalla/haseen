import BlogShowSection from "@/components/blog/BlogShowSection";
import Footer from "@/components/Footer";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import { cn } from "@/lib/utils";
import { getBlogs } from "@/lib/markdown";
import { generateMetadata } from "@/lib/seo";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = generateMetadata({
  title: "فحص تسريب البيانات الشخصية - أداة حصين المجانية",
  description:
    "تحقق مما إذا كان بريدك الإلكتروني أو معلوماتك الشخصية قد تم تسريبها في اختراقات البيانات. أداة حصين المجانية تضمن خصوصيتك الكاملة مع نتائج فورية وآمنة.",
  keywords: [
    "فحص تسريب البيانات",
    "أمان البريد الإلكتروني",
    "اختراق البيانات",
    "حماية الخصوصية",
    "فحص الهوية المسروقة",
    "أمان المعلومات الشخصية",
    "تسريب كلمات المرور",
    "حصين",
    "leapat",
    "data breach checker",
    "email security",
    "privacy protection",
    "cybersecurity",
  ],
  url: "https://haseen.leapat.org",
  type: "website",
});

export default async function Home() {
  const allBlogs = await getBlogs();

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <HeroSectionWithPwnedForm />

      <BlogShowSection blogs={allBlogs} />

      <section className="my-20 container mx-auto max-sm:mx-4">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "mt-18 flex items-end justify-center gap-2 mb-4 text-3xl lg:text-5xl text-primary"
            )}
          >
            الشركاء
            <span className="mb-2 inline-block h-[9px] lg:w-[370px] rounded bg-primary"></span>
          </h2>
          <p className="text-center">
            تأتي الحملة التوعوية بدعم من مشروع آمن ضمن مشروع تكامل، بتنفيذ مؤسسة
            عدالة للتنمية القانونية، وبالشراكة مع منظمة سيفرورلد، وبتمويل من
            الاتحاد الأوروبي.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-10">
          {[
            "/haseen_partners/amen.png",
            "/haseen_partners/takamol.png",
            "/haseen_partners/adalah_foundation.png",
            "/haseen_partners/saferworld.png",
            "/haseen_partners/en_fundedbytheeu_rgb_pos.png",
          ].map((logo: string, idx: number) => (
            <div className="relative h-18 w-44" key={idx}>
              <Image
                fill
                key={idx}
                src={logo}
                alt={`شريك ${idx + 1}`}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
