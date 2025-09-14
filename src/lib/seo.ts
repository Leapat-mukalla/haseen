import { Metadata } from "next";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const defaultSEO: SEOData = {
  title: "حصين - أداة فحص تسريب البيانات",
  description:
    "حصين هي أداة متقدمة وآمنة للتحقق من تسريب البيانات الشخصية. تحقق مما إذا كان بريدك الإلكتروني أو معلوماتك الشخصية قد ظهرت في أي اختراق للبيانات مع ضمان الخصوصية الكاملة.",
  keywords: [
    "تسريب البيانات",
    "أمان البيانات",
    "فحص البريد الإلكتروني",
    "اختراق البيانات",
    "حماية الخصوصية",
    "الأمان الرقمي",
    "فحص التسريب",
    "حصين",
    "leapat",
    "cybersecurity",
    "data breach",
    "privacy",
    "email security",
  ],
  author: "Leapat Organization",
  image: "/leapat-white.png",
  url: "https://haseen.leapat.org",
  type: "website",
};

export function generateMetadata(seoData: Partial<SEOData> = {}): Metadata {
  const mergedData = { ...defaultSEO, ...seoData };
  const fullTitle = seoData.title
    ? `${seoData.title} | حصين`
    : mergedData.title;

  return {
    title: fullTitle,
    description: mergedData.description,
    keywords: mergedData.keywords,
    authors: [{ name: mergedData.author || defaultSEO.author }],
    creator: mergedData.author || defaultSEO.author,
    publisher: "Leapat Organization",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: mergedData.type || "website",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      title: fullTitle,
      description: mergedData.description,
      url: mergedData.url,
      siteName: "حصين - Haseen",
      images: [
        {
          url: mergedData.image || "/leapat-white.png",
          width: 1200,
          height: 630,
          alt: mergedData.title || "حصين - أداة فحص تسريب البيانات",
        },
      ],
      ...(mergedData.type === "article" && {
        publishedTime: mergedData.publishedTime,
        modifiedTime: mergedData.modifiedTime,
        section: mergedData.section,
        tags: mergedData.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: mergedData.description,
      creator: "@leapat_org",
      site: "@leapat_org",
      images: [mergedData.image || "/leapat-white.png"],
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStructuredData(seoData: Partial<SEOData> = {}) {
  const mergedData = { ...defaultSEO, ...seoData };

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "حصين",
    alternateName: "Haseen",
    description: mergedData.description,
    url: mergedData.url,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Leapat Organization",
      url: "https://leapat.org",
      logo: "https://leapat.org/leapat-white.png",
      sameAs: [
        "https://twitter.com/leapat_org",
        "https://linkedin.com/company/leapat",
      ],
    },
    featureList: [
      "فحص تسريب البيانات",
      "حماية الخصوصية",
      "نتائج فورية",
      "تشفير البيانات",
      "عدم تخزين المعلومات",
    ],
    screenshot: mergedData.image,
    softwareVersion: "1.0.0",
    dateCreated: "2024-01-01",
    inLanguage: ["ar", "en"],
  };
}

export function generateBlogStructuredData(
  title: string,
  description: string,
  author: string,
  publishedDate: string,
  url: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Leapat Organization",
      logo: {
        "@type": "ImageObject",
        url: "https://leapat.org/leapat-white.png",
      },
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: image || "/leapat-white.png",
    inLanguage: "ar",
  };
}
