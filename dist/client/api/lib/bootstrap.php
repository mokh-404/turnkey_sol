<?php
/**
 * Turnkey Show — shared helpers for the PHP form/brochure endpoints.
 *
 * Runs on cPanel shared hosting with no Composer / SSH: PHPMailer is bundled in
 * ./PHPMailer and loaded directly. Direct HTTP access to /api/lib/ is denied
 * by .htaccess.
 */

declare(strict_types=1);

if (!defined('TK_API')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

/**
 * Loads the git-ignored mail-config.php. Looked up in this order:
 *   1. /home/turnkeyshow/mail-config.php        (one level ABOVE public_html — most secure)
 *   2. /home/turnkeyshow/public_html/mail-config.php
 */
function tk_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $publicRoot = dirname(__DIR__, 2); // .../public_html
    $candidates = [
        dirname($publicRoot) . '/mail-config.php',
        $publicRoot . '/mail-config.php',
    ];

    $loaded = null;
    foreach ($candidates as $file) {
        if (is_file($file) && is_readable($file)) {
            if (!defined('TK_MAIL_CONFIG')) {
                define('TK_MAIL_CONFIG', true);
            }
            $loaded = require $file;
            break;
        }
    }

    if (!is_array($loaded)) {
        error_log('[turnkey-mail] mail-config.php not found or invalid. Upload it to public_html/ (see mail-config.example.php).');
        $loaded = [];
    }

    $defaults = [
        'smtp_host'             => 'mail.turnkeyshow.com',
        'smtp_port'             => 465,
        'smtp_secure'           => 'ssl', // 'ssl' = implicit TLS (SMTPS, port 465); 'tls' = STARTTLS (587)
        'smtp_username'         => 'info@turnkeyshow.com',
        'smtp_password'         => '',
        'smtp_verify_peer'      => true,
        'smtp_timeout'          => 20,
        'from_email'            => 'info@turnkeyshow.com',
        'from_name'             => 'Turnkey Show Alamein',
        'to_email'              => 'info@turnkeyshow.com',
        'site_url'              => 'https://turnkeyshow.com',
        'allowed_origins'       => ['https://turnkeyshow.com', 'https://www.turnkeyshow.com'],
        'send_autoreply'        => true,
        'attach_brochure'       => true,
        'brochure_token_secret' => '',
        'rate_limit_per_hour'   => 10,
    ];

    $config = array_merge($defaults, $loaded);
    $config['site_url'] = rtrim((string) $config['site_url'], '/');
    if ((string) $config['brochure_token_secret'] === '') {
        // Derive a stable server-side secret if none was configured.
        $config['brochure_token_secret'] = hash('sha256', 'tk-brochure|' . (string) $config['smtp_password'] . '|' . __DIR__);
    }
    return $config;
}

/* ------------------------------------------------------------------ */
/* HTTP helpers                                                        */
/* ------------------------------------------------------------------ */

function tk_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function tk_client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** Rejects cross-site browser submissions (basic CSRF protection for a public form). */
function tk_origin_allowed(array $config): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if ($referer === '') {
            return true; // Non-browser clients / privacy-stripped referers.
        }
        $parts = parse_url($referer);
        if (!$parts || empty($parts['host'])) {
            return false;
        }
        $origin = ($parts['scheme'] ?? 'https') . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    }
    $origin = strtolower(rtrim($origin, '/'));
    foreach ((array) $config['allowed_origins'] as $allowed) {
        if ($origin === strtolower(rtrim((string) $allowed, '/'))) {
            return true;
        }
    }
    // Same-host fallback (e.g. temporary cPanel preview URL).
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    return $host !== '' && (parse_url($origin, PHP_URL_HOST) === $host);
}

/* ------------------------------------------------------------------ */
/* Sanitising / validation                                             */
/* ------------------------------------------------------------------ */

/** Single-line value: strips CR/LF (header-injection safe), control chars, trims, limits length. */
function tk_line($value, int $max = 200): string
{
    if (is_array($value) || is_object($value) || $value === null) {
        return '';
    }
    $v = (string) $value;
    if (!mb_check_encoding($v, 'UTF-8')) {
        $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
    }
    $v = preg_replace('/[\r\n\t]+/u', ' ', $v) ?? '';
    $v = preg_replace('/[\x00-\x1F\x7F]/u', '', $v) ?? '';
    $v = trim(preg_replace('/\s{2,}/u', ' ', $v) ?? '');
    return mb_substr($v, 0, $max);
}

/** Multi-line value: keeps newlines, strips other control chars, limits length. */
function tk_text($value, int $max = 5000): string
{
    if (is_array($value) || is_object($value) || $value === null) {
        return '';
    }
    $v = (string) $value;
    if (!mb_check_encoding($v, 'UTF-8')) {
        $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
    }
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    $v = preg_replace("/\n{3,}/", "\n\n", $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

/** List of short strings (e.g. sectors). */
function tk_list($value, int $maxItems = 20, int $maxLen = 120): array
{
    if (!is_array($value)) {
        return [];
    }
    $out = [];
    foreach (array_slice($value, 0, $maxItems) as $item) {
        $clean = tk_line($item, $maxLen);
        if ($clean !== '') {
            $out[] = $clean;
        }
    }
    return array_values(array_unique($out));
}

function tk_valid_email(string $email): bool
{
    return $email !== ''
        && strlen($email) <= 254
        && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && PHPMailer::validateAddress($email);
}

function tk_valid_phone(string $phone): bool
{
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    return (bool) preg_match('/^\+?[0-9\s\-().]{7,20}$/', $phone)
        && strlen($digits) >= 7
        && strlen($digits) <= 15;
}

function tk_e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* ------------------------------------------------------------------ */
/* Rate limiting (file based, per IP and per email)                    */
/* ------------------------------------------------------------------ */

function tk_rate_limited(string $key, int $limit, int $windowSeconds = 3600): bool
{
    if ($limit <= 0) {
        return false;
    }
    $dir = rtrim(sys_get_temp_dir(), '/\\') . '/turnkey_forms_rl';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false; // Fail open if the temp dir is unavailable.
    }
    $file = $dir . '/' . hash('sha256', $key) . '.json';
    $now = time();
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return false;
    }
    try {
        flock($fh, LOCK_EX);
        $raw = stream_get_contents($fh);
        $hits = json_decode($raw ?: '[]', true);
        $hits = array_values(array_filter(is_array($hits) ? $hits : [], static fn($t) => is_int($t) && $t > $now - $windowSeconds));
        if (count($hits) >= $limit) {
            return true;
        }
        $hits[] = $now;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($hits));
        return false;
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/* ------------------------------------------------------------------ */
/* Brochure download tokens (HMAC-SHA256, same scheme as the Node dev server) */
/* ------------------------------------------------------------------ */

function tk_brochure_token(string $email, int $expMs, string $secret): string
{
    return hash_hmac('sha256', $email . ':' . $expMs, $secret);
}

function tk_brochure_token_valid(string $email, int $expMs, string $token, string $secret): bool
{
    if ($email === '' || $expMs <= 0 || $token === '') {
        return false;
    }
    if ((int) floor(microtime(true) * 1000) > $expMs) {
        return false;
    }
    return hash_equals(tk_brochure_token($email, $expMs, $secret), $token);
}

/** Absolute path of a brochure PDF deployed in public_html/. */
function tk_brochure_path(string $lang): ?string
{
    $publicRoot = dirname(__DIR__, 2);
    $file = $lang === 'ar' ? 'Brochure Turnkey Show Arabic 2027.pdf' : 'Brochure Turnkey Show 2027.pdf';
    $path = $publicRoot . '/' . $file;
    return is_file($path) ? $path : null;
}

/* ------------------------------------------------------------------ */
/* SMTP                                                                */
/* ------------------------------------------------------------------ */

/**
 * Builds a PHPMailer instance preconfigured for authenticated SMTPS (port 465).
 * From is ALWAYS the site mailbox (SPF/DKIM alignment); visitors go in Reply-To.
 */
function tk_mailer(array $config): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = (string) $config['smtp_host'];
    $mail->Port       = (int) $config['smtp_port'];
    $mail->SMTPAuth   = true;
    $mail->Username   = (string) $config['smtp_username'];
    $mail->Password   = (string) $config['smtp_password'];
    $mail->SMTPSecure = strtolower((string) $config['smtp_secure']) === 'tls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPAutoTLS = true;
    $mail->Timeout    = (int) $config['smtp_timeout'];
    $mail->CharSet    = PHPMailer::CHARSET_UTF8;
    $mail->Encoding   = PHPMailer::ENCODING_BASE64;
    $mail->XMailer    = ' ';
    if (empty($config['smtp_verify_peer'])) {
        $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]];
    }
    $mail->setFrom((string) $config['from_email'], (string) $config['from_name'], false);
    $mail->Sender = (string) $config['from_email']; // Envelope sender / Return-Path
    $host = parse_url((string) $config['site_url'], PHP_URL_HOST) ?: 'turnkeyshow.com';
    $mail->Hostname = (string) $host;
    $mail->MessageID = sprintf('<%s@%s>', bin2hex(random_bytes(16)), $host);
    return $mail;
}

/** Embeds the Turnkey + Apex logos (cid:turnkey-logo / cid:apex-logo) when available. */
function tk_embed_logos(PHPMailer $mail): void
{
    $publicRoot = dirname(__DIR__, 2);
    $logos = [
        'turnkey-logo' => [$publicRoot . '/logos/turnkey-show-logo.png'],
        'apex-logo'    => [__DIR__ . '/mail-assets/apex-logo.png', $publicRoot . '/logos/apex-logo.png'],
    ];
    foreach ($logos as $cid => $paths) {
        foreach ($paths as $p) {
            if (is_file($p)) {
                $mail->addEmbeddedImage($p, $cid, basename($p), PHPMailer::ENCODING_BASE64, 'image/png');
                break;
            }
        }
    }
}
