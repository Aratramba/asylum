import React from "react";
import { Icon } from "@iconify/react";
import archive from "@iconify/icons-teenyicons/archive-outline";

export default {
  name: "project",
  type: "document",
  title: "Project",
  icon: () => <Icon icon={archive} width={15} height={15} />,
  fieldsets: [
    {
      name: "media",
      title: "Media",
      options: { collapsed: true, collapsible: true },
    },
    {
      name: "contact",
      title: "Contact",
      options: { collapsed: true, collapsible: true },
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titel",
    },
    {
      name: "authors",
      title: "authors",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "author",
              preview: {
                select: {
                  title: "author.color",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "content",
      title: "content",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "beep",
            },
          ],
        },
      ],
    },
    {
      name: "referenceCountry",
      title: "Reference Country",
      type: "reference",
      to: [{ type: "country" }],
    },
    {
      name: "referencePage",
      title: "Reference Page",
      type: "reference",
      to: [{ type: "page" }],
    },
    {
      name: "referenceAuthorPage",
      title: "Reference Author/Page",
      type: "reference",
      to: [{ type: "page" }, { type: "author" }],
    },
    {
      name: "socialIcons",
      title: "Sosiale medier lenker",
      type: "array",
      of: [{ type: "socialIcon" }],
      fieldset: "media",
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        source: (doc) => `${doc.title}`,
      },
    },
    {
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "visible",
      type: "boolean",
    },
    {
      name: "body",
      type: "richtext",
      title: "Body",
    },
    {
      name: "heroImage",
      type: "figure",
      title: "Hero Image",
      fieldset: "media",
    },
    {
      name: "gallery",
      type: "gallery",
      title: "Slideshow",
      fieldset: "media",
    },
    {
      name: "instagramLink",
      type: "url",
      title: "Instagram Link",
      fieldset: "contact",
    },
    {
      name: "location",
      type: "geopoint",
      title: "Location",
      fieldset: "contact",
    },
    {
      name: "address",
      type: "address",
      title: "Adress",
      fieldset: "contact",
    },
  ],
  initialValue: {
    visible: true,
  },
  preview: {
    select: {
      title: "title",
      subtitle: "author.name",
      media: "heroImage.image",
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: `By ${selection.subtitle}`,
      };
    },
  },
};
