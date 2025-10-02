import BlogShowSection from "@/components/blog/BlogShowSection";
import { HeroSectionWithPwnedForm } from "@/components/HeroSectionWithPwnedForm";
import { getBlogs } from "@/lib/markdown";
import { generateMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PartenersSection from "@/components/parteners-section";
import EmergencyContactsSection from "@/components/emergency-contacts-section";

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

      <EmergencyContactsSection />

      <PartenersSection />
    </main>
  );
}
