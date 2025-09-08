import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-primary-foreground mb-2">
              حصين
            </h3>
            <p className="text-gray-400 text-sm">
              أداة فحص تسريب البيانات الشخصية - حماية خصوصيتك أولويتنا
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-400">
              © {currentYear} حسين. جميع الحقوق محفوظة.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              تم التطوير بواسطة فريق ليبات - المكلا
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
