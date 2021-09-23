export default {
  title: "Asset Tags",
  name: "assetTag",
  type: "document",
  fields: [
    { name: "label", type: "string", title: "Label" },
    {
      name: "images",
      type: "assetGallery",
      title: "images",
    },
  ],
};
