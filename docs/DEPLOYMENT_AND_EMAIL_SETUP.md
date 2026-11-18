# Production Deployment & Live Email Setup Guide (cPanel Shared Hosting)

This guide explains the production deployment of **Turnkey Show Alamein 2027** to cPanel shared hosting (no SSH / shell access required):

- **Live Domain:** `https://turnkeyshow.com` (SSL active)
- **cPanel Username:** `turnkeyshow`
- **Document Root:** `/home/turnkeyshow/public_html`
- **Server IP:** `209.42.31.214`

---

## 1. Architecture on cPanel Shared Hosting

1. **Static Prerendered Permalinks (`dist/client/`):**
   - Running `npm run build` compiles all 32 English (`/`, `/about/turnkey-show`, …) and Arabic (`/ar`, `/ar/about/turnkey-show`, …) routes into standalone `index.html` files inside `dist/client/<route>/index.html`, along with `404.html`, `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.htaccess`, and all optimized `.webp`/`.png` images under `dist/client/assets/` and `dist/client/logos/`.
   - Because `dist/client/` is tracked in Git (`!dist/client` in `.gitignore`), pushing to Git and clicking **Deploy HEAD Commit** in cPanel **Git™ Version Control** deploys all HTML permalinks, images, PDFs, `.htaccess`, and PHP endpoints directly to `/home/turnkeyshow/public_html/` via `.cpanel.yml` without needing Node.js or SSH on the server.
2. **Self-Contained PHP SMTP Handler (`public/api/send-mail.php` & `public/api/brochure.php`):**
   - Bundled with PHPMailer v6.10.0 (`public/api/lib/PHPMailer/`) so no `composer install` or SSH access is needed on cPanel.
   - Connects via authenticated SMTPS (`mail.turnkeyshow.com`, port `465`, SSL/TLS) using `info@turnkeyshow.com`.
   - Sets `From: "Turnkey Show Alamein" <info@turnkeyshow.com>` and `Reply-To: <visitor email>` so SPF/DKIM/DMARC pass.
   - Sends an **English-only** auto-reply when the user submits an English form, and an **Arabic-only (RTL)** auto-reply when the user submits an Arabic form (`/ar/...`), with each auto-reply tailored to the specific form and styled after `Registration (updated).docx`.

---

## 2. Server-Only Secret File (`mail-config.php`)

To keep the email password out of Git:
- `mail-config.php` and `.env` are git-ignored in `.gitignore`.
- `mail-config.example.php` and `.env.example` are committed as safe templates.
- Upload the local git-ignored `mail-config.php` via **cPanel File Manager** to:
  - `/home/turnkeyshow/public_html/mail-config.php` (blocked from direct browser access by `.htaccess` and `TK_MAIL_CONFIG` guard), **or**
  - `/home/turnkeyshow/mail-config.php` (one level above `public_html`).
- `.cpanel.yml` automatically backs up and restores `mail-config.php` and `.env` during Git deployments so they are never overwritten or deleted.
