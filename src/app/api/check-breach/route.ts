import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          "hibp-api-key": "d08701c2d30645e4924b85f98a5b70e4",
          "User-Agent": "HaseeApp/1.0",
        },
      }
    );

    if (res.status === 404) {
      return NextResponse.json({
        success: true,
        message:
          "أخبار جيدة! لم يتم العثور على هذا الحساب في أي اختراقات بيانات معروفة.",
        breachCount: 0,
      });
    } else if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: false,
        message: `للأسف! تم العثور على هذا الحساب في ${data.length} اختراق${
          data.length > 1 ? "ات" : ""
        }.`,
        breachCount: data.length,
        breaches: data,
        securityRecommendations: [
          "تغيير كلمة المرور فوراً",
          "تجنب استخدام نفس كلمة المرور في أكثر من مكان",
          "تفعيل التحقق بخطوتين",
        ],
      });
    } else {
      // Handle different error cases with specific messages
      let errorMessage = "حدث خطأ. يرجى المحاولة مرة أخرى.";

      if (res.status === 401) {
        errorMessage = "خطأ في المصادقة. يرجى المحاولة مرة أخرى لاحقاً.";
      } else if (res.status === 429) {
        errorMessage =
          "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة مرة أخرى بعد قليل.";
      } else if (res.status === 403) {
        errorMessage = "غير مسموح بالوصول إلى الخدمة حالياً.";
      } else if (res.status >= 500) {
        errorMessage =
          "الخدمة غير متوفرة حالياً. يرجى المحاولة مرة أخرى لاحقاً.";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          message: errorMessage, // Fallback message
          success: false,
        },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("Error checking breach:", error);
    const errorMessage =
      "خطأ في الشبكة. يرجى التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى.";
    return NextResponse.json(
      {
        error: errorMessage,
        message: errorMessage, // Fallback message
        success: false,
      },
      { status: 500 }
    );
  }
}
