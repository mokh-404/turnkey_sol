import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import venueImage from "@/assets/venue.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showSiteAlert, useScrollOnSuccess, validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { EVENT_CONFIG, SHOW_SECTORS, SHOW_SECTORS_AR } from "@/config/event";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/exhibit/book-your-space")({
  component: BookYourSpacePage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "احجز مساحتك | للعارضين | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Book Your Space | Exhibit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "احجز مساحة العرض الخاصة بشركتك في معرض العلمين تيرن كي شو ٢٠٢٧، واحصل على مخطط القاعات وخيارات الأجنحة."
            : "Book your exhibition space at Turnkey Show 2027. Contact our sales team for floor plans, stand options, and custom packages.",
        },
        {
          property: "og:title",
          content: isAr ? "احجز مساحتك | للعارضين" : "Book Your Space | Exhibit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

type FormStatus = "idle" | "sending" | "success" | "error";

const COUNTRIES: Array<{ value: string; ar: string }> = [
  { value: "Egypt", ar: "مصر" },
  { value: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  { value: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  { value: "Kuwait", ar: "الكويت" },
  { value: "Qatar", ar: "قطر" },
  { value: "Bahrain", ar: "البحرين" },
  { value: "Oman", ar: "سلطنة عُمان" },
  { value: "Jordan", ar: "الأردن" },
  { value: "Lebanon", ar: "لبنان" },
  { value: "Turkey", ar: "تركيا" },
  { value: "Italy", ar: "إيطاليا" },
  { value: "Germany", ar: "ألمانيا" },
  { value: "Spain", ar: "إسبانيا" },
  { value: "United Kingdom", ar: "المملكة المتحدة" },
  { value: "United States", ar: "الولايات المتحدة" },
  { value: "China", ar: "الصين" },
  { value: "Other", ar: "دولة أخرى" },
];

const SECTORS_LIST = SHOW_SECTORS;

function BookYourSpacePage() {
  const { isAr } = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [country, setCountry] = useState("Egypt");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const successRef = useScrollOnSuccess(status === "success");

  function toggleSector(sector: string) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    );
    if (selectedSectors.length === 0) {
      setFieldErrors((prev) => ({ ...prev, sectors: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    if (!validateContactFields(form)) {
      setStatus("idle");
      return;
    }

    const required: Array<{ name: string; label: string; arLabel: string }> = [
      { name: "companyName", label: "Company Name", arLabel: "اسم الشركة" },
      { name: "companyWebsite", label: "Company Website", arLabel: "الموقع الإلكتروني للشركة" },
      { name: "city", label: "City", arLabel: "المدينة" },
      { name: "phone", label: "Phone Number", arLabel: "رقم الهاتف" },
      { name: "email", label: "Email", arLabel: "البريد الإلكتروني" },
      { name: "contactName", label: "Contact Person Name", arLabel: "اسم مسؤول التواصل" },
      { name: "jobTitle", label: "Job Title", arLabel: "المسمى الوظيفي" },
    ];

    const errors: Record<string, string> = {};
    for (const field of required) {
      const el = form.elements.namedItem(field.name) as HTMLInputElement | null;
      if (!el || !el.value.trim()) {
        errors[field.name] = isAr
          ? `يرجى إدخال ${field.arLabel}.`
          : `${field.label} is required.`;
      }
    }
    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null;
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      errors["email"] = isAr
        ? "يرجى إدخال بريد إلكتروني صحيح."
        : "Please enter a valid email address.";
    }
    if (selectedSectors.length === 0) {
      errors["sectors"] = isAr
        ? "يرجى اختيار قطاع واحد على الأقل."
        : "Please select at least one sector.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      const firstErr =
        Object.values(errors)[0] ||
        (isAr ? "يرجى مراجعة الحقول الموضحة أعلاه." : "Please correct the highlighted fields above.");
      setErrorMsg(firstErr);
      showSiteAlert(firstErr);
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    const data = {
      form_key: "exhibitor_booking",
      locale: isAr ? "ar" : "en",
      companyName: (form.elements.namedItem("companyName") as HTMLInputElement).value,
      companyWebsite: (form.elements.namedItem("companyWebsite") as HTMLInputElement).value,
      country: country,
      city: (form.elements.namedItem("city") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      contact: (form.elements.namedItem("contactName") as HTMLInputElement).value,
      title: (form.elements.namedItem("jobTitle") as HTMLInputElement).value,
      sectors: selectedSectors,
      standType: (form.elements.namedItem("standType") as HTMLSelectElement)?.value || "Space Only",
      standSize: (form.elements.namedItem("standSize") as HTMLInputElement)?.value || "",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "",
      website_hp: (form.elements.namedItem("website") as HTMLInputElement)?.value || "",
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
        eyebrow={isAr ? "احجز مساحتك" : "Book Your Space"}
        title={
          isAr
            ? "احجز مساحة العرض الخاصة بك\nفي معرض العلمين تيرن كي شو ٢٠٢٧"
            : "SECURE YOUR EXHIBITION SPACE\nAT TURNKEY SHOW 2027."
        }
        image={venueImage}
        imageAlt={
          isAr
            ? "مركز العلمين الدولي للمؤتمرات والمعارض"
            : "Al Alamein International Conference & Exhibition Center"
        }
      />

      <section
        className="page-width booking-page-wrap"
        id="booking-form-wrap"
        style={{ paddingTop: "clamp(1.25rem, 2.5vw, 2rem)", paddingBottom: "clamp(2.5rem, 5vw, 4.5rem)" }}
      >
        <Reveal>
          <div className="booking-intro-banner">
            <h3 className="booking-intro-heading">
              {isAr ? "(هذا النموذج لا يُعد عقداً ملزماً)" : "(This form is not a contract)"}
            </h3>
            <div className="booking-intro-cols">
              <div className="booking-intro-col">
                <div className="booking-intro-item">
                  <svg className="booking-intro-chevron" width={11} height={14} viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr ? (
                      <>
                        يرجى استيفاء طلب الحجز أدناه لتلقي مخطط قاعات العرض وعرض السعر الخاص بجناحكم. يمثل هذا النموذج إبداء رغبة في المشاركة فقط، ويتطلب تأكيد الحجز النهائي طلب استمارة التعاقد الرسمية لمعرض <strong>العلمين تيرن كي شو ٢٠٢٧</strong>.
                      </>
                    ) : (
                      <>
                        Please complete the reservation form below to receive the floor plan and quotation for your stand.
                        The form is just a reservation interest notice to the organizer. You have to ask for{" "}
                        <strong>TURNKEY SHOW ALAMEIN 2027</strong> contract application to confirm your space reservation.
                      </>
                    )}
                  </p>
                </div>
                <div className="booking-intro-item">
                  <svg className="booking-intro-chevron" width={11} height={14} viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    <strong>{isAr ? "* (بيانات إلزامية)" : "* (required information)"}</strong>
                  </p>
                </div>
              </div>

              <div className="booking-intro-col">
                <div className="booking-intro-item">
                  <svg className="booking-intro-chevron" width={11} height={14} viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    {isAr
                      ? "فور استلام طلبكم، سنرسل إليكم مخطط القاعات متضمناً خيارين متاحين للموقع للاختيار بينهما، وتتم التخصيصات وفق أولوية التقديم."
                      : "Once we receive your email we will send you the floor plan with 2 location options for you to choose. Allocations will be made on a first-come, first-serve basis."}
                  </p>
                </div>
                <div className="booking-intro-item">
                  <svg className="booking-intro-chevron" width={11} height={14} viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
                    <polygon points="0,0 45,0 100,60 45,120 0,120 55,60" />
                  </svg>
                  <p>
                    <strong>{isAr ? "لأي استفسارات، تواصلوا معنا عبر البريد الإلكتروني:" : "For any questions please contact us on:"}</strong>
                    <br />
                    <a href={`mailto:${EVENT_CONFIG.email}`} className="booking-intro-email ltr-inline">
                      {EVENT_CONFIG.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {status === "success" ? (
            <div ref={successRef} className="form-success-message">
              <h3>{isAr ? "تم استلام طلب الحجز" : "Exhibitor Application Received"}</h3>
              <p>
                {isAr
                  ? "شكراً لتقديمكم طلب المشاركة في معرض العلمين تيرن كي شو ٢٠٢٧. سيراجع فريق المبيعات طلبكم ويتواصل معكم في أقرب وقت بمخطط القاعات وخيارات الأجنحة وباقات الأسعار."
                  : "Thank you for applying to exhibit at Turnkey Show 2027. Our exhibition sales team will review your application and contact you promptly with stand options, hall floor plans, and pricing packages."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="book-space-custom-form" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              />

              {/* Section 1: Exhibitor Information */}
              <div className="form-section-block" style={{ marginBottom: "3rem" }}>
                <h3 style={{ color: "var(--tk-red)", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "none" }}>
                  {isAr ? "بيانات العارض" : "Exhibitor Information"}
                </h3>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="companyName" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "اسم الشركة *" : "Company Name *"}
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder={isAr ? "الاسم التجاري المسجل للشركة" : "Your registered company name"}
                      required
                      className={fieldErrors["companyName"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["companyName"] && <p className="field-error">{fieldErrors["companyName"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="companyWebsite" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "الموقع الإلكتروني للشركة *" : "Company Website *"}
                    </label>
                    <Input
                      id="companyWebsite"
                      name="companyWebsite"
                      placeholder="https://www.company.com"
                      required
                      className={fieldErrors["companyWebsite"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["companyWebsite"] && <p className="field-error">{fieldErrors["companyWebsite"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="country" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "الدولة *" : "Country *"}
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      style={{
                        height: "46px",
                        width: "100%",
                        borderRadius: "0",
                        border: "1px solid #d1d5db",
                        padding: "0 14px",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {isAr ? c.ar : c.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="city" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "المدينة *" : "City *"}
                    </label>
                    <Input
                      id="city"
                      name="city"
                      placeholder={isAr ? "مثال: القاهرة، الإسكندرية، دبي، الرياض" : "e.g. Cairo, Dubai, Riyadh"}
                      required
                      className={fieldErrors["city"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["city"] && <p className="field-error">{fieldErrors["city"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="phone" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "رقم الهاتف *" : "Phone Number *"}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+20 xxx xxx xxxx"
                      required
                      className={fieldErrors["phone"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["phone"] && <p className="field-error">{fieldErrors["phone"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="email" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "البريد الإلكتروني *" : "Email *"}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      className={fieldErrors["email"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["email"] && <p className="field-error">{fieldErrors["email"]}</p>}
                  </div>
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="contactName" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "اسم مسؤول التواصل *" : "Contact Person Name *"}
                    </label>
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder={isAr ? "الاسم الكامل لممثل الشركة" : "Full name of representative"}
                      required
                      className={fieldErrors["contactName"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["contactName"] && <p className="field-error">{fieldErrors["contactName"]}</p>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="jobTitle" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "المسمى الوظيفي *" : "Job Title *"}
                    </label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      placeholder={isAr ? "مثال: المدير العام، مدير المبيعات" : "e.g. Managing Director, Sales Head"}
                      required
                      className={fieldErrors["jobTitle"] ? "field-invalid" : ""}
                    />
                    {fieldErrors["jobTitle"] && <p className="field-error">{fieldErrors["jobTitle"]}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Exhibitor Profile */}
              <div className="form-section-block" style={{ marginBottom: "3rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <h3 style={{ color: "var(--tk-red)", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "none" }}>
                  {isAr ? "ملف المشاركة والقطاعات" : "Exhibitor Profile"}
                </h3>

                {/* Sectors of interest */}
                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label style={{ fontWeight: 700, fontSize: "1rem", display: "block", marginBottom: "0.75rem" }}>
                    {isAr ? "القطاعات الرئيسية (اختر جميع القطاعات ذات الصلة) *" : "Core Industry Sectors (Select all that apply) *"}
                  </label>
                  <div
                    className="form-sectors-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                      gap: "0.75rem",
                      background: "#fafafa",
                      padding: "1.25rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {SECTORS_LIST.map((sector, idx) => (
                      <label
                        key={sector}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          color: "#111111",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(sector)}
                          onChange={() => toggleSector(sector)}
                          style={{ accentColor: "var(--tk-red)", width: "18px", height: "18px" }}
                        />
                        <span>{isAr ? SHOW_SECTORS_AR[idx] : sector}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors["sectors"] && <p className="field-error" style={{ marginTop: "0.5rem" }}>{fieldErrors["sectors"]}</p>}
                </div>

                <div className="form-two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div className="form-field">
                    <label htmlFor="standType" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "نوع الجناح المفضل" : "Preferred Stand Type"}
                    </label>
                    <select
                      id="standType"
                      name="standType"
                      style={{
                        height: "46px",
                        width: "100%",
                        borderRadius: "0",
                        border: "1px solid #d1d5db",
                        padding: "0 14px",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                      }}
                    >
                      <option value="Space Only (Raw Space)">
                        {isAr ? "مساحة أرضية فقط (بدون تجهيز)" : "Space Only (Raw Space)"}
                      </option>
                      <option value="Shell Scheme (Equipped Stand)">
                        {isAr ? "جناح قياسي مجهز بالكامل" : "Shell Scheme (Equipped Stand)"}
                      </option>
                      <option value="Custom Pavilion / Undecided">
                        {isAr ? "جناح خاص / لم يُحدد بعد" : "Custom Pavilion / Undecided"}
                      </option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="standSize" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                      {isAr ? "المساحة التقديرية المطلوبة (م²)" : "Estimated Booth Space (SQM)"}
                    </label>
                    <Input
                      id="standSize"
                      name="standSize"
                      placeholder={isAr ? "مثال: ١٨ م²، ٣٦ م²، +٥٤ م²" : "e.g. 18 SQM, 36 SQM, 54+ SQM"}
                    />
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: "2rem" }}>
                  <label htmlFor="message" style={{ fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: "0.5rem" }}>
                    {isAr ? "متطلبات إضافية أو استفسارات حول المساحة" : "Additional Requirements or Space Inquiries"}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={
                      isAr
                        ? "أضف أي تفضيلات حول موقع الجناح أو متطلبات التصميم الخاص أو أي استفسارات أخرى..."
                        : "Provide any specific booth location preferences, custom design needs, or questions..."
                    }
                    rows={4}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="form-error-msg" role="alert" style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>
                  {errorMsg}
                </p>
              )}

              <Button type="submit" size="lg" className="show-button" disabled={status === "sending"}>
                {status === "sending"
                  ? isAr
                    ? "جارٍ الإرسال…"
                    : "SUBMITTING…"
                  : isAr
                    ? "أرسل الطلب"
                    : "Submit"}{" "}
                <span className="btn-arrow">{isAr ? "<" : ">"}</span>
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </SiteLayout>
  );
}
