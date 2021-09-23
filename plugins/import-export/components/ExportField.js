import { useEffect, useState, useRef } from "react";
import { withDocument } from "part:@sanity/form-builder";
import cx from "classnames";
import Papa from "papaparse";
import React from "react";
import styles from "./Field.module.css";

export const ExportField = withDocument((sanityDocument) => {
  const [state, setState] = useState("default");
  const ref = useRef();

  function onCopy(e) {
    var csv = Papa.unparse({
      fields: sanityDocument.type.options.fields,
      data: sanityDocument.type.options.fields.map((field) => {
        const sanityField = sanityDocument.document[field];
        const values = Array.isArray(sanityField) ? sanityField : [sanityField];
        return [field, ...values];
      }),
    });

    e.clipboardData.setData("text/plain", csv);
    setState("success");
    e.preventDefault();
  }

  function onClick(e) {
    setState("hovering");
  }

  function onClickOutside(e) {
    if (e.target === document.activeElement) return;
    setState("default");
  }

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={cx(styles.area, styles.export, { [styles[state]]: state })}
      onCopy={onCopy}
      onCut={onCopy}
      onClick={onClick}
    >
      {(state === "default" || state === "hovering") && (
        <p>Export CSV table by copying this field.</p>
      )}
      {state === "success" && <p>Copied CSV table to clipboard</p>}
    </div>
  );
});
