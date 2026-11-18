<?php
/**
 * Turnkey Show Alamein 2027 — Production Form & SMTP Email Endpoint
 * Endpoint: POST /api/send-mail.php (also mapped from /api/forms via .htaccess)
 *
 * Compatible with cPanel shared hosting (PHP 8.x, no SSH / Composer required).
 * Sends authenticated SMTP over SSL/TLS (SMTPS port 465) via bundled PHPMailer.
 *
 * Auto-reply behavior:
 * - English form submissions (locale = "en") receive an English auto-reply styled after Registration (updated).docx.
 * - Arabic form submissions  (locale = "ar") receive an Arabic (RTL) auto-reply styled after Registration (updated).docx.
 * - Every auto-reply is tailored to the specific form submitted (exhibitor_booking, exhibitor_brochure,
 *   visitor_registration, general_inquiry).
 */

declare(strict_types=1);

define('TK_API', true);
require_once __DIR__ . '/lib/bootstrap.php';

use PHPMailer\PHPMailer\Exception as PHPMailerException;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    tk_json(405, [
        'success' => false,
        'message' => 'Method not allowed. Use POST.',
        'error'   => 'Method not allowed. Use POST.',
    ]);
}

$config = tk_config();

if (!tk_origin_allowed($config)) {
    tk_json(403, [
        'success' => false,
        'message' => 'Forbidden origin.',
        'error'   => 'Forbidden origin.',
    ]);
}

// Parse JSON body or standard form-urlencoded / multipart POST
$rawBody = file_get_contents('php://input');
$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
$payload = [];

if (str_contains($contentType, 'application/json') && is_string($rawBody) && trim($rawBody) !== '') {
    $decoded = json_decode($rawBody, true);
    if (!is_array($decoded)) {
        tk_json(400, [
            'success' => false,
            'message' => 'Invalid JSON payload.',
            'error'   => 'Invalid JSON payload.',
        ]);
    }
    $payload = $decoded;
} elseif (!empty($_POST)) {
    $payload = $_POST;
} elseif (is_string($rawBody) && trim($rawBody) !== '') {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $payload = $decoded;
    }
}

$clientIp = tk_client_ip();

// Detect submission locale ("ar" vs "en") from payload or Referer URL path (/ar/...)
$rawLocale = strtolower(tk_line($payload['locale'] ?? $payload['lang'] ?? '', 10));
if ($rawLocale !== 'ar' && $rawLocale !== 'en') {
    $refererPath = (string) (parse_url((string) ($_SERVER['HTTP_REFERER'] ?? ''), PHP_URL_PATH) ?? '');
    $rawLocale = (preg_match('#^/ar(/|$)#', $refererPath) === 1) ? 'ar' : 'en';
}
$isAr = ($rawLocale === 'ar');

// 1. Honeypot spam protection (website_hp or website)
$honeypot = tk_line($payload['website_hp'] ?? $payload['website'] ?? '', 200);
if ($honeypot !== '') {
    tk_json(200, [
        'success' => true,
        'message' => $isAr ? 'شكراً لتواصلكم معنا.' : 'Thank you for your submission.',
    ]);
}

// 2. Validate & sanitize email address (strips CR/LF to prevent header injection)
$email = tk_line($payload['email'] ?? '', 254);
if (!tk_valid_email($email)) {
    $msg = $isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please provide a valid email address.';
    tk_json(400, ['success' => false, 'message' => $msg, 'error' => $msg]);
}

// 3. Rate limiting (per IP and per email)
$rateLimit = (int) ($config['rate_limit_per_hour'] ?? 10);
if (
    tk_rate_limited('ip:' . $clientIp, max(15, $rateLimit * 2), 3600) ||
    tk_rate_limited('email:' . strtolower($email), $rateLimit, 3600)
) {
    $msg = $isAr
        ? 'تم إرسال عدد كبير من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.'
        : 'Too many submissions. Please wait a little while before trying again.';
    tk_json(429, ['success' => false, 'message' => $msg, 'error' => $msg]);
}

// 4. Extract & sanitize common fields
$formKey    = tk_line($payload['form_key'] ?? 'general_inquiry', 64);
$nameVal    = tk_line($payload['fullName'] ?? $payload['name'] ?? $payload['contact'] ?? $payload['full_name'] ?? '', 160);
$companyVal = tk_line($payload['companyName'] ?? $payload['company'] ?? '', 200);
$mobileVal  = tk_line($payload['mobile'] ?? $payload['phone'] ?? '', 40);
$titleVal   = tk_line($payload['title'] ?? $payload['jobTitle'] ?? $payload['job_title'] ?? '', 160);

$displayName    = $nameVal !== '' ? $nameVal : ($isAr ? 'عميلنا الكريم' : 'Subscriber');
$displayCompany = $companyVal;

// Generate reference number (TKS1000..TKS9999)
$hashHex = md5($email . ':' . microtime(true));
$regNum  = 'TKS' . ((hexdec(substr($hashHex, 0, 6)) % 9000) + 1000);

$formTitleEn         = '';
$formTitleAr         = '';
$formPagePath        = '';
$classificationLabel = '';
$subjectDetail       = '';
$submittedFields     = [];

switch ($formKey) {
    case 'exhibitor_booking':
        $formTitleEn         = 'FORM 1: BOOK YOUR SPACE (Exhibitor Application Form)';
        $formTitleAr         = 'نموذج حجز مساحة عرض (طلب مشاركة عارض)';
        $formPagePath        = $isAr ? '/ar/exhibit/book-your-space' : '/exhibit/book-your-space';
        $classificationLabel = 'EXHIBITOR · Book Your Space';
        $subjectDetail       = ($displayCompany !== '' ? $displayCompany : $displayName) . ' (' . $displayName . ')';

        if ($companyVal === '') {
            $m = $isAr ? 'يرجى إدخال اسم الشركة.' : 'Company name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($nameVal === '') {
            $m = $isAr ? 'يرجى إدخال اسم مسؤول التواصل.' : 'Contact person name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($mobileVal === '' || !tk_valid_phone($mobileVal)) {
            $m = $isAr ? 'يرجى إدخال رقم هاتف / موبايل صحيح.' : 'Please provide a valid phone/mobile number.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }

        $companyWebsite = tk_line($payload['companyWebsite'] ?? $payload['websiteUrl'] ?? '', 250);
        $country        = tk_line($payload['country'] ?? '', 100);
        $city           = tk_line($payload['city'] ?? '', 100);
        $sectors        = tk_list($payload['sectors'] ?? []);
        $standType      = tk_line($payload['standType'] ?? '', 100);
        $standSize      = tk_line($payload['standSize'] ?? '', 60);
        $message        = tk_text($payload['message'] ?? '', 4000);

        $sec1En = 'Section 1 — Exhibitor & Company Information';
        $sec1Ar = 'القسم الأول — بيانات الشركة والعارض';
        $sec2En = 'Section 2 — Exhibitor Profile & Stand Requirements';
        $sec2Ar = 'القسم الثاني — ملف المشاركة ومتطلبات الجناح';

        $submittedFields = [
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Application Reference Number', 'labelAr' => 'رقم مرجع الطلب', 'value' => $regNum],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Company Name', 'labelAr' => 'اسم الشركة', 'value' => $companyVal],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Company Website', 'labelAr' => 'الموقع الإلكتروني للشركة', 'value' => $companyWebsite !== '' ? $companyWebsite : '—'],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Country', 'labelAr' => 'الدولة', 'value' => $country !== '' ? $country : '—'],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'City', 'labelAr' => 'المدينة', 'value' => $city !== '' ? $city : '—'],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Phone / Mobile Number', 'labelAr' => 'رقم الهاتف / الموبايل', 'value' => $mobileVal],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Email Address', 'labelAr' => 'البريد الإلكتروني', 'value' => $email],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Contact Person Name', 'labelAr' => 'اسم مسؤول التواصل', 'value' => $nameVal],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Job Title', 'labelAr' => 'المسمى الوظيفي', 'value' => $titleVal !== '' ? $titleVal : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Core Industry Sectors', 'labelAr' => 'القطاعات الرئيسية', 'value' => !empty($sectors) ? implode(', ', $sectors) : ($isAr ? 'جميع القطاعات' : 'All sectors')],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Preferred Stand Type', 'labelAr' => 'نوع الجناح المفضل', 'value' => $standType !== '' ? $standType : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Estimated Booth Space (SQM)', 'labelAr' => 'المساحة التقديرية المطلوبة (م²)', 'value' => $standSize !== '' ? $standSize : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Additional Requirements / Space Inquiries', 'labelAr' => 'متطلبات إضافية / استفسارات المساحة', 'value' => $message !== '' ? $message : '—'],
        ];
        break;

    case 'exhibitor_brochure':
        $formTitleEn         = 'FORM 2: DOWNLOAD BROCHURE (Sales Brochure Request Form)';
        $formTitleAr         = 'نموذج تحميل البروشور التعريفي للمعرض';
        $formPagePath        = $isAr ? '/ar/exhibit/download-brochure' : '/exhibit/download-brochure';
        $classificationLabel = 'EXHIBITOR · Sales Brochure Download';
        $subjectDetail       = ($displayCompany !== '' ? $displayCompany : $displayName) . ' (' . $displayName . ')';

        if ($nameVal === '') {
            $m = $isAr ? 'يرجى إدخال الاسم.' : 'Name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($mobileVal === '' || !tk_valid_phone($mobileVal)) {
            $m = $isAr ? 'يرجى إدخال رقم موبايل صحيح.' : 'Please provide a valid mobile number.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($companyVal === '') {
            $m = $isAr ? 'يرجى إدخال اسم الشركة.' : 'Company name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }

        $secEn = 'Brochure Request Form Fields';
        $secAr = 'بيانات طلب تحميل البروشور التعريفي';
        $submittedFields = [
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Reference Number', 'labelAr' => 'رقم المرجع', 'value' => $regNum],
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Your Name', 'labelAr' => 'الاسم الكامل', 'value' => $nameVal],
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Mobile / Phone', 'labelAr' => 'رقم الموبايل / الهاتف', 'value' => $mobileVal],
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Business Email', 'labelAr' => 'البريد الإلكتروني للعمل', 'value' => $email],
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Company Name', 'labelAr' => 'اسم الشركة', 'value' => $companyVal],
            ['section' => $secEn, 'sectionAr' => $secAr, 'label' => 'Job Title', 'labelAr' => 'المسمى الوظيفي', 'value' => $titleVal !== '' ? $titleVal : '—'],
        ];
        break;

    case 'visitor_registration':
        $formTitleEn         = 'FORM 3: VISITOR REGISTRATION (Visitor Entry Badge Form)';
        $formTitleAr         = 'نموذج تسجيل الزوار (بطاقة الدخول للمعرض)';
        $formPagePath        = $isAr ? '/ar/visit/visitor-registration' : '/visit/visitor-registration';
        $classificationLabel = 'VISITOR · Registration';
        $subjectDetail       = $displayName . ' (' . $regNum . ')';

        if ($nameVal === '') {
            $m = $isAr ? 'يرجى إدخال الاسم الكامل.' : 'Full name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($mobileVal !== '' && !tk_valid_phone($mobileVal)) {
            $m = $isAr ? 'يرجى إدخال رقم موبايل صحيح.' : 'Please provide a valid mobile number.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }

        $category = tk_line($payload['visitorCategory'] ?? $payload['interest'] ?? 'General Visitor', 120);
        if ($category === '') {
            $category = 'General Visitor';
        }
        $sectors = tk_list($payload['sectors'] ?? []);

        $sec1En = 'Section 1 — Visitor Personal & Contact Information';
        $sec1Ar = 'القسم الأول — البيانات الشخصية وبيانات التواصل للزائر';
        $sec2En = 'Section 2 — Visitor Profile & Interests';
        $sec2Ar = 'القسم الثاني — فئة الزائر والقطاعات محل الاهتمام';

        $submittedFields = [
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Registration Number', 'labelAr' => 'رقم التسجيل', 'value' => $regNum],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Full Name', 'labelAr' => 'الاسم الكامل', 'value' => $nameVal],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Email Address', 'labelAr' => 'البريد الإلكتروني', 'value' => $email],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Mobile Number', 'labelAr' => 'رقم الموبايل', 'value' => $mobileVal !== '' ? $mobileVal : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Visitor Category', 'labelAr' => 'فئة الزائر', 'value' => $category],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Company / Organization', 'labelAr' => 'الشركة / المؤسسة', 'value' => $companyVal !== '' ? $companyVal : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Job Title', 'labelAr' => 'المسمى الوظيفي', 'value' => $titleVal !== '' ? $titleVal : '—'],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Sectors of Interest', 'labelAr' => 'القطاعات محل الاهتمام', 'value' => !empty($sectors) ? implode(', ', $sectors) : '—'],
        ];
        break;

    case 'general_inquiry':
        $formTitleEn         = 'FORM 4: CONTACT US (General Inquiry Form)';
        $formTitleAr         = 'نموذج تواصل معنا (استفسار عام)';
        $formPagePath        = $isAr ? '/ar/contact' : '/contact';
        $classificationLabel = 'GENERAL INQUIRY · Contact Us';

        $subject = tk_line($payload['subject'] ?? '', 200);
        $message = tk_text($payload['message'] ?? '', 5000);

        if ($nameVal === '') {
            $m = $isAr ? 'يرجى إدخال الاسم الكامل.' : 'Full name is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($mobileVal === '' || !tk_valid_phone($mobileVal)) {
            $m = $isAr ? 'يرجى إدخال رقم موبايل صحيح.' : 'Please provide a valid mobile number.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($subject === '') {
            $m = $isAr ? 'يرجى إدخال موضوع الرسالة.' : 'Subject is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }
        if ($message === '') {
            $m = $isAr ? 'يرجى كتابة نص الرسالة.' : 'Message is required.';
            tk_json(400, ['success' => false, 'message' => $m, 'error' => $m]);
        }

        $subjectDetail = $displayName . ' — ' . $subject;

        $sec1En = 'Section 1 — Sender Contact Information';
        $sec1Ar = 'القسم الأول — بيانات التواصل للمرسل';
        $sec2En = 'Section 2 — Inquiry Subject & Message';
        $sec2Ar = 'القسم الثاني — موضوع وتفاصيل الاستفسار';

        $submittedFields = [
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Inquiry Reference Number', 'labelAr' => 'رقم مرجع الاستفسار', 'value' => $regNum],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Full Name', 'labelAr' => 'الاسم الكامل', 'value' => $nameVal],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Email Address', 'labelAr' => 'البريد الإلكتروني', 'value' => $email],
            ['section' => $sec1En, 'sectionAr' => $sec1Ar, 'label' => 'Mobile Number', 'labelAr' => 'رقم الموبايل', 'value' => $mobileVal],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Subject', 'labelAr' => 'الموضوع', 'value' => $subject],
            ['section' => $sec2En, 'sectionAr' => $sec2Ar, 'label' => 'Message', 'labelAr' => 'الرسالة', 'value' => $message],
        ];
        break;

    default:
        tk_json(400, [
            'success' => false,
            'message' => 'Invalid form key.',
            'error'   => 'Invalid form key.',
        ]);
}

// 5. Brochure signed download URL & attachment (when form_key === exhibitor_brochure)
$siteUrl             = (string) $config['site_url'];
$brochureDownloadUrl = '';
$fullBrochureUrl     = '';
$brochureAttachPath  = null;

if ($formKey === 'exhibitor_brochure') {
    $expMs  = (int) floor(microtime(true) * 1000) + (14 * 24 * 60 * 60 * 1000);
    $secret = (string) $config['brochure_token_secret'];
    $token  = tk_brochure_token($email, $expMs, $secret);
    $brochureDownloadUrl = '/api/brochure.php?token=' . rawurlencode($token)
        . '&email=' . rawurlencode($email)
        . '&exp=' . $expMs
        . ($isAr ? '&lang=ar' : '');
    $fullBrochureUrl    = $siteUrl . $brochureDownloadUrl;
    $brochureAttachPath = tk_brochure_path($isAr ? 'ar' : 'en');
}

/**
 * Helper to render grouped sections table in either English (LTR) or Arabic (RTL).
 */
function tk_render_sections(array $submittedFields, bool $forAr): array
{
    $sectionsMap = [];
    foreach ($submittedFields as $f) {
        $secName = $forAr
            ? ($f['sectionAr'] ?? $f['section'] ?? 'البيانات المرسلة')
            : ($f['section'] ?? 'Submitted Form Fields');
        $sectionsMap[$secName][] = $f;
    }

    $borderSide = $forAr ? 'border-right:4px solid #E92924;' : 'border-left:4px solid #E92924;';
    $textAlign  = $forAr ? 'right' : 'left';
    $dirAttr    = $forAr ? ' dir="rtl"' : '';
    $fontStack  = $forAr ? "'Segoe UI',Tahoma,Arial,sans-serif" : 'Arial,Helvetica,sans-serif';

    $sectionsHtml = '';
    $sectionsText = '';
    foreach ($sectionsMap as $secTitle => $fields) {
        $sectionsHtml .= '<div' . $dirAttr . ' style="margin-top:20px;margin-bottom:8px;padding:9px 14px;background-color:#080808;color:#ffffff;font-family:' . $fontStack . ';font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.6px;text-align:' . $textAlign . ';' . $borderSide . '">'
            . tk_e($secTitle) . '</div>'
            . '<table' . $dirAttr . ' width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-family:' . $fontStack . ';font-size:14px;margin-bottom:16px;">';
        foreach ($fields as $idx => $f) {
            $bg    = ($idx % 2 === 0) ? '#fafafa' : '#ffffff';
            $label = $forAr ? ($f['labelAr'] ?? $f['label']) : $f['label'];
            $sectionsHtml .= '<tr style="background-color:' . $bg . ';">'
                . '<td style="padding:11px 14px;border:1px solid #e5e7eb;width:38%;font-weight:bold;color:#111111;vertical-align:top;text-align:' . $textAlign . ';">' . tk_e($label) . '</td>'
                . '<td style="padding:11px 14px;border:1px solid #e5e7eb;color:#222222;vertical-align:top;white-space:pre-wrap;text-align:' . $textAlign . ';">' . nl2br(tk_e($f['value'])) . '</td>'
                . '</tr>';
        }
        $sectionsHtml .= '</table>';

        $sectionsText .= "\n=== " . $secTitle . " ===\n";
        foreach ($fields as $f) {
            $label = $forAr ? ($f['labelAr'] ?? $f['label']) : $f['label'];
            $sectionsText .= $label . ': ' . $f['value'] . "\n----------------------------------------\n";
        }
    }

    return [$sectionsHtml, $sectionsText];
}

[$ownerSectionsHtml, $ownerSectionsText] = tk_render_sections($submittedFields, false);

try {
    $dt = new DateTimeImmutable('now', new DateTimeZone('Africa/Cairo'));
    $cairoTime = $dt->format('l, d F Y H:i:s') . ' (Africa/Cairo)';
} catch (Throwable) {
    $cairoTime = gmdate('Y-m-d H:i:s') . ' UTC';
}

// 7. Build Owner Notification Email (sent to info@turnkeyshow.com)
$teamSubject = '[Turnkey Show 2027] ' . $classificationLabel . ' — ' . $subjectDetail;
$teamHtml = '<!DOCTYPE html><html><head><meta charset="utf-8" /></head>'
    . '<body style="font-family:Arial,Helvetica,sans-serif;background-color:#f3f4f6;margin:0;padding:24px;">'
    . '<div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d1d5db;border-top:5px solid #E92924;">'
    . '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 28px;border-bottom:2px solid #e5e7eb;background:#ffffff;">'
    . '<tr>'
    . '<td align="left" valign="middle"><img src="cid:turnkey-logo" alt="Turnkey Show" style="height:68px;width:auto;display:block;" /></td>'
    . '<td align="right" valign="middle"><img src="cid:apex-logo" alt="Apex Conventions and Trade Fairs" style="height:46px;width:auto;display:block;" /></td>'
    . '</tr></table>'
    . '<div style="background-color:#fef2f2;border-bottom:2px solid #E92924;padding:18px 28px;">'
    . '<div style="display:inline-block;padding:4px 10px;background:#E92924;color:#ffffff;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">' . tk_e($classificationLabel) . '</div>'
    . '<h2 style="margin:0 0 6px 0;font-size:20px;color:#080808;font-family:\'Arial Black\',Arial,sans-serif;">' . tk_e($formTitleEn) . '</h2>'
    . '<div style="font-size:13px;color:#374151;line-height:1.6;">'
    . '<strong>Form Identifier:</strong> <code>' . tk_e($formKey) . '</code> &nbsp;|&nbsp; '
    . '<strong>Language:</strong> <code>' . ($isAr ? 'Arabic (AR)' : 'English (EN)') . '</code> &nbsp;|&nbsp; '
    . '<strong>Submitted From Page:</strong> <code>' . tk_e($formPagePath) . '</code><br />'
    . '<strong>Submitted At:</strong> ' . tk_e($cairoTime) . ' &nbsp;|&nbsp; <strong>IP:</strong> ' . tk_e($clientIp)
    . '</div></div>'
    . '<div style="padding:20px 28px 28px;">'
    . $ownerSectionsHtml
    . '<div style="margin-top:24px;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;color:#374151;">'
    . '<strong>Direct Reply to Submitter:</strong> '
    . '<a href="mailto:' . tk_e($email) . '" style="color:#E92924;font-weight:bold;text-decoration:none;">'
    . tk_e($displayName) . ' &lt;' . tk_e($email) . '&gt;</a>'
    . '</div></div></div></body></html>';

$teamText = "========================================================\n"
    . "NEW WEBSITE FORM SUBMISSION — TURNKEY SHOW ALAMEIN 2027\n"
    . "========================================================\n"
    . "FORM SPECIFIED : {$formTitleEn}\n"
    . "CATEGORY       : {$classificationLabel}\n"
    . "FORM KEY       : {$formKey}\n"
    . "LANGUAGE       : " . ($isAr ? 'Arabic (AR)' : 'English (EN)') . "\n"
    . "SOURCE PAGE    : {$formPagePath}\n"
    . "SUBMITTED AT   : {$cairoTime}\n"
    . "SUBMITTER      : {$displayName} <{$email}>\n"
    . "CLIENT IP      : {$clientIp}\n"
    . $ownerSectionsText
    . "========================================================\n";

// 8. Check SMTP credentials
if ((string) $config['smtp_password'] === '') {
    error_log('[turnkey-mail] SMTP password is empty in mail-config.php.');
    $m = $isAr
        ? 'خدمة البريد الإلكتروني غير مفعلة حالياً. يرجى التواصل عبر info@turnkeyshow.com.'
        : 'Mail service is not configured yet. Please contact info@turnkeyshow.com directly.';
    tk_json(500, ['success' => false, 'message' => $m, 'error' => $m]);
}

// 9. Send Owner Notification Email via SMTPS (mail.turnkeyshow.com:465)
try {
    $ownerMail = tk_mailer($config);
    $ownerMail->addAddress((string) $config['to_email'], (string) $config['from_name']);
    // Visitor email goes into Reply-To so SPF/DKIM pass for turnkeyshow.com
    $ownerMail->addReplyTo($email, $displayName);
    $ownerMail->Subject = $teamSubject;
    $ownerMail->isHTML(true);
    $ownerMail->Body    = $teamHtml;
    $ownerMail->AltBody = $teamText;
    tk_embed_logos($ownerMail);
    $ownerMail->send();
} catch (PHPMailerException $e) {
    error_log('[turnkey-mail] Owner SMTP send failed: ' . $e->getMessage());
    $m = $isAr
        ? 'تعذر إرسال رسالتك حالياً. يرجى المحاولة مرة أخرى أو مراسلتنا على info@turnkeyshow.com.'
        : 'Unable to send your message right now. Please try again or email info@turnkeyshow.com.';
    tk_json(500, ['success' => false, 'message' => $m, 'error' => $m]);
}

// 10. Build & Send Locale-Specific Auto-Reply Confirmation to the Visitor
//     (English-only when submitted in English; Arabic-only when submitted in Arabic;
//      differentiated per form and styled after Registration (updated).docx)
if (!empty($config['send_autoreply'])) {
    [$replySectionsHtml, $replySectionsText] = tk_render_sections($submittedFields, $isAr);

    $replySubject     = '';
    $formTypeBadge    = '';
    $bodyLines        = [];
    $brochureBtnHtml  = '';
    $brochureTextLink = '';

    if ($isAr) {
        // Arabic Auto-Reply (for Arabic form submissions)
        switch ($formKey) {
            case 'visitor_registration':
                $replySubject  = 'تأكيد تسجيل الزوار — معرض العلمين تيرن كي شو 2027';
                $formTypeBadge = 'تأكيد تسجيل الزوار';
                $bodyLines = [
                    'شكراً لتسجيل زيارة <strong style="color:#1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم التسجيل الخاص بك هو : <strong style="color:#C00000;">' . tk_e($regNum) . '</strong>.',
                    'نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.',
                    'يرجى إظهار تأكيد التسجيل الخاص بك لفريق تيرن كي شو 2027 عند الوصول لقاعات المعرض لتسهيل دخولك.',
                ];
                break;

            case 'exhibitor_brochure':
                $replySubject  = 'الكتيب التعريفي الرسمي — معرض العلمين تيرن كي شو 2027';
                $formTypeBadge = 'تأكيد طلب وتحميل الكتيب التعريفي للمعرض';
                $bodyLines = [
                    'شكراً لطلب الكتيب التعريفي الخاص بـ <strong style="color:#1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم المرجع الخاص بك هو : <strong style="color:#C00000;">' . tk_e($regNum) . '</strong>.',
                    'تم إرفاق نسخة من الكتيب التعريفي الرسمي (PDF) مع هذا البريد الإلكتروني، كما يمكنك تحميله في أي وقت عبر الزر أدناه.',
                    'نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.',
                ];
                $brochureBtnHtml = '<div style="margin:22px 0;text-align:right;">'
                    . '<a href="' . tk_e($fullBrochureUrl) . '" target="_blank" style="background:#E92924;color:#ffffff;text-decoration:none;padding:14px 28px;font-weight:bold;font-size:14px;display:inline-block;">'
                    . 'تحميل الكتيب التعريفي (PDF)</a></div>';
                $brochureTextLink = "\nرابط تحميل الكتيب التعريفي (PDF): {$fullBrochureUrl}\n";
                break;

            case 'exhibitor_booking':
                $replySubject  = 'تأكيد طلب حجز مساحة عرض — معرض العلمين تيرن كي شو 2027';
                $formTypeBadge = 'تأكيد استلام طلب حجز مساحة عرض';
                $bodyLines = [
                    'شكراً لتقديم طلب حجز مساحة عرض في <strong style="color:#1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم مرجع الطلب الخاص بك هو : <strong style="color:#C00000;">' . tk_e($regNum) . '</strong>.',
                    'لقد تلقى فريق مبيعات المعرض تفاصيل طلبكم الموضحة أدناه، وسيتواصل معكم قريباً بمخطط القاعات وخيارات الأجنحة المتاحة.',
                    'نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.',
                ];
                break;

            case 'general_inquiry':
            default:
                $replySubject  = 'تأكيد استلام استفساركم — معرض العلمين تيرن كي شو 2027';
                $formTypeBadge = 'تأكيد استلام استفساركم — تواصل معنا';
                $bodyLines = [
                    'شكراً لتواصلكم مع <strong style="color:#1D2228;">معرض العلمين تيرن كي شو 2027</strong>، رقم مرجع الاستفسار الخاص بك هو : <strong style="color:#C00000;">' . tk_e($regNum) . '</strong>.',
                    'لقد تم استلام رسالتكم بنجاح وسيقوم فريق إدارة المعرض بمراجعتها والرد عليكم في أقرب وقت ممكن.',
                    'نتطلع للترحيب بك خلال الفترة من <strong>06 – 09 مايو 2027</strong> بمركز العلمين الجديدة الدولي للمؤتمرات والمعارض – جمهورية مصر العربية.',
                ];
                break;
        }

        $paragraphsHtml = implode('', array_map(static fn($l) => '<p style="margin:0 0 14px 0;">' . $l . '</p>', $bodyLines));

        $replyHtml = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />'
            . '<title>' . tk_e($replySubject) . '</title></head>'
            . '<body dir="rtl" style="margin:0;padding:0;background-color:#ffffff;font-family:\'Segoe UI\',Tahoma,Arial,sans-serif;color:#1D2228;">'
            . '<table width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="background-color:#ffffff;padding:24px 12px;">'
            . '<tr><td align="center">'
            . '<table width="680" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="max-width:680px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-top:4px solid #E92924;padding:12px 24px;">'
            . '<tr><td style="padding:16px 4px 24px 4px;border-bottom:2px solid #e5e7eb;">'
            . '<table width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl"><tr>'
            . '<td align="right" valign="middle" style="width:50%;"><img src="cid:turnkey-logo" alt="Turnkey Show Alamein" style="height:110px;width:auto;display:block;" /></td>'
            . '<td align="left" valign="middle" style="width:50%;text-align:left;">'
            . '<div style="display:inline-block;text-align:center;">'
            . '<div style="font-size:11px;font-weight:bold;color:#666666;margin-bottom:6px;">تنظيم</div>'
            . '<img src="cid:apex-logo" alt="Apex Conventions &amp; Trade Fairs" style="height:58px;width:auto;display:block;margin:0 auto;" />'
            . '</div></td></tr></table></td></tr>'
            . '<tr><td style="padding:14px 16px;background-color:#fafafa;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;font-weight:bold;color:#E92924;">'
            . tk_e($formTypeBadge) . '</td></tr>'
            . '<tr><td dir="rtl" style="padding:24px 4px 24px 4px;text-align:right;font-size:15px;line-height:1.85;color:#1D2228;border-bottom:1px solid #e5e7eb;">'
            . '<p style="margin:0 0 14px 0;">مرحبا <strong style="color:#C00000;">' . tk_e($displayName) . '</strong>،</p>'
            . $paragraphsHtml . $brochureBtnHtml . '</td></tr>'
            . '<tr><td dir="rtl" style="padding:18px 4px 10px 4px;text-align:right;">'
            . '<div style="font-size:12px;font-weight:bold;color:#6b7280;margin-bottom:4px;">'
            . 'ملخص البيانات المرسلة (' . tk_e($formTitleAr) . ')</div>'
            . $replySectionsHtml . '</td></tr>'
            . '<tr><td dir="rtl" style="padding:18px 4px;border-top:1px solid #e5e7eb;text-align:right;font-size:13px;color:#555555;line-height:1.8;">'
            . '<strong>معرض العلمين تيرن كي شو ٢٠٢٧</strong> &middot; ٠٦ – ٠٩ مايو ٢٠٢٧ &middot; مركز العلمين الدولي للمؤتمرات والمعارض<br />'
            . 'تنظيم <strong>Apex Conventions and Trade Fairs L.L.C</strong> | هاتف: <span dir="ltr">02 389 77 258</span> | موبايل: <span dir="ltr">+2 010 17 57 57 57 / +2 010 41 55 54 55</span><br />'
            . 'البريد الإلكتروني: <a href="mailto:info@turnkeyshow.com" style="color:#E92924;text-decoration:none;">info@turnkeyshow.com</a> | '
            . 'الموقع الإلكتروني: <a href="https://turnkeyshow.com/ar" style="color:#E92924;text-decoration:none;">turnkeyshow.com</a>'
            . '</td></tr></table></td></tr></table></body></html>';

        $replyText = "[{$formTypeBadge}]\n\n"
            . "مرحبا {$displayName}،\n\n"
            . implode("\n", array_map('strip_tags', $bodyLines)) . "\n"
            . $brochureTextLink
            . $replySectionsText
            . "--------------------------------------------------------\n"
            . "معرض العلمين تيرن كي شو 2027 | 06 – 09 مايو 2027\n"
            . "مركز العلمين الدولي للمؤتمرات والمعارض – جمهورية مصر العربية\n"
            . "تنظيم Apex Conventions and Trade Fairs L.L.C\n"
            . "هاتف: 02 389 77 258 | موبايل: +2 010 17 57 57 57 +2 010 41 55 54 55\n"
            . "البريد الإلكتروني: info@turnkeyshow.com | الموقع الإلكتروني: https://turnkeyshow.com/ar\n";
    } else {
        // English Auto-Reply (for English form submissions)
        switch ($formKey) {
            case 'visitor_registration':
                $replySubject  = 'Visitor Registration Confirmation — Turnkey Show Alamein 2027';
                $formTypeBadge = 'VISITOR REGISTRATION CONFIRMATION';
                $bodyLines = [
                    'Thanks for registering to <strong style="color:#1D2228;">Turnkey Show Alamein 2027</strong>, Your registration number is: <strong style="color:#C00000;">' . tk_e($regNum) . '.</strong>',
                    'Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention &amp; Exhibition Center - Arab Republic of Egypt.',
                    'Please show your registration confirmation to Turnkey Show 2027 team upon arrival that will ease up your access.',
                ];
                break;

            case 'exhibitor_brochure':
                $replySubject  = 'Official Sales Brochure — Turnkey Show Alamein 2027';
                $formTypeBadge = 'SALES BROCHURE DOWNLOAD & REQUEST CONFIRMATION';
                $bodyLines = [
                    'Thanks for requesting the official brochure for <strong style="color:#1D2228;">Turnkey Show Alamein 2027</strong>, Your reference number is: <strong style="color:#C00000;">' . tk_e($regNum) . '.</strong>',
                    'We have attached a copy of <strong>Brochure Turnkey Show 2027.pdf</strong> directly to this email, and you can also download it anytime using the button below.',
                    'Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention &amp; Exhibition Center - Arab Republic of Egypt.',
                ];
                $brochureBtnHtml = '<div style="margin:22px 0;text-align:left;">'
                    . '<a href="' . tk_e($fullBrochureUrl) . '" target="_blank" style="background:#E92924;color:#ffffff;text-decoration:none;padding:14px 28px;font-weight:bold;font-size:14px;text-transform:uppercase;letter-spacing:0.8px;display:inline-block;">'
                    . 'Download Brochure (PDF)</a></div>';
                $brochureTextLink = "\nDownload Brochure (PDF): {$fullBrochureUrl}\n";
                break;

            case 'exhibitor_booking':
                $replySubject  = 'Exhibitor Space Booking Confirmation — Turnkey Show Alamein 2027';
                $formTypeBadge = 'EXHIBITOR SPACE BOOKING APPLICATION';
                $bodyLines = [
                    'Thanks for applying to exhibit at <strong style="color:#1D2228;">Turnkey Show Alamein 2027</strong>, Your application reference number is: <strong style="color:#C00000;">' . tk_e($regNum) . '.</strong>',
                    'Our exhibition sales team has received your space booking details below and will contact you shortly with stand options and floor plans.',
                    'Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention &amp; Exhibition Center - Arab Republic of Egypt.',
                ];
                break;

            case 'general_inquiry':
            default:
                $replySubject  = 'We Received Your Inquiry — Turnkey Show Alamein 2027';
                $formTypeBadge = 'CONTACT US — GENERAL INQUIRY CONFIRMATION';
                $bodyLines = [
                    'Thanks for contacting <strong style="color:#1D2228;">Turnkey Show Alamein 2027</strong>, Your inquiry reference number is: <strong style="color:#C00000;">' . tk_e($regNum) . '.</strong>',
                    'We have received your message and our team will review your inquiry and get back to you shortly.',
                    'Looking forward welcoming you during <strong>06 – 09 May 2027</strong> at New Alamein International Convention &amp; Exhibition Center - Arab Republic of Egypt.',
                ];
                break;
        }

        $paragraphsHtml = implode('', array_map(static fn($l) => '<p style="margin:0 0 14px 0;">' . $l . '</p>', $bodyLines));

        $replyHtml = '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />'
            . '<title>' . tk_e($replySubject) . '</title></head>'
            . '<body style="margin:0;padding:0;background-color:#ffffff;font-family:Helvetica,Calibri,Arial,sans-serif;color:#1D2228;">'
            . '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;padding:24px 12px;">'
            . '<tr><td align="center">'
            . '<table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-top:4px solid #E92924;padding:12px 24px;">'
            . '<tr><td style="padding:16px 4px 24px 4px;border-bottom:2px solid #e5e7eb;">'
            . '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
            . '<td align="left" valign="middle" style="width:50%;"><img src="cid:turnkey-logo" alt="Turnkey Show Alamein" style="height:110px;width:auto;display:block;" /></td>'
            . '<td align="right" valign="middle" style="width:50%;text-align:right;">'
            . '<div style="display:inline-block;text-align:center;">'
            . '<div style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#666666;margin-bottom:6px;">Organized By</div>'
            . '<img src="cid:apex-logo" alt="Apex Conventions &amp; Trade Fairs" style="height:58px;width:auto;display:block;margin:0 auto;" />'
            . '</div></td></tr></table></td></tr>'
            . '<tr><td style="padding:14px 16px;background-color:#fafafa;border-bottom:1px solid #e5e7eb;text-align:left;font-size:12px;font-weight:bold;color:#E92924;text-transform:uppercase;letter-spacing:0.8px;">'
            . tk_e($formTypeBadge) . '</td></tr>'
            . '<tr><td style="padding:24px 4px 24px 4px;text-align:left;font-size:15px;line-height:1.75;color:#1D2228;border-bottom:1px solid #e5e7eb;">'
            . '<p style="margin:0 0 14px 0;">Hello <strong style="color:#C00000;">' . tk_e($displayName) . ',</strong></p>'
            . $paragraphsHtml . $brochureBtnHtml . '</td></tr>'
            . '<tr><td style="padding:18px 4px 10px 4px;">'
            . '<div style="font-size:12px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">'
            . 'Summary of Submitted Form (' . tk_e($formTitleEn) . ')</div>'
            . $replySectionsHtml . '</td></tr>'
            . '<tr><td style="padding:18px 4px;border-top:1px solid #e5e7eb;font-size:13px;color:#555555;line-height:1.6;">'
            . '<strong>Turnkey Show Alamein</strong> &middot; 06 – 09 May 2027 &middot; New Alamein International Convention &amp; Exhibition Center<br />'
            . 'Organized by <strong>Apex Conventions and Trade Fairs L.L.C</strong> | Phone: 02 389 77 258 | Mobile: +2 010 17 57 57 57 +2 010 41 55 54 55<br />'
            . 'Email: <a href="mailto:info@turnkeyshow.com" style="color:#E92924;text-decoration:none;">info@turnkeyshow.com</a> | '
            . 'Website: <a href="https://turnkeyshow.com" style="color:#E92924;text-decoration:none;">turnkeyshow.com</a>'
            . '</td></tr></table></td></tr></table></body></html>';

        $replyText = "[{$formTypeBadge}]\n\n"
            . "Hello {$displayName},\n\n"
            . implode("\n", array_map('strip_tags', $bodyLines)) . "\n"
            . $brochureTextLink
            . $replySectionsText
            . "--------------------------------------------------------\n"
            . "Turnkey Show Alamein | 06 – 09 May 2027\n"
            . "New Alamein International Convention & Exhibition Center\n"
            . "Organized by Apex Conventions and Trade Fairs L.L.C\n"
            . "Phone: 02 389 77 258 | Mobile: +2 010 17 57 57 57 +2 010 41 55 54 55\n"
            . "Email: info@turnkeyshow.com | Website: https://turnkeyshow.com\n";
    }

    try {
        $replyMail = tk_mailer($config);
        $replyMail->addAddress($email, $displayName);
        $replyMail->addReplyTo((string) $config['from_email'], (string) $config['from_name']);
        $replyMail->Subject = $replySubject;
        $replyMail->isHTML(true);
        $replyMail->Body    = $replyHtml;
        $replyMail->AltBody = $replyText;
        tk_embed_logos($replyMail);
        if (!empty($config['attach_brochure']) && $brochureAttachPath && is_file($brochureAttachPath)) {
            $replyMail->addAttachment($brochureAttachPath, basename($brochureAttachPath));
        }
        $replyMail->send();
    } catch (PHPMailerException $e) {
        error_log('[turnkey-mail] Visitor auto-reply failed: ' . $e->getMessage());
    }
}

$response = [
    'success'            => true,
    'message'            => $isAr ? 'شكراً لك، تم استلام طلبك بنجاح.' : 'Thank you. Your submission has been received.',
    'registrationNumber' => $regNum,
    'locale'             => $isAr ? 'ar' : 'en',
];
if ($brochureDownloadUrl !== '') {
    $response['brochureUrl'] = $brochureDownloadUrl;
}

tk_json(200, $response);
