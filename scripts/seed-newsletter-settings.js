const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "4y6hfnze";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  useCdn: false,
  token,
});

async function uploadImage(relativePath, filename) {
  const filePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(filePath)) return undefined;
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), { filename });
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

async function main() {
  const [unsubscribeLogo, unsubscribeReactionImage] = await Promise.all([
    uploadImage("public/brand/logo.png", "fashion-gate-logo.png"),
    uploadImage("public/newsletter/unsubscribe-reaction.jpg", "newsletter-unsubscribe-reaction.jpg"),
  ]);

  await client.createOrReplace({
    _id: "newsletterSettings",
    _type: "newsletterSettings",
    subscribeSuccess: { ar: "تم الاشتراك بنجاح.", en: "Subscribed successfully." },
    subscribeAlready: { ar: "أنت مشترك بالفعل.", en: "You're already subscribed." },
    subscribeError: { ar: "تعذر الاشتراك الآن. يرجى المحاولة لاحقاً.", en: "Unable to subscribe right now. Please try again later." },
    invalidEmail: { ar: "يرجى إدخال بريد إلكتروني صحيح.", en: "Please enter a valid email address." },
    tooManyRequests: { ar: "طلبات كثيرة. يرجى المحاولة لاحقاً.", en: "Too many requests. Please try again later." },
    welcomeEmailSubject: { ar: "مرحباً بك في تحديثات فاشن غيت مول", en: "Welcome to Fashion Gate Mall updates" },
    welcomeEmailTitle: { ar: "مرحباً بك في تحديثات فاشن غيت مول", en: "Welcome to Fashion Gate Mall updates" },
    welcomeEmailIntro: {
      ar: "شكراً لاشتراكك في تحديثاتنا الخاصة. ستصلك دعوات مختارة، وإطلاقات المجموعات الموسمية، وأخبار فاشن غيت مول.",
      en: "Thank you for subscribing to our private updates. You will receive selected invitations, seasonal collection launches, and refined notes from Fashion Gate Mall.",
    },
    welcomeEmailBody: {
      ar: "تم اشتراكك بنجاح. سنبقيك قريباً من أحدث الدعوات والمجموعات الموسمية وتحديثات فاشن غيت مول الخاصة.",
      en: "You're subscribed. We'll keep you close to our latest invitations, seasonal collections, and private Fashion Gate Mall updates.",
    },
    contactLabel: { ar: "التواصل", en: "Contact" },
    bestRegards: { ar: "مع أطيب التحيات،", en: "Best regards," },
    unsubscribeLabel: { ar: "إلغاء الاشتراك", en: "Unsubscribe" },
    newsletterPreferences: { ar: "تفضيلات النشرة البريدية", en: "Newsletter Preferences" },
    ...(unsubscribeLogo ? { unsubscribeLogo } : {}),
    ...(unsubscribeReactionImage ? { unsubscribeReactionImage } : {}),
    unsubscribeSuccessTitle: { ar: "تم إلغاء اشتراكك", en: "You have been unsubscribed" },
    unsubscribeSuccessMessage: { ar: "لن تصلك تحديثات النشرة البريدية من فاشن غيت مول بعد الآن.", en: "You will no longer receive Fashion Gate Mall newsletter updates." },
    unsubscribeInvalidTitle: { ar: "تعذر تحديث اشتراكك", en: "Unable to update your subscription" },
    unsubscribeInvalidMessage: { ar: "رابط إلغاء الاشتراك غير صالح أو انتهت صلاحيته.", en: "This unsubscribe link is invalid or has expired." },
    unsubscribeAlreadyTitle: { ar: "تم تحديث الاشتراك مسبقاً", en: "Subscription already updated" },
    unsubscribeAlreadyMessage: { ar: "لم نتمكن من العثور على اشتراك نشط لهذا الرابط.", en: "We could not find an active subscription for this link." },
    returnToWebsite: { ar: "العودة إلى الموقع", en: "Return to website" },
    campaignEyebrow: { ar: "تحديثات خاصة", en: "Bespoke Updates" },
    subscribedReason: { ar: "تصلك هذه الرسالة لأنك اشتركت في تحديثات فاشن غيت مول.", en: "You are receiving this email because you subscribed on Fashion Gate Mall." },
    adminTokenSubject: { ar: "رمز الدخول إلى لوحة النشرة البريدية", en: "Fashion Gate Mall newsletter dashboard access token" },
    adminTokenTitle: { ar: "رمز الدخول الخاص بك", en: "Your Access Token" },
    adminTokenBody: { ar: "تنتهي صلاحية هذا الرمز خلال 10 دقائق. استخدمه فقط إذا طلبت الدخول إلى لوحة النشرة البريدية.", en: "This token expires in 10 minutes. Paste it in the newsletter dashboard only if you requested access." },
    contactSupportSubject: { ar: "استفسار جديد من الموقع", en: "New Website Enquiry - Fashion Gate Mall" },
    contactSupportTitle: { ar: "استفسار جديد من الموقع", en: "New website enquiry" },
    contactSupportIntro: { ar: "تم إرسال طلب تواصل جديد عبر موقع فاشن غيت مول.", en: "A new contact request has been submitted through the Fashion Gate Mall website." },
    contactCustomerSubject: { ar: "تم استلام رسالتك", en: "We received your message" },
    contactCustomerIntro: { ar: "وصلت رسالتك إلى فاشن غيت مول. سيقوم فريق خدمة العملاء بمراجعتها والرد عليك قريباً.", en: "Your message has reached Fashion Gate Mall. Our client services team will review it and get back to you shortly." },
    contactCustomerBody: { ar: "نقدّر تواصلك معنا. سيتابع أحد أعضاء فريقنا معك في أقرب وقت ممكن.", en: "We appreciate you taking the time to contact us. A member of our team will follow up with you as soon as possible." },
    contactAckFooter: { ar: "هذه رسالة تأكيد تلقائية من فاشن غيت مول.", en: "This is an automated acknowledgement from Fashion Gate Mall." },
    contactReplyFooter: { ar: "يمكنك الرد على هذه الرسالة للتواصل مباشرة مع العميل.", en: "Reply to this email to respond directly to the customer." },
    dashboardEyebrow: { ar: "فاشن غيت مول", en: "Fashion Gate Mall" },
    dashboardTitle: { ar: "لوحة النشرة البريدية", en: "Newsletter Dashboard" },
    dashboardIntro: { ar: "أنشئ تحديثات أنيقة، أرسل بريداً تجريبياً للمراجعة، ثم أرسل الحملة للمشتركين فقط.", en: "Create polished updates, send a test email for approval, then send the campaign to subscribed users only." },
    dashboardLibraryTitle: { ar: "مكتبة الحملات", en: "Campaign Library" },
    dashboardLibraryIntro: { ar: "اختر مسودة محفوظة أو حملة مرسلة.", en: "Select a saved draft or sent campaign." },
    dashboardEditorTitle: { ar: "محرر الحملة", en: "Campaign Editor" },
    dashboardCreatingDraft: { ar: "إنشاء مسودة جديدة", en: "Creating new draft" },
    dashboardEditingDraft: { ar: "تعديل مسودة محفوظة", en: "Editing saved draft" },
    dashboardNewDraft: { ar: "مسودة جديدة", en: "New Draft" },
    dashboardDraftsTab: { ar: "المسودات", en: "Drafts" },
    dashboardSentTab: { ar: "المرسلة", en: "Sent" },
  });

  console.log("Newsletter settings seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
