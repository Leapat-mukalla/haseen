import { cn } from "@/lib/utils";
import { Phone, Shield } from "lucide-react";

const emergencyContacts = [
  {
    name: "قسم الابتزاز الالكتروني - أمن وشرطة مديرية المكلا",
    phone: "734996744",
  },
  {
    name: "قسم الابتزاز الالكتروني - البحث الجنائي - محافظة حضرموت",
    phone: "05-308668",
  },
  {
    name: "شعبة الابتزاز الالكتروني - نيابة اسئناف م/حضرموت - المكلا",
    phone: "736236696",
  },
  {
    name: "اتحاد نساء اليمن - المكلا",
    phone: "772724363 / 05-303170",
  },
];

export default function EmergencyContactsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "flex items-end justify-center gap-2 mb-4 text-3xl lg:text-5xl text-primary"
            )}
          >
            أرقام الطوارئ
            <span className="mb-2 inline-block h-[9px] w-[200px] lg:w-[370px] rounded bg-primary"></span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            في حالة التعرض للابتزاز الإلكتروني أو أي جريمة رقمية، يمكنك التواصل
            مع الجهات المختصة التالية للحصول على المساعدة والدعم
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      {index < 3 ? (
                        <Shield className="w-6 h-6 text-red-600" />
                      ) : (
                        <Phone className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-gray-800 mb-3 leading-relaxed">
                      {contact.name}
                    </h3>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-lg font-semibold  direction-ltr">
                        {contact.phone}
                      </span>
                      <Phone className="w-4 h-4 " />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
