import { cn } from "@/lib/utils";
import Image from "next/image";

export default function PartenersSection() {
  return (
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
      <div className="mt-6 flex flex-nowrap justify-center items-center gap-1 sm:gap-2 md:gap-4 w-full">
        {[
          "/haseen_partners/amen.png",
          "/haseen_partners/takamol.png",
          "/haseen_partners/adalah_foundation.png",
          "/haseen_partners/saferworld.png",
          "/haseen_partners/en_fundedbytheeu_rgb_pos.png",
        ].map((logo: string, idx: number) => (
          <div
            className="relative h-10 w-16 sm:h-12 sm:w-20 md:h-16 md:w-28 lg:h-20 lg:w-32 flex-1 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[140px]"
            key={idx}
          >
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
