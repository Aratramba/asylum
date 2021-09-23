export const row = {
  name: "dataTable.row",
  title: "Row",
  type: "object",
  fields: [
    {
      name: "columns",
      title: "Columns",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    },
  ],
  preview: {
    select: {
      columns: "columns",
    },
    prepare({ columns }) {
      return {
        title: columns.join(" | "),
      };
    },
  },
};
export const dataTable = {
  name: "dataTable",
  title: "Data table",
  type: "object",
  fields: [
    {
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          type: "dataTable.row",
        },
      ],
    },
    {
      name: "firstRowHeaders",
      type: "boolean",
      title: "First row are headers",
      description:
        "Check this if the first row describes what data is in the column.",
    },
    {
      name: "firstColumnHeaders",
      type: "boolean",
      title: "First column are headers",
      description:
        "Check this if the first column describes what data is in the row.",
    },
  ],
  preview: {
    select: {
      rows: "rows",
      firstColumnHeaders: "firstColumnHeaders",
      firstRowHeaders: "firstRowHeaders",
    },
    component: Preview,
  },
};

const Preview = () => <div>table</div>;
