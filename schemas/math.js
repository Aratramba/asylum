import React from "react";
import { useState, useMemo } from "react";
// import { MdFunctions } from 'react-icons/md';
// import KaTeX from 'katex';
// import 'katex/dist/katex.min.css?raw';

const Input = (props) => {
  console.log(props);
  return <span>Test</span>;
};

const Preview = ({ value, layout }) => {
  console.log(value, layout);
  return <LatexRender latex={value.body} isInline={layout === "inline"} />;
};

const LatexRender = ({ isInline = false, latex = "" }) => {
  const [html, setHtml] = useState("");
  useMemo(() => {
    setHtml(
      // KaTeX.renderToString(latex, {
      //   displayMode: !isInline,
      //   throwOnError: false,
      // })
      latex
    );
  }, [latex, isInline]);
  return isInline ? (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default {
  title: "Math",
  name: "math",
  type: "object",
  // icon: MdFunctions,
  fields: [
    {
      type: "text",
      name: "body",
    },
  ],
  inputComponent: Input,
  preview: {
    select: {
      body: "body",
    },
    component: Preview,
  },
};
