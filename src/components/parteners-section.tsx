import { cn } from "@/lib/utils";
import Image from "next/image";

export default function PartenersSection() {
  return (
    <section className="container mx-auto">
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
      <div className="mt-6 grid grid-cols-5 gap-2 lg:gap-6 container mx-auto px-4">
        {[
          "/haseen_partners/amen.png",
          "/haseen_partners/takamol.png",
          "/haseen_partners/adalah_foundation.png",
          "/haseen_partners/saferworld.png",
          "/haseen_partners/en_fundedbytheeu_rgb_pos.png",
        ].map((logo: string, idx: number) => (
          <div className="relative aspect-video" key={idx}>
            <Image
              fill
              key={idx}
              src={logo}
              alt={`شريك ${idx + 1}`}
              className="object-contain"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 112px, 128px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
