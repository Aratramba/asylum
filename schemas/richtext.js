import React from "react";

const highlightRender = (props) => (
  <span style={{ backgroundColor: "yellow" }}>{props.children}</span>
);

export default {
  name: "richtext",
  type: "array",
  title: "richtext",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
      ],
      marks: {
        annotations: [
          {
            name: "customListStart",
            title: "Custom List start",
            blockEditor: {
              icon: (x) => "N",
            },
            type: "object",
            fields: [
              {
                name: "start",
                title: "Start number",
                type: "number",
              },
            ],
          },
        ],
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          {
            title: "Highlight",
            value: "highlight",
            blockEditor: {
              icon: () => "H",
              render: highlightRender,
            },
          },
        ],
      },
    },
    {
      type: "figure",
    },
    {
      type: "object",
      name: "something",
      fields: [{ type: "richTextOnlyLink", name: "richtextOnlyLink" }],
    },
    {
      type: "youtube",
    },
    {
      type: "dataTable",
    },
    {
      type: "math",
    },
  ],
};
