<?php
/**
 * Turnkey Show Alamein 2027 — Production SMTP Mail Configuration (TEMPLATE)
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Copy this file to `mail-config.php` (which is git-ignored so your password is never committed).
 * 2. Replace `[PASTE_YOUR_EMAIL_PASSWORD_HERE]` with the real mailbox password.
 * 3. Upload `mail-config.php` via cPanel File Manager to EITHER:
 *      - `/home/turnkeyshow/mail-config.php` (recommended: one level above public_html)
 *      - `/home/turnkeyshow/public_html/mail-config.php` (blocked from browser access by .htaccess)
 */

declare(strict_types=1);

if (!defined('TK_MAIL_CONFIG')) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

return [
    // cPanel SMTP Settings
    'smtp_host'             => 'mail.turnkeyshow.com',
    'smtp_port'             => 465,
    'smtp_secure'           => 'ssl', // SSL/TLS (SMTPS on port 465)
    'smtp_username'         => 'info@turnkeyshow.com',
    'smtp_password'         => '[PASTE_YOUR_EMAIL_PASSWORD_HERE]',
    'smtp_verify_peer'      => true,
    'smtp_timeout'          => 20,

    // Sender & Recipient (From MUST be info@turnkeyshow.com so SPF/DKIM pass)
    'from_email'            => 'info@turnkeyshow.com',
    'from_name'             => 'Turnkey Show Alamein',
    'to_email'              => 'info@turnkeyshow.com',

    // Site & Security
    'site_url'              => 'https://turnkeyshow.com',
    'allowed_origins'       => [
        'https://turnkeyshow.com',
        'https://www.turnkeyshow.com',
    ],
    'send_autoreply'        => true,
    'attach_brochure'       => true,
    'brochure_token_secret' => 'turnkey-show-secret-token-key-2027',
    'rate_limit_per_hour'   => 10,
];
