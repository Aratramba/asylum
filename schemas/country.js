import { ExportField } from "../plugins/import-export/components/ExportField";
import { ImportField } from "../plugins/import-export/components/ImportField";

export default {
  title: "Country",
  name: "country",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name" },
    {
      name: "import",
      type: "string",
      title: "Import",
      inputComponent: ImportField,
      options: {
        fields: ["code", "counter", "list"],
      },
    },
    {
      name: "export",
      type: "string",
      title: "Export",
      inputComponent: ExportField,
      options: {
        fields: ["code", "counter", "list"],
      },
    },
    {
      name: "code",
      type: "string",
      title: "Country code",
      validation: (Rule) => Rule.required(),
    },
    { name: "counter", type: "number", title: "Counter" },
    {
      name: "list",
      type: "array",
      title: "List",
      of: [{ type: "string" }, { type: "number" }],
    },
  ],
};
