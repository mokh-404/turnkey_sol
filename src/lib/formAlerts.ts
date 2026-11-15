const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

/**
 * Displays a custom branded website popup alert instead of the native browser alert().
 */
export function showSiteAlert(
  message: string,
  options: { title?: string; onClose?: () => void } = {},
): void {
  if (typeof document === "undefined") return;

  // Remove any existing alert modal first
  const existing = document.getElementById("tk-site-alert-overlay");
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "tk-site-alert-overlay";
  overlay.className = "site-alert-overlay";
  overlay.setAttribute("role", "alertdialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "tk-site-alert-title");
  overlay.setAttribute("aria-describedby", "tk-site-alert-desc");

  const modal = document.createElement("div");
  modal.className = "site-alert-modal";

  const header = document.createElement("div");
  header.className = "site-alert-header";

  const iconWrap = document.createElement("div");
  iconWrap.className = "site-alert-icon";
  iconWrap.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  const titleEl = document.createElement("h4");
  titleEl.id = "tk-site-alert-title";
  titleEl.className = "site-alert-title";
  titleEl.textContent = options.title || "Attention Required";

  header.appendChild(iconWrap);
  header.appendChild(titleEl);

  const body = document.createElement("p");
  body.id = "tk-site-alert-desc";
  body.className = "site-alert-message";
  body.textContent = message;

  const actions = document.createElement("div");
  actions.className = "site-alert-actions";

  const okBtn = document.createElement("button");
  okBtn.type = "button";
  okBtn.className = "hero-btn hero-btn-primary site-alert-btn";
  okBtn.textContent = "OK";

  const close = () => {
    window.removeEventListener("keydown", onKeyDown);
    overlay.remove();
    options.onClose?.();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      close();
    }
  };

  okBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener("keydown", onKeyDown);

  actions.appendChild(okBtn);
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  okBtn.focus();
}

/**
 * In-website popup validation for required fields, name, email, and phone fields.
 * Returns true when the form is valid, false (after showing the website popup) otherwise.
 */
export function validateContactFields(
  form: HTMLFormElement,
  options: { checkRequired?: boolean } = {},
): boolean {
  if (options.checkRequired !== false) {
    const fields = Array.from(form.elements) as Array<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
    for (const el of fields) {
      if (el.required && !el.value.trim()) {
        showSiteAlert("Please fill in all required fields.", {
          onClose: () => el.focus(),
        });
        return false;
      }
    }
  }

  for (const name of ["name", "full_name", "contactName"]) {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!el || !el.value.trim()) continue;
    if (!/\p{L}/u.test(el.value)) {
      showSiteAlert("Full Name must contain letters (numbers alone are not allowed).", {
        onClose: () => el.focus(),
      });
      return false;
    }
  }

  const email = form.elements.namedItem("email") as HTMLInputElement | null;
  if (email && email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
    showSiteAlert("Please enter a valid email address (e.g. name@company.com).", {
      onClose: () => email.focus(),
    });
    return false;
  }

  for (const name of ["phone", "mobile"]) {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!el || !el.value.trim()) continue;
    const digits = el.value.replace(/\D/g, "");
    if (!PHONE_RE.test(el.value.trim()) || digits.length < 7 || digits.length > 15) {
      showSiteAlert("Please enter a valid phone number (digits only, optional + prefix).", {
        onClose: () => el.focus(),
      });
      return false;
    }
  }
  return true;
}
