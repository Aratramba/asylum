import React from "react";
import { Icon } from "@iconify/react";
import users from "@iconify/icons-teenyicons/users-outline";

export default {
  name: "author",
  type: "document",
  title: "Author",
  icon: () => <Icon icon={users} width={15} height={15} />,
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "imagesGallery",
      title: "Images gallery",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "color",
      type: "color",
      title: "Choose color",
    },
    {
      name: "bio",
      type: "richtext",
      title: "Bio",
    },
    {
      name: "avatar",
      type: "figure",
      title: "Avatar",
    },
    {
      name: "linkedinLink",
      type: "url",
      title: "Linkedin Link",
    },
  ],
  preview: {
    select: {
      title: "name",
      color: "color.hex",
    },
    prepare({ title, color = "#fff" }) {
      return {
        title,
      };
    },
  },
  orderings: [
    {
      title: "Name (A-Z)",
      name: "NameDesc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Name (Z-A)",
      name: "NameAsc",
      by: [{ field: "name", direction: "desc" }],
    },
  ],
};
