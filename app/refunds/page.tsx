import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "E-biz subscription billing, cancellations, and refunds.",
  alternates: { canonical: "https://e-biz.co.ke/refunds" },
};

export default function RefundsPage() {
  return (
    <LegalDoc title="Refund Policy" updated="6 June 2026" path="/refunds">
      <p>
        This Refund Policy applies to subscriptions to the <strong>E-biz</strong>{" "}
        Ecommerce Management System. It forms part of our{" "}
        <a href="/terms">Terms &amp; Conditions</a>.
      </p>

      <h2>1. Subscriptions</h2>
      <p>
        E-biz is billed in advance on a recurring (monthly or annual) basis. Your
        subscription renews automatically until you cancel.
      </p>

      <h2>2. Cancellations</h2>
      <p>
        You can cancel at any time from your account or by contacting us.
        Cancellation stops future renewals; you keep access until the end of the
        billing period you have already paid for.
      </p>

      <h2>3. Refunds</h2>
      <ul>
        <li>Fees already paid are generally non-refundable, including for partially used periods.</li>
        <li>We may, at our discretion, issue a refund where the Service was materially unavailable due to our fault, or where required by law.</li>
        <li>Charges you believe are incorrect should be reported within 14 days so we can investigate.</li>
      </ul>

      <h2>4. How to request</h2>
      <p>
        To request a refund or raise a billing question, email{" "}
        <a href="mailto:hello@e-biz.co.ke">hello@e-biz.co.ke</a> with your account
        details and the reason for your request. Approved refunds are returned via
        the original payment method where possible.
      </p>
    </LegalDoc>
  );
}
