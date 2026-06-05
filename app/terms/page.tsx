import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of the E-biz Ecommerce Management System and e-biz.co.ke.",
  alternates: { canonical: "https://e-biz.co.ke/terms" },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms & Conditions" updated="6 June 2026" path="/terms">
      <p>
        These Terms &amp; Conditions ("Terms") govern your access to and use of
        the <strong>E-biz</strong> Ecommerce Management System, our website{" "}
        <a href="https://e-biz.co.ke">e-biz.co.ke</a>, and related services
        (together, the "Service"). By creating an account or using the Service,
        you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        E-biz provides software that lets businesses manage products, orders,
        customers, payments, and marketing across online, in-store, and WhatsApp
        channels. We may add, change, or remove features over time.
      </p>

      <h2>2. Accounts</h2>
      <ul>
        <li>You must provide accurate information and keep it up to date.</li>
        <li>You are responsible for safeguarding your login credentials and for all activity under your account.</li>
        <li>You must be at least 18 years old and able to enter into a binding contract.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Service for any unlawful, fraudulent, or harmful purpose;</li>
        <li>sell prohibited or illegal goods or services;</li>
        <li>attempt to gain unauthorised access to the Service or disrupt its operation;</li>
        <li>reverse-engineer, resell, or sublicense the Service except as permitted; or</li>
        <li>infringe the intellectual-property or privacy rights of others.</li>
      </ul>

      <h2>4. Subscriptions &amp; payment</h2>
      <ul>
        <li>Paid plans are billed in advance on a recurring basis through our payment partners (M-Pesa, Pesapal, Paystack, or card).</li>
        <li>Fees are exclusive of applicable taxes unless stated otherwise.</li>
        <li>Unless required by law, fees already paid are non-refundable. See our <a href="/refunds">Refund Policy</a> for details.</li>
        <li>We may change pricing on reasonable notice; changes take effect on your next billing cycle.</li>
      </ul>

      <h2>5. Your content and data</h2>
      <p>
        You retain ownership of the data and content you submit to the Service.
        You grant us a limited licence to host and process that content solely to
        operate and provide the Service. You are responsible for the legality of
        your content and for complying with the laws that apply to your business
        and your customers.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The Service, including its software, design, and trademarks, is owned by
        E-biz and its licensors and is protected by law. These Terms do not grant
        you any rights to our intellectual property except the limited right to
        use the Service.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        The Service integrates with third-party providers (such as payment
        gateways and messaging platforms). Your use of those services is governed
        by their own terms, and we are not responsible for them.
      </p>

      <h2>8. Availability</h2>
      <p>
        We work hard to keep the Service available but do not guarantee
        uninterrupted or error-free operation. We may suspend the Service for
        maintenance, security, or legal reasons.
      </p>

      <h2>9. Suspension &amp; termination</h2>
      <p>
        You may cancel at any time from your account. We may suspend or terminate
        your access if you breach these Terms, fail to pay, or use the Service in
        a way that risks harm to E-biz or others. On termination, your right to
        use the Service stops; we may delete your data after a reasonable period.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of
        any kind, whether express or implied, to the fullest extent permitted by
        law.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, E-biz will not be liable for any
        indirect, incidental, special, or consequential damages, or for loss of
        profits, revenue, or data. Our total liability for any claim relating to
        the Service is limited to the amount you paid us in the three months
        before the claim arose.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You agree to indemnify E-biz against claims arising from your use of the
        Service, your content, or your breach of these Terms.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of Kenya, and the courts of Kenya
        have exclusive jurisdiction over any dispute, without prejudice to any
        mandatory consumer-protection rights you may have.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. We will post the updated
        Terms here and, where the changes are material, notify you. Continued use
        of the Service after changes take effect means you accept them.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:hello@e-biz.co.ke">hello@e-biz.co.ke</a>.
      </p>
    </LegalDoc>
  );
}
