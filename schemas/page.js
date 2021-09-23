import React from "react";
import { Icon } from "@iconify/react";
import file from "@iconify/icons-teenyicons/file-outline";

export default {
  name: "page",
  type: "document",
  title: "Page",
  icon: () => <Icon icon={file} width={15} height={15} />,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titel",
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => `${doc.title}`,
      },
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
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug",
      media: "heroImage.image",
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: `/${selection.subtitle.current}/`,
      };
    },
  },
};
