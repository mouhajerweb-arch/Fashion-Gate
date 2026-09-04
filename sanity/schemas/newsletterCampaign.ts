import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export const newsletterCampaign = defineType({
  name: "newsletterCampaign",
  title: "Newsletter Campaign",
  type: "document",
  icon: Newspaper,
  fields: [
    defineField({ name: "title", title: "Internal Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subject", title: "Email Subject", type: "string", validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: "previewText", title: "Preview Text", type: "text", rows: 2, validation: (Rule) => Rule.max(180) }),
    defineField({ name: "titleLocalized", title: "Email Title", type: "localizedString" }),
    defineField({ name: "subjectLocalized", title: "Email Subject", type: "localizedString" }),
    defineField({ name: "previewTextLocalized", title: "Preview Text", type: "localizedText" }),
    defineField({ name: "bodyAr", title: "Arabic Email Body", type: "text", rows: 8 }),
    defineField({ name: "bodyEn", title: "English Email Body", type: "text", rows: 8 }),
    defineField({ name: "ctaLabelLocalized", title: "CTA Label", type: "localizedString" }),
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Sending", value: "sending" },
          { title: "Sent", value: "sent" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Email Body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({ name: "ctaUrl", title: "CTA URL", type: "url" }),
    defineField({ name: "scheduledFor", title: "Scheduled For", type: "datetime" }),
    defineField({ name: "sentAt", title: "Sent At", type: "datetime", readOnly: true }),
    defineField({ name: "sentCount", title: "Sent Count", type: "number", readOnly: true }),
    defineField({ name: "failedCount", title: "Failed Count", type: "number", readOnly: true }),
    defineField({
      name: "deliveryLog",
      title: "Delivery Log",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "email", title: "Email", type: "string" }),
            defineField({ name: "resendId", title: "Resend Email ID", type: "string" }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Accepted", value: "accepted" },
                  { title: "Failed", value: "failed" },
                ],
              },
            }),
            defineField({ name: "reason", title: "Failure Reason", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subject", media: "heroImage" },
  },
});
