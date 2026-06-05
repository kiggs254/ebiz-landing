import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How and why E-biz uses cookies and similar technologies.",
  alternates: { canonical: "https://e-biz.co.ke/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalDoc title="Cookie Policy" updated="6 June 2026">
      <p>
        This Cookie Policy explains how <strong>E-biz</strong> uses cookies and
        similar technologies on <a href="https://e-biz.co.ke">e-biz.co.ke</a> and
        within the Service. It should be read together with our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They help the site work, remember your preferences, and
        understand how it is used.
      </p>

      <h2>2. Types of cookies we use</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — required for the site and your
          account to function, including security and session management. These
          cannot be switched off.
        </li>
        <li>
          <strong>Preferences</strong> — remember choices such as your theme
          (light/dark) and language.
        </li>
        <li>
          <strong>Analytics</strong> — help us understand how visitors use the
          site so we can improve it. These are aggregated and, where required,
          set only with your consent.
        </li>
      </ul>

      <h2>3. Third-party cookies</h2>
      <p>
        Some cookies may be set by third parties that provide services to us, such
        as analytics and payment providers. We do not control these cookies;
        please refer to those providers' own policies.
      </p>

      <h2>4. Managing cookies</h2>
      <p>
        You can control and delete cookies through your browser settings. Blocking
        strictly necessary cookies may prevent parts of the Service from working.
        Most browsers let you refuse or remove cookies and notify you when one is
        set.
      </p>

      <h2>5. Changes</h2>
      <p>
        We may update this Cookie Policy from time to time. The latest version
        will always be available on this page.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href="mailto:hello@e-biz.co.ke">hello@e-biz.co.ke</a>.
      </p>
    </LegalDoc>
  );
}
