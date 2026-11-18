<?php
/**
 * Turnkey Show Alamein 2027 — Signed Brochure Download Endpoint
 * Endpoint: GET /api/brochure.php?token=...&email=...&exp=...[&lang=ar]
 * (Also mapped from /api/brochure via .htaccess)
 */

declare(strict_types=1);

define('TK_API', true);
require_once __DIR__ . '/lib/bootstrap.php';

$config = tk_config();
$token  = tk_line($_GET['token'] ?? '', 256);
$email  = tk_line($_GET['email'] ?? '', 254);
$expStr = tk_line($_GET['exp'] ?? '0', 32);
$expMs  = ctype_digit($expStr) ? (int) $expStr : 0;
$isAr   = (($_GET['lang'] ?? '') === 'ar');

$secret = (string) $config['brochure_token_secret'];

if (!tk_brochure_token_valid($email, $expMs, $token, $secret)) {
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    $expiredTitle   = $isAr ? 'انتهت صلاحية رابط التحميل | معرض تيرن كي' : 'Download Link Expired | Turnkey Show';
    $expiredHeading = $isAr ? 'انتهت صلاحية رابط التحميل' : 'Brochure Link Expired';
    $expiredBody    = $isAr
        ? 'انتهت صلاحية هذا الرابط أو أنه غير صالح. يرجى طلب نسخة جديدة عبر نموذج تحميل البروشور.'
        : 'This download link has expired or is invalid. Please request a new copy using the brochure download form.';
    $expiredCta     = $isAr ? 'طلب البروشور' : 'Request Brochure';
    $retryPath      = $isAr ? '/ar/exhibit/download-brochure' : '/exhibit/download-brochure';
    $langAttr       = $isAr ? 'ar' : 'en';
    $dirAttr        = $isAr ? 'rtl' : 'ltr';
    $fontFamily     = $isAr ? "'Noto Kufi Arabic', sans-serif" : 'sans-serif';

    echo "<!DOCTYPE html>
<html lang=\"{$langAttr}\" dir=\"{$dirAttr}\">
<head>
  <meta charset=\"utf-8\" />
  <title>{$expiredTitle}</title>
  <style>
    body { font-family: {$fontFamily}; background: #080808; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #161616; border: 1px solid #333; padding: 40px; max-width: 480px; text-align: center; }
    h2 { color: #E92824; margin-top: 0; }
    p { color: #aaa; line-height: 1.6; }
    a { display: inline-block; margin-top: 20px; background: #E92824; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class=\"card\">
    <h2>{$expiredHeading}</h2>
    <p>{$expiredBody}</p>
    <a href=\"{$retryPath}\">{$expiredCta}</a>
  </div>
</body>
</html>";
    exit;
}

$filePath = tk_brochure_path($isAr ? 'ar' : 'en');
$downloadFilename = $isAr
    ? 'Brochure Turnkey Show Arabic 2027.pdf'
    : 'Brochure Turnkey Show 2027.pdf';

if (!$filePath || !is_file($filePath)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Brochure file is temporarily unavailable.';
    exit;
}

$size = filesize($filePath);
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $downloadFilename . '"');
if ($size !== false) {
    header('Content-Length: ' . $size);
}
header('Cache-Control: private, max-age=3600');
header('X-Content-Type-Options: nosniff');
readfile($filePath);
exit;
