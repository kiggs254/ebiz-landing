// Client for the E-biz Manager public lead endpoints (/api/public/*).
// The Manager (manager.e-biz.co.ke) stores submissions + sends email + runs AI.

const MANAGER_API = (
  process.env.NEXT_PUBLIC_MANAGER_API || "https://manager.e-biz.co.ke"
).replace(/\/$/, "");

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${MANAGER_API}/api/public/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (!res.ok || (json as { status?: string }).status === "error") {
    throw new Error((json as { message?: string }).message || `Request failed (${res.status})`);
  }
  return ((json as { data?: T }).data ?? ({} as T)) as T;
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string;
  hp?: string; // honeypot
}

export function submitContact(p: ContactPayload) {
  return post<{ id: number }>("contact", p);
}

export interface OnboardingPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  website?: string;
  selling_channels?: string[];
  sells?: string;
  size?: string;
  priorities?: string[];
  about?: string;
  followup_q?: string;
  followup_a?: string;
  source?: string;
  hp?: string; // honeypot
}

export function submitOnboarding(p: OnboardingPayload) {
  return post<{ id: number; recommendation: string | null }>("onboarding", p);
}

export interface AssistPayload {
  selling_channels?: string[];
  sells?: string;
  size?: string;
  priorities?: string[];
  about?: string;
  country?: string;
  company?: string;
  hp?: string;
}

export function onboardingAssist(p: AssistPayload) {
  return post<{ question: string | null }>("onboarding/assist", p);
}
