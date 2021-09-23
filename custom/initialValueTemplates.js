import T from "@sanity/base/initial-value-template-builder";

export default [
  ...T.defaults(),

  T.template({
    id: "project-hidden",
    title: "Hidden project",
    schemaType: "project",
    value: {
      visible: false,
    },
  }),
];
