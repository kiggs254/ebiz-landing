import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How E-biz collects, uses, stores, and protects personal data, in line with Kenya's Data Protection Act, 2019.",
  alternates: { canonical: "https://e-biz.co.ke/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated="6 June 2026" path="/privacy">
      <p>
        This Privacy Policy explains how <strong>E-biz</strong> ("E-biz", "we",
        "us") collects, uses, discloses, and safeguards your information when you
        visit <a href="https://e-biz.co.ke">e-biz.co.ke</a>, create an account, or
        use the E-biz Ecommerce Management System (the "Service"). We are
        committed to protecting your privacy and handling your data in an open and
        transparent manner, in accordance with the{" "}
        <strong>Data Protection Act, 2019</strong> of Kenya and other applicable
        laws.
      </p>

      <h2>1. Who we are</h2>
      <p>
        E-biz is a commerce management platform based in Nairobi, Kenya. For the
        purposes of data-protection law, E-biz acts as a <strong>data
        controller</strong> for the personal data of its merchants and website
        visitors, and as a <strong>data processor</strong> for personal data that
        merchants process about their own customers through the Service.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>Account details: your name, business name, email address, and phone number.</li>
        <li>Billing information: your plan, billing address, and tax details. Card and mobile-money payments are processed by our payment partners; we do not store full card numbers.</li>
        <li>Content you submit: products, orders, messages, and support requests.</li>
      </ul>
      <h3>Information we collect automatically</h3>
      <ul>
        <li>Usage and device data: IP address, browser type, pages visited, and timestamps.</li>
        <li>Cookies and similar technologies: see our <a href="/cookies">Cookie Policy</a>.</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To provide, operate, and maintain the Service.</li>
        <li>To process payments and manage your subscription.</li>
        <li>To respond to enquiries and provide customer support.</li>
        <li>To send service updates and, where you have consented, marketing communications.</li>
        <li>To monitor, secure, and improve the Service and prevent fraud.</li>
        <li>To comply with our legal obligations.</li>
      </ul>

      <h2>4. Lawful basis</h2>
      <p>
        We process personal data where it is necessary to perform our contract
        with you, where we have a legitimate interest that is not overridden by
        your rights, where we have your consent, or where we are required to do so
        by law.
      </p>

      <h2>5. Payment processing</h2>
      <p>
        Payments are handled by third-party providers including M-Pesa
        (Safaricom), Pesapal, and Paystack. Your payment information is shared
        with these providers solely to process transactions and is subject to
        their respective privacy policies.
      </p>

      <h2>6. Sharing your information</h2>
      <p>
        We do not sell your personal data. We share it only with: service
        providers who help us run the Service (such as hosting, payments, email,
        and analytics) under appropriate confidentiality obligations; and
        authorities where required by law or to protect our rights.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We retain personal data for as long as your account is active and as
        needed to provide the Service, then for any additional period required to
        meet legal, accounting, or reporting obligations. You may request deletion
        of your data as described below.
      </p>

      <h2>8. Security</h2>
      <p>
        Each E-biz deployment runs on its own server with its own database. We
        apply technical and organisational measures, including encryption in
        transit, access controls, and regular backups, to protect your data. No
        method of transmission or storage is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>9. Your rights</h2>
      <p>Under the Data Protection Act, 2019, you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>request correction of inaccurate data;</li>
        <li>request deletion of your data;</li>
        <li>object to or restrict certain processing;</li>
        <li>request a portable copy of your data; and</li>
        <li>withdraw consent at any time.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href="mailto:hello@e-biz.co.ke">hello@e-biz.co.ke</a>. You also have the
        right to lodge a complaint with the Office of the Data Protection
        Commissioner (ODPC) of Kenya.
      </p>

      <h2>10. International transfers</h2>
      <p>
        Where data is transferred outside Kenya, we take steps to ensure it
        receives a level of protection consistent with applicable law.
      </p>

      <h2>11. Children</h2>
      <p>
        The Service is not directed to individuals under 18, and we do not
        knowingly collect their personal data.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will
        be posted on this page with a revised "Last updated" date.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:hello@e-biz.co.ke">hello@e-biz.co.ke</a> or visit our{" "}
        <a href="/contact">Contact</a> page.
      </p>
    </LegalDoc>
  );
}
