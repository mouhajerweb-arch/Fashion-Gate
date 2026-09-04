import { defineField, defineType } from "sanity";
import { MailCheck } from "lucide-react";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  icon: MailCheck,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Subscribed", value: "subscribed" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      initialValue: "subscribed",
    }),
    defineField({ name: "language", title: "Language", type: "string", options: { list: [{ title: "English", value: "en" }, { title: "Arabic", value: "ar" }] } }),
    defineField({ name: "source", title: "Source", type: "string" }),
    defineField({ name: "pageUrl", title: "Page URL", type: "url" }),
    defineField({ name: "unsubscribeToken", title: "Unsubscribe Token", type: "string", readOnly: true }),
    defineField({ name: "subscribedAt", title: "Subscribed At", type: "datetime" }),
    defineField({ name: "unsubscribedAt", title: "Unsubscribed At", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", status: "status", subscribedAt: "subscribedAt" },
    prepare({ title, status, subscribedAt }) {
      return {
        title: title || "Subscriber",
        subtitle: `${status || "subscribed"}${subscribedAt ? ` - ${new Date(subscribedAt).toLocaleDateString()}` : ""}`,
      };
    },
  },
});
