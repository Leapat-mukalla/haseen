"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import HeroSvg from "@/components/HeroSvg";

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
        } else if (data.message) {
          // Breaches found - show as error (red) but with the specific breach message
          setError(data.message);
          // Set security recommendations if available
          if (data.securityRecommendations) {
            setSecurityRecommendations(data.securityRecommendations);
          }
        } else {
          // Fallback for other cases
          setError(data.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
        }
      } else {
        setError(data.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <section className="bg-custom-gradient overflow-hidden relative">
        <HeroSvg />
        <div className="container mx-auto flex flex-col items-center justify-center py-32 lg:pt-60 2xl:pt-80 relative z-10">
          <div className="max-w-md w-full mt-8 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold leading-none tracking-tight text-white text-right">
                هل تم اختراق بريدك الإلكتروني؟
              </div>
              <div className="text-sm text-white/70 text-right">
                أدخل بريدك الإلكتروني للتحقق من ظهوره في أي اختراق بيانات.
              </div>
            </div>
            <div className="p-6 pt-0 ">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent text-right"
                />
                <Button type="submit" disabled={loading} className="w-full">
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

          {/* Description Text */}
          <div className="max-w-3xl mx-auto mt-12 px-4">
            <p className="text-white/80 text-lg leading-relaxed text-center">
              <span className="font-bold">حصين</span> أداة متقدمة تساعدك على
              التحقق مما إذا كان بريدك الإلكتروني أو اسم المستخدم أو رقم هاتفك
              قد ظهر ضمن أي تسريب بيانات سابق، مع ضمان خصوصيتك الكاملة وحماية
              معلوماتك من التخزين أو المشاركة، لتبقى مطمئنًا أن بياناتك تحت
              سيطرتك دائمًا.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
