export type ContactInquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  language: "en" | "ar";
  source: string;
  companyWebsite?: string;
};

export async function submitContactInquiry(payload: ContactInquiryPayload) {
  const response = await fetch("/api/contact-inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to send your message right now.");
  }

  return response.json();
}
