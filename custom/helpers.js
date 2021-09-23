import React from "react";

export function createHeading(title) {
  return {
    inputComponent: (field) => (
      <div
        style={{
          borderBottom: "1px solid rgba(0,0,0,.1)",
          fontSize: "2rem",
          marginTop: "1em",
        }}
      >
        {field.type.title}
      </div>
    ),
    name: `heading${title
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")}`,
    title,
    type: "string",
  };
}
