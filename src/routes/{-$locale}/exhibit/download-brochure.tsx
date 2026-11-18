import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download } from "lucide-react";

import villaShowcase from "@/assets/villa-showcase.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollOnSuccess, validateContactFields } from "@/lib/formAlerts";
import { PageHero, Reveal, SiteLayout } from "@/components/SiteLayout";
import { resolveLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/exhibit/download-brochure")({
  component: DownloadBrochurePage,
  head: ({ params }) => {
    const isAr = resolveLocale((params as { locale?: string }).locale) === "ar";
    return {
      meta: [
        {
          title: isAr
            ? "حمّل البروشور | للعارضين | معرض العلمين تيرن كي شو ٢٠٢٧"
            : "Download Brochure | Exhibit | Turnkey Show Alamein 2027",
        },
        {
          name: "description",
          content: isAr
            ? "حمّل البروشور التعريفي للعارضين لمعرض العلمين تيرن كي شو ٢٠٢٧، واطّلع على القطاعات ومؤشرات السوق وفرص المشاركة."
            : "Download the Turnkey Show 2027 Exhibitor Sales Brochure. Get floor plans, pricing, sponsorship packages, and audience demographics.",
        },
        {
          property: "og:title",
          content: isAr ? "حمّل البروشور | للعارضين" : "Download Brochure | Exhibit",
        },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

type FormStatus = "idle" | "sending" | "success" | "error";

function DownloadBrochurePage() {
  const { isAr } = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const successRef = useScrollOnSuccess(status === "success");

  const brochureFilename = isAr
    ? "Brochure Turnkey Show Arabic 2027.pdf"
    : "Brochure Turnkey Show 2027.pdf";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.currentTarget;
    if (!validateContactFields(form, { checkRequired: true })) {
      setStatus("idle");
      return;
    }
    const nameVal = (form.elements.namedItem("name") as HTMLInputElement).value;
    const data = {
      form_key: "exhibitor_brochure",
      locale: isAr ? "ar" : "en",
      name: nameVal,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    };
    setSubmittedName(nameVal);
    try {
      const res = await fetch("/api/send-mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        const rawUrl: string =
          json.brochureUrl ||
          (isAr ? "/Brochure Turnkey Show Arabic 2027.pdf" : "/Brochure Turnkey Show 2027.pdf");
        const downloadUrl =
          isAr && rawUrl.startsWith("/api/brochure") && !rawUrl.includes("lang=")
            ? `${rawUrl}&lang=ar`
            : rawUrl;
        setBrochureUrl(downloadUrl);
        // Auto-trigger download without leaving the page
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = brochureFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        eyebrow={isAr ? "حمّل البروشور" : "Download Brochure"}
        title={isAr ? "تحميل البروشور التعريفي للعارضين" : "DOWNLOAD THE EXHIBITOR SALES BROCHURE"}
        description={
          isAr
            ? "لتحميل البروشور، يرجى استيفاء البيانات التالية:"
            : "To download Brochure, please provide the following information:"
        }
        image={villaShowcase}
        imageAlt={
          isAr
            ? "البروشور التعريفي لمعرض العلمين تيرن كي شو ٢٠٢٧"
            : "Turnkey Show 2027 sales brochure"
        }
      />

      <section
        className="brochure-download-section section-band full-width-section"
        id="brochure-form"
      >
        <div className="page-width brochure-download-inner brochure-download-inner--full">
          <Reveal className="brochure-form-card brochure-form-card--full">
            {status === "success" ? (
              <div ref={successRef} className="brochure-success">
                <CheckCircle2 className="success-icon" aria-hidden="true" />
                <h3>
                  {isAr
                    ? `شكرًا، ${submittedName || "شريكنا الكريم"}.`
                    : `Thank you, ${submittedName || "valued partner"}.`}
                </h3>
                <p>
                  {isAr
                    ? "بدأ تحميل البروشور التعريفي تلقائيًا. وفي حال لم يبدأ التحميل، يمكنك تنزيله مباشرة عبر الزر أدناه."
                    : "Your sales brochure download has started automatically. If it didn’t start, please click the button below."}
                </p>
                {brochureUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="show-button"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  >
                    <a href={brochureUrl} download={brochureFilename}>
                      <Download aria-hidden="true" className="w-4 h-4 me-2" />{" "}
                      {isAr ? "حمّل البروشور" : "Download brochure"}
                    </a>
                  </Button>
                )}
                <p
                  className="brochure-email-note"
                  style={{ color: "#555555", fontSize: "0.95rem" }}
                >
                  {isAr
                    ? "كما تم إرسال نسخة من رابط التحميل إلى بريدك الإلكتروني."
                    : "A copy of the download link was also sent to your email."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="brochure-form" noValidate>
                <div className="brochure-form-grid">
                  <div className="form-field">
                    <label htmlFor="b-name">{isAr ? "الاسم الكامل *" : "Your Name *"}</label>
                    <Input
                      id="b-name"
                      name="name"
                      placeholder={isAr ? "الاسم بالكامل" : "Full name"}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="b-phone">
                      {isAr ? "رقم الموبايل / الهاتف *" : "Mobile / Phone *"}
                    </label>
                    <Input
                      id="b-phone"
                      name="phone"
                      type="tel"
                      placeholder="+20 xxx xxx xxxx"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="b-email">
                      {isAr ? "البريد الإلكتروني للعمل *" : "Business Email *"}
                    </label>
                    <Input
                      id="b-email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="b-company">{isAr ? "اسم الشركة *" : "Company Name *"}</label>
                    <Input
                      id="b-company"
                      name="company"
                      placeholder={isAr ? "اسم الشركة" : "Company name"}
                      required
                    />
                  </div>
                  <div className="form-field brochure-form-field--wide">
                    <label htmlFor="b-title">{isAr ? "المسمى الوظيفي *" : "Job Title *"}</label>
                    <Input
                      id="b-title"
                      name="title"
                      placeholder={isAr ? "المسمى الوظيفي" : "Your job title"}
                      required
                    />
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
                  className="show-button w-full"
                  disabled={status === "sending"}
                >
                  <Download aria-hidden="true" className="w-4 h-4 me-2" />
                  {status === "sending"
                    ? isAr
                      ? "جارٍ الإرسال…"
                      : "SUBMITTING…"
                    : isAr
                      ? "أرسل وحمّل البروشور"
                      : "Submit & download"}{" "}
                  <span className="btn-arrow ms-2">{isAr ? "<" : ">"}</span>
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
