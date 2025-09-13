"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import HeroSvg from "@/components/HeroSvg";
import Image from "next/image";
import { ResponsiveHeader } from "@/components/responsive-header";
import { XCircle } from "lucide-react";
import { trackEvent } from "@/lib/posthog";
import { EVENTS } from "@/lib/events";

export function HeroSectionWithPwnedForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityRecommendations, setSecurityRecommendations] = useState<
    string[] | null
  >(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSecurityRecommendations(null);

    trackEvent(EVENTS.CLICK_VERIFY, { email: email });

    try {
      const res = await fetch("/api/check-breach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.success) {
          // No breaches found - show as success (green)
          setResult(data.message);

          trackEvent(EVENTS.VERIFY_SUCCESS, { email: email });
        } else if (data.message) {
          // Breaches found - show as error (red) but with the specific breach message
          setError(data.message);
          // Set security recommendations if available
          if (data.securityRecommendations) {
            setSecurityRecommendations(data.securityRecommendations);
          }

          trackEvent(EVENTS.VERIFY_FAIL, { email: email });
        } else {
          // Fallback for other cases
          setError(data.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
          trackEvent(EVENTS.VERIFY_ERROR);
        }
      } else {
        setError(data.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
        trackEvent(EVENTS.VERIFY_ERROR, { email: email });
      }
    } catch (err) {
      setError("خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
      trackEvent(EVENTS.VERIFY_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ResponsiveHeader />
      <section className="bg-custom-gradient overflow-hidden relative">
        <HeroSvg />
        <div className="container px-6 mx-auto flex flex-col items-center justify-center pt-44 pb-32 lg:pt-44 lg:pb-24 2xl:pt-44 2xl:pb-24 relative z-10">
          {/* Description Text */}
          <div className="max-w-4xl mx-auto mt-12 px-4">
            <p className="text-white/80 text-xl leading-relaxed text-right">
              <span className="font-bold">حصين</span> أداة متقدمة تساعدك على
              التحقق مما إذا كان بريدك الإلكتروني أو اسم المستخدم أو رقم هاتفك
              قد ظهر ضمن أي تسريب بيانات سابق، مع ضمان خصوصيتك الكاملة وحماية
              معلوماتك من التخزين أو المشاركة، لتبقى مطمئنًا أن بياناتك تحت
              سيطرتك دائمًا.
            </p>
          </div>
          <div className="max-w-2xl w-full mt-8 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold leading-none tracking-tight text-white text-center ">
                هل تم اختراق بريدك الإلكتروني؟
              </div>
              <div className="text-lg w-2/3 mx-auto text-[#EAE9E8] text-center pt-4 pb-3">
                أدخل بريدك الإلكتروني للتحقق من ظهوره في أي اختراق بيانات.{" "}
              </div>
            </div>
            <div className="p-6 pt-0 ">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg px-4 py-3 w-full bg-white backdrop-blur-sm border border-white/30 text-gray-500 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-right"
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label="Clear input"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-xl py-5 "
                >
                  {loading ? "جاري التحقق..." : "تحقق الآن"}
                </Button>
              </form>
              {result && (
                <div className="mt-4 text-green-400 text-right">{result}</div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg backdrop-blur-sm">
                  <div className="text-red-400 text-right font-semibold mb-3">
                    {error}
                  </div>
                  {securityRecommendations && (
                    <div>
                      <h3 className="text-red-300 font-semibold text-right mb-3">
                        إرشادات الأمان:
                      </h3>
                      <ul className="space-y-2 text-red-200 text-right">
                        {securityRecommendations.map(
                          (recommendation, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-red-300">✓</span>
                              <span>{recommendation}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-4 pr-12 md:pr-16 lg:pr-64">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto  ">
            <div>
              <div className="mb-6 flex">
                <div className="rounded-3xl bg-blue-50 p-3">
                  <svg
                    width="50"
                    height="50"
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
              <h3 className="mb-4 text-2xl lg:text-2xl font-bold text-white">
                آمن وخاص
              </h3>
              <p className="text-white leading-relaxed w-3/4">
                بياناتك لا تُحفظ أو تُسجل أبداً. جميع عمليات البحث مشفرة ومجهولة
                الهوية.
              </p>
            </div>

            <div>
              <div className="mb-6 flex ">
                <div className="rounded-3xl bg-blue-50 p-3">
                  <svg
                    width="50"
                    height="50"
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
              <h3 className="mb-4 text-2xl lg:text-4xl font-bold text-white">
                نتائج فورية
              </h3>
              <p className="text-white leading-relaxed w-3/4">
                احصل على نتائج التسريب في ثوانٍ من قاعدة بياناتنا الشاملة
                للتسريبات المعروفة.
              </p>
            </div>

            <div>
              <div className="mb-6 flex">
                <div className="rounded-3xl bg-blue-50 p-3">
                  <svg
                    width="50"
                    height="50"
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
              <h3 className="mb-4 text-2xl lg:text-4xl font-bold text-white">
                تغطية شاملة
              </h3>
              <p className="text-white leading-relaxed w-3/4">
                نراقب آلاف تسريبات البيانات عبر المنصات والخدمات الرئيسية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
