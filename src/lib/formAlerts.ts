const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-().]{7,20}$/;

/**
 * Simple browser-alert validation for email and phone fields.
 * Returns true when the form is OK, false (after alerting) otherwise.
 */
export function validateContactFields(
  form: HTMLFormElement,
  options: { checkRequired?: boolean } = {},
): boolean {
  if (options.checkRequired) {
    const fields = Array.from(form.elements) as Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    for (const el of fields) {
      if (el.required && !el.value.trim()) {
        alert("Please fill in all required fields.");
        el.focus();
        return false;
      }
    }
  }

  for (const name of ["name", "full_name", "contactName"]) {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!el || !el.value.trim()) continue;
    if (!/\p{L}/u.test(el.value)) {
      alert("Full Name must contain letters (numbers alone are not allowed).");
      el.focus();
      return false;
    }
  }

  const email = form.elements.namedItem("email") as HTMLInputElement | null;
  if (email && email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
    alert("Please enter a valid email address (e.g. name@company.com).");
    email.focus();
    return false;
  }

  for (const name of ["phone", "mobile"]) {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!el || !el.value.trim()) continue;
    const digits = el.value.replace(/\D/g, "");
    if (!PHONE_RE.test(el.value.trim()) || digits.length < 7 || digits.length > 15) {
      alert("Please enter a valid phone number (digits only, optional + prefix).");
      el.focus();
      return false;
    }
  }
  return true;
}
