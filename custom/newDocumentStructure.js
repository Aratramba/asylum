import S from "@sanity/base/structure-builder";

export default [
  ...S.defaultInitialValueTemplateItems().filter(
    (item) => !["siteSettings", "project-hidden"].includes(item.spec.id)
  ),
];
