# Production Deployment & Live Email Setup Guide

This guide explains the exact steps needed when publishing **Turnkey Show Alamein 2027** to a production server (or running live from a host/VPS) so that all 4 website forms send real emails to the owner (`mustafa.khafaga@gmail.com` or `info@turnkeyshow.com`) and send automated bilingual replies (with the PDF brochure attached) to visitors and exhibitors.

---

## How Email Sending Works in This Project

The backend handler in `src/server/forms-handler.ts` supports **two production email methods** out of the box (and automatically reads `.env` without needing a code change):

1. **Option A — SMTP (Recommended for Gmail / Google Workspace / cPanel / Microsoft 365)**
2. **Option B — Resend API (Recommended for Cloudflare Workers / Serverless / High-Volume Delivery)**

Whenever a user submits **any** of the 4 forms:
- **Book Your Space** (`/exhibit/book-your-space`)
- **Download Brochure** (`/exhibit/download-brochure`)
- **Visitor Registration** (`/visit/visitor-registration`)
- **Contact Us** (`/contact`)

The server dispatches two emails:
1. **Owner Notification Email** → Sent to `FORMS_TO_EMAIL` (currently `mustafa.khafaga@gmail.com`) with a clear header banner specifying which form was filled and all fields separated into sections.
2. **User Auto-Reply Email** → Sent to the user's email address in English & Arabic (styled after `Registration (updated).docx` with the official Turnkey Show logo and transparent Apex logo embedded via `cid:`, plus `Brochure Turnkey Show 2027.pdf` attached for brochure requests).

---

## Option A: Using Gmail / Google Workspace SMTP (Fastest Setup)

If you want to send emails using a Gmail account (e.g., `mustafa.khafaga@gmail.com`) or a Google Workspace domain email (`info@turnkeyshow.com`):

### Step 1: Generate a 16-Character Google App Password
1. Sign in to the Google account that will send the emails.
2. Enable **2-Step Verification** on the Google account if it is not already enabled:  
   `https://myaccount.google.com/signinoptions/two-step-verification`
3. Go to **Google App Passwords**:  
   `https://myaccount.google.com/apppasswords`
4. Create a new App Password named **`Turnkey Show Website`**.
5. Copy the 16-character password Google gives you (e.g., `abcd efgh ijkl mnop`).

### Step 2: Set the `.env` Variables on Your Server
Open `.env` in the project root (`/home/fsociety/molla/mokh/turnkey_sol_main/.env`) and fill in your credentials:

```env
# Recipient inbox for all owner form notifications
FORMS_TO_EMAIL=mustafa.khafaga@gmail.com

# Sender display details
MAIL_FROM=info@turnkeyshow.com
MAIL_FROM_NAME=Turnkey Show Alamein
MAIL_REPLY_TO=info@turnkeyshow.com

# Gmail / Google Workspace SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-sender-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop

# Public domain of the deployed website (used for brochure download links)
SITE_URL=https://www.turnkeyshow.com

# Brochure security & file path
BROCHURE_TOKEN_SECRET=turnkey-show-secret-token-key-2027
BROCHURE_FILE_PATH=public/Brochure Turnkey Show 2027.pdf
```

---

## Option B: Using Custom Domain cPanel / Private Server SMTP

If your domain `turnkeyshow.com` is hosted on cPanel, Plesk, Namecheap Private Email, or Microsoft 365:

1. Create an email mailbox in your hosting control panel (e.g., `no-reply@turnkeyshow.com` or `info@turnkeyshow.com`).
2. Update `.env` on the server with your mail server's SMTP host and credentials:

```env
FORMS_TO_EMAIL=mustafa.khafaga@gmail.com
MAIL_FROM=info@turnkeyshow.com
MAIL_FROM_NAME=Turnkey Show Alamein
MAIL_REPLY_TO=info@turnkeyshow.com

SMTP_HOST=mail.turnkeyshow.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@turnkeyshow.com
SMTP_PASS=YOUR_MAILBOX_PASSWORD

SITE_URL=https://www.turnkeyshow.com
BROCHURE_TOKEN_SECRET=turnkey-show-secret-token-key-2027
BROCHURE_FILE_PATH=public/Brochure Turnkey Show 2027.pdf
```

---

## Option C: Using Resend API (Alternative to SMTP)

If your server blocks outbound SMTP ports (`465`/`587`) or you deploy to a serverless platform:

1. Create a free account at [https://resend.com](https://resend.com) and verify the domain `turnkeyshow.com`.
2. Generate an API key (`re_...`) and add it to `.env`:

```env
FORMS_TO_EMAIL=mustafa.khafaga@gmail.com
MAIL_FROM=info@turnkeyshow.com
MAIL_FROM_NAME=Turnkey Show Alamein
RESEND_API_KEY=re_xxxxxxxxx
SITE_URL=https://www.turnkeyshow.com
```

---

## DNS Records Checklist for `turnkeyshow.com` (Deliverability & Anti-Spam)

When switching to your official domain (`info@turnkeyshow.com`), make sure these 3 DNS records are added in your domain registrar / Cloudflare DNS so emails always land in the Primary Inbox and never in Spam:

1. **SPF Record (`TXT` on `@`):**  
   Authorizes your mail server (e.g., Google Workspace `v=spf1 include:_spf.google.com ~all` or your hosting provider's SPF string).
2. **DKIM Record (`TXT`):**  
   Cryptographically signs outgoing emails from `turnkeyshow.com` (generated in your Google Workspace / cPanel / Resend dashboard).
3. **DMARC Record (`TXT` on `_dmarc`):**  
   `v=DMARC1; p=none; rua=mailto:info@turnkeyshow.com`

---

## Verifying Live Emails After Configuring `.env`

1. Once `SMTP_USER` and `SMTP_PASS` are saved in `.env`, you do **not** even need to rebuild if running locally—`src/server/forms-handler.ts` reloads `.env` automatically on each submission.
2. Visit `/exhibit/download-brochure` and submit a test entry:
   - Your browser will immediately download `Brochure Turnkey Show 2027.pdf`.
   - `mustafa.khafaga@gmail.com` will receive the `[Turnkey Show 2027] EXHIBITOR · Sales Brochure Download` notification with all form fields clearly separated.
   - The visitor's email address will receive the bilingual confirmation email with the Turnkey Show logo, new Apex logo, and `Brochure Turnkey Show 2027.pdf` attached.
