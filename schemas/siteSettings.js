import React from "react";
import { Icon } from "@iconify/react";
import cog from "@iconify/icons-teenyicons/cog-outline";

export default {
  name: "siteSettings",
  type: "document",
  title: "Settings",
  icon: () => <Icon icon={cog} width={15} height={15} />,
  fields: [
    {
      name: "color",
      type: "string",
      title: "Color",
    },
    {
      name: "setting1",
      type: "string",
      title: "Setting 1",
    },
    {
      name: "setting2",
      type: "string",
      title: "Setting 2",
    },
    {
      name: "setting3",
      type: "string",
      title: "Setting 3",
    },
  ],
  initialValue: {
    color: "#f43545",
  },
};
