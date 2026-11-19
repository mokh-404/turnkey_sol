import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import chalet from "@/assets/visit-why-visit-and-visitor-registration-banner.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSiteAlert, useScrollOnSuccess, validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_TEXT, SHOW_SECTORS, SHOW_SECTORS_AR } from "@/config/event";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/visit/visitor-registration")({
  component: VisitorRegistrationPage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "سجّل زيارتك | للزوار | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Visitor Registration | Visit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "سجّل حضورك الآن في معرض العلمين تيرن كي شو ٢٠٢٧ للحصول على بطاقة الدخول المجانية والوصول إلى دليل العارضين الرقمي."
            : "Register to visit Turnkey Show 2027. Free entry badge, access to the digital exhibitor directory, and event updates.",
        },
        {
          property: "og:title",
          content: isAr ? "سجّل زيارتك | للزوار" : "Visitor Registration | Visit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

type FormStatus = "idle" | "sending" | "success" | "error";

const VISITOR_CATEGORIES: Array<{ value: string; ar: string }> = [
  { value: "Property Owner", ar: "مالك عقار" },
  { value: "Investor", ar: "مستثمر" },
  { value: "Developer", ar: "مطور عقاري" },
  { value: "Hospitality Operator", ar: "مشغّل منشآت فندقية وضيافة" },
  { value: "Architect & Interior Designer", ar: "مهندس معماري / مصمم ديكور داخلي" },
  { value: "Contractor & Procurement Team", ar: "مقاول / فريق مشتريات" },
  { value: "Corporate & Commercial Buyer", ar: "ممثل شركة / مشترٍ تجاري" },
  { value: "Other", ar: "فئة أخرى" },
];

const SECTORS_LIST = SHOW_SECTORS;

function VisitorRegistrationPage() {
  const { locale, isAr } = useLocale();
  const eventText = EVENT_TEXT[locale];
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const successRef = useScrollOnSuccess(status === "success");

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    if (!validateContactFields(form)) {
      setStatus("idle");
      return;
    }

    const errors: Record<string, string> = {};
    const nameEl = form.elements.namedItem("name") as HTMLInputElement;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement;
    const mobileEl = form.elements.namedItem("mobile") as HTMLInputElement;
    const categoryEl = form.elements.namedItem("category") as HTMLSelectElement;

    if (!nameEl.value.trim()) {
      errors["name"] = isAr ? "يرجى إدخال الاسم الكامل." : "Full Name is required.";
    }
    if (!emailEl.value.trim()) {
      errors["email"] = isAr ? "يرجى إدخال البريد الإلكتروني." : "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      errors["email"] = isAr
        ? "يرجى إدخال بريد إلكتروني صحيح."
        : "Please enter a valid email address.";
    }
    if (!mobileEl.value.trim()) {
      errors["mobile"] = isAr ? "يرجى إدخال رقم الموبايل." : "Mobile number is required.";
    }
    if (!categoryEl.value) {
      errors["category"] = isAr ? "يرجى اختيار فئة الزائر." : "Please select a visitor category.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      const firstErr =
        Object.values(errors)[0] ||
        (isAr
          ? "يرجى مراجعة الحقول الموضحة أعلاه."
          : "Please correct the highlighted fields above.");
      setErrorMsg(firstErr);
      showSiteAlert(firstErr);
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    const data = {
      form_key: "visitor_registration",
      locale: isAr ? "ar" : "en",
      fullName: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      mobile: (form.elements.namedItem("mobile") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      jobTitle: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      visitorCategory: categoryEl.value,
      sectors: selectedSectors,
    };

    try {
      const res = await fetch("/api/send-mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(
          json.message ??
            json.error ??
            (isAr
              ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً."
              : "Something went wrong. Please try again."),
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        isAr ? "تعذر الاتصال بالخادم. يرجى المحاولة مجدداً." : "Network error. Please try again.",
      );
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow={isAr ? "سجّل زيارتك" : "Visitor Registration"}
        title={
          isAr
            ? "التسجيل المسبق لزيارة\nمعرض العلمين تيرن كي شو ٢٠٢٧"
            : "REGISTER TO VISIT\nTURNKEY SHOW 2027"
        }
        description={
          isAr
            ? `سجّل حضورك الآن للحصول على بطاقة الدخول المجانية والوصول إلى دليل العارضين الرقمي ومستجدات المعرض. ${eventText.dates} · ${eventText.venue}`
            : `Sign up now to receive your free entry badge, access the digital exhibitor directory, and get event updates. ${eventText.dates} · ${eventText.venue}`
        }
        image={chalet}
        imageAlt={
          isAr
            ? "تجربة المعيشة الساحلية في معرض تيرن كي"
            : "Coastal living experience at Turnkey Show"
        }
      />

      <section
        className="contact-form-section contact-visitor-section page-width"
        id="registration-form"
        style={{ paddingTop: "clamp(1.25rem, 2.5vw, 2rem)" }}
      >
        <Reveal>
          <div className="booking-intro-banner">
            <h3 className="booking-intro-heading">
              {isAr ? "التسجيل الإلكتروني المسبق للزوار" : "Online Visitor Pre-Registration"}
            </h3>
            <p className="booking-intro-lead">
              {isAr ? (
                <>
                  للتسجيل المسبق لحضور <strong>معرض العلمين تيرن كي شو ٢٠٢٧</strong>، يرجى اتباع
                  الخطوات التالية:
                </>
              ) : (
                <>
                  To pre-register for <strong>TURNKEY SHOW ALAMEIN 2027</strong>, please:
                </>
              )}
            </p>
            <div className="booking-intro-cols">
              <div className="booking-intro-col">
                <div className="booking-intro-item">
                  <svg
                    className="booking-intro-chevron"
                    width={11}
                    height={14}
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr
                      ? "استيفاء البيانات المطلوبة أدناه بدقة."
                      : "Complete the following details answering all questions."}
                  </p>
                </div>
                <div className="booking-intro-item">
                  <svg
                    className="booking-intro-chevron"
                    width={11}
                    height={14}
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr
                      ? "تأكيد إرسال التسجيل ليتم إرسال بطاقة الدخول الخاصة بك عبر البريد الإلكتروني قبل انطلاق المعرض."
                      : "Click on the submit button, your entry badge will be mailed to you prior to the show."}
                  </p>
                </div>
              </div>

              <div className="booking-intro-col">
                <div className="booking-intro-item">
                  <svg
                    className="booking-intro-chevron"
                    width={11}
                    height={14}
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr
                      ? "في حال الحضور ضمن وفد أو مجموعة، يُرجى تسجيل كل زائر بشكل مستقل."
                      : "Don’t forget to register for each person separately if you intend a group visit."}
                  </p>
                </div>
                <div className="booking-intro-item">
                  <svg
                    className="booking-intro-chevron"
                    width={11}
                    height={14}
                    viewBox="0 0 100 120"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr ? (
                      <>
                        يرجى تزويدنا ببيانات التواصل التالية: <strong>(* حقول إلزامية).</strong>
                      </>
                    ) : (
                      <>
                        Please provide the following contact information:{" "}
                        <strong>(*required field).</strong>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <div ref={successRef} className="form-success-message">
              <h3>{isAr ? "تم تأكيد استلام تسجيلك" : "Registration Received"}</h3>
              <p>
                {isAr
                  ? "شكراً لتسجيلك! سيتم إرسال بطاقة الدخول الخاصة بك وتفاصيل المعرض إلى بريدك الإلكتروني."
                  : "Thank you for registering! We’ll send your visitor pass and event details to your email address."}
              </p>
            </div>
          ) : (
            <form
              className="contact-form book-space-custom-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-name">{isAr ? "الاسم الكامل *" : "Full Name *"}</label>
                  <Input
                    id="visitor-name"
                    name="name"
                    placeholder={isAr ? "الاسم بالكامل" : "Your full name"}
                    required
                    className={fieldErrors["name"] ? "field-invalid" : ""}
                  />
                  {fieldErrors["name"] && <p className="field-error">{fieldErrors["name"]}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-email">
                    {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                  </label>
                  <Input
                    id="visitor-email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    className={fieldErrors["email"] ? "field-invalid" : ""}
                  />
                  {fieldErrors["email"] && <p className="field-error">{fieldErrors["email"]}</p>}
                </div>
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-mobile">{isAr ? "رقم الموبايل *" : "Mobile *"}</label>
                  <Input
                    id="visitor-mobile"
                    name="mobile"
                    type="tel"
                    placeholder="+20 xxx xxx xxxx"
                    required
                    className={fieldErrors["mobile"] ? "field-invalid" : ""}
                  />
                  {fieldErrors["mobile"] && <p className="field-error">{fieldErrors["mobile"]}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-category">
                    {isAr ? "فئة الزائر *" : "Visitor Category *"}
                  </label>
                  <select
                    id="visitor-category"
                    name="category"
                    required
                    style={{
                      height: "44px",
                      width: "100%",
                      borderRadius: "4px",
                      border: fieldErrors["category"]
                        ? "1px solid var(--tk-red)"
                        : "1px solid #e5e7eb",
                      padding: "0 12px",
                      background: "#ffffff",
                      fontSize: "0.95rem",
                      color: "#111111",
                      appearance: "auto" as const,
                      cursor: "pointer",
                    }}
                  >
                    <option value="">
                      {isAr ? "اختر فئة الزائر..." : "Select your visitor category..."}
                    </option>
                    {VISITOR_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {isAr ? cat.ar : cat.value}
                      </option>
                    ))}
                  </select>
                  {fieldErrors["category"] && (
                    <p className="field-error">{fieldErrors["category"]}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="visitor-company">
                    {isAr ? "الشركة / المؤسسة " : "Company / Organization "}
                    <span className="optional">{isAr ? "(اختياري)" : "(optional)"}</span>
                  </label>
                  <Input
                    id="visitor-company"
                    name="company"
                    placeholder={isAr ? "اسم الشركة أو المكتب" : "Company or studio"}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="visitor-title">
                    {isAr ? "المسمى الوظيفي " : "Job Title "}
                    <span className="optional">{isAr ? "(اختياري)" : "(optional)"}</span>
                  </label>
                  <Input
                    id="visitor-title"
                    name="jobTitle"
                    placeholder={
                      isAr
                        ? "مثال: مصمم داخلي، مدير مشروعات"
                        : "e.g. Interior Designer, Project Manager"
                    }
                  />
                </div>
              </div>

              {/* Sectors of interest */}
              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label style={{ fontWeight: 700, marginBottom: "0.5rem", display: "block" }}>
                  {isAr ? "القطاعات محل الاهتمام " : "Sectors of Interest "}
                  <span className="optional">{isAr ? "(اختياري)" : "(optional)"}</span>
                </label>
                <div
                  className="form-sectors-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                    gap: "0.5rem",
                    background: "#f9f9f9",
                    padding: "1rem",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  {SECTORS_LIST.map((sector, idx) => (
                    <label
                      key={sector}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSectors.includes(sector)}
                        onChange={() => toggleSector(sector)}
                        style={{ accentColor: "var(--tk-red)", width: "16px", height: "16px" }}
                      />
                      <span>{isAr ? SHOW_SECTORS_AR[idx] : sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              {status === "error" && (
                <p className="form-error-msg" role="alert">
                  {errorMsg}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="show-button"
                disabled={status === "sending"}
                style={{ marginTop: "1rem" }}
              >
                {status === "sending"
                  ? isAr
                    ? "جارٍ الإرسال…"
                    : "SENDING…"
                  : isAr
                    ? "تأكيد تسجيل الزيارة"
                    : "CONFIRM VISITOR REGISTRATION"}{" "}
                <span className="btn-arrow">{isAr ? "<" : ">"}</span>
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </SiteLayout>
  );
}
