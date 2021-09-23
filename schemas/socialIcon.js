export default {
  name: "socialIcon",
  title: "Sosiale medier ikon med lenke",
  type: "object",
  fields: [
    { name: "url", title: "Url", type: "url" },
    {
      name: "icon",
      title: "Ikon",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "url",
      subtitle: "icon",
    },
  },
};
