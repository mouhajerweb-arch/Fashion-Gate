import { createClient } from "@sanity/client";
import Link from "next/link";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

export const metadata = {
  title: "Unsubscribe | Fashion Gate Mall",
  robots: {
    index: false,
    follow: false,
  },
};

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

type PageProps = {
  searchParams?: Promise<{ token?: string }>;
};

async function unsubscribe(token?: string) {
  if (!token || token.length < 10 || token.length > 120 || !writeClient.config().token) {
    return {
      title: "Unable to update your subscription",
      message: "This unsubscribe link is invalid or has expired.",
    };
  }

  try {
    const subscriber = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "newsletterSubscriber" && unsubscribeToken == $token][0]{_id}`,
      { token } as Record<string, string>
    );

    if (!subscriber?._id) {
      return {
        title: "Subscription already updated",
        message: "We could not find an active subscription for this link.",
      };
    }

    await writeClient
      .patch(subscriber._id)
      .set({ status: "unsubscribed", unsubscribedAt: new Date().toISOString() })
      .commit();

    return {
      title: "You have been unsubscribed",
      message: "You will no longer receive Fashion Gate Mall newsletter updates.",
    };
  } catch (error) {
    console.error("Newsletter unsubscribe page failed", error instanceof Error ? error.message : "Unknown error");
    return {
      title: "Unable to update your subscription",
      message: "Please try again later or contact our team for assistance.",
    };
  }
}

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await unsubscribe(params?.token);

  return (
    <main
      style={{
        minHeight: "calc(100vh - 120px)",
        background: "#ffffff",
        color: "#111111",
        padding: "clamp(42px, 6vw, 82px) 18px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "clamp(34px, 6vw, 62px)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 24px",
              background: "#111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/brand/logo.png"
              alt="Fashion Gate Mall"
              width={42}
              height={42}
              style={{ display: "block", width: 42, height: 42, objectFit: "contain" }}
            />
          </div>
          <div
            aria-hidden="true"
            style={{
              width: "min(210px, 62vw)",
              aspectRatio: "1.42 / 1",
              margin: "0 auto 28px",
              overflow: "hidden",
            }}
          >
            <img
              src="/newsletter/unsubscribe-reaction.jpg"
              alt=""
              width={210}
              height={148}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <p
            style={{
              margin: "0 0 16px",
              fontFamily: "var(--font-cairo), Arial, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.24em",
              color: "#8a7e73",
              textTransform: "uppercase",
            }}
          >
            Newsletter Preferences
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(38px, 6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1.02,
              color: "#111111",
            }}
          >
            {result.title}
          </h1>
          <div
            style={{
              width: 58,
              height: 1,
              margin: "24px auto 0",
              background: "#CB6116",
            }}
          />
          <p
            style={{
              maxWidth: 520,
              margin: "24px auto 0",
              fontFamily: "var(--font-cairo), Arial, sans-serif",
              fontSize: 15,
              lineHeight: 1.9,
              color: "#5f5750",
            }}
          >
            {result.message}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 34,
              minHeight: 48,
              padding: "0 28px",
              background: "#111111",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: "var(--font-cairo), Arial, sans-serif",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              boxShadow: "0 16px 34px rgba(17, 17, 17, 0.16)",
            }}
          >
            Return to website
          </Link>
        </div>
      </section>
    </main>
  );
}
