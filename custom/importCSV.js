import { useEffect, useState, useRef } from "react";
import { withDocument } from "part:@sanity/form-builder";
import client from "part:@sanity/base/client";
import cx from "classnames";
import Papa from "papaparse";
import React from "react";
import schema from "part:@sanity/base/schema";
import styles from "./importCSV.module.css";

function getSanityFieldType(typeName, fieldName) {
  return schema
    .get(typeName)
    .fields.filter((field) => field.name === fieldName)[0]?.type;
}

export const importCSV = withDocument((sanityDocument) => {
  const [error, setError] = useState(null);
  const [state, setState] = useState("default");

  // TODO: check for field types here? Only allowed simple primitives and single level deep array of string/number

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState("hovering");
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState("default");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setState("hovering");
  };

  function onReceive(e) {
    e.preventDefault();
    setError(null);
    setState("loading");

    const transfer = e.clipboardData || e.dataTransfer;
    const item = transfer.items[0];
    if (item.kind === "file" && transfer.items.length > 1) {
      setError("Only upload 1 file");
      return;
    }

    if (item.kind === "file") {
      const file = transfer.items[0].getAsFile();
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        const obj = renderCsvToJson(atob(e.target.result.split("base64,")[1]));
        if (obj) importData(obj);
      });
      reader.readAsDataURL(file);
    } else {
      const obj = renderCsvToJson(transfer.getData("text/plain"));
      if (obj) importData(obj);
    }
  }

  function renderCsvToJson(csv) {
    const result = Papa.parse(csv, {
      dynamicTyping: true,
    });

    console.log(result);

    if (result.errors?.length) {
      console.log(result.errors);
      setError(result.errors[0].message);
      setState("default");
      return null;
    }

    const newDoc = {};
    result.data.map(([key, ...values]) => {
      if (key === null) return;
      values = values.filter(Boolean);
      let value =
        values.length === 0 ? null : values.length === 1 ? values[0] : values;

      // // typecast values to match schema?
      // const fieldType = getSanityFieldType(sanityDocument.document._type, key);
      // if (fieldType.name === "string") {
      //   value = String(value);
      // } else if (fieldType.name === "number") {
      //   value = Number(value);
      // } else if (fieldType.name === "array") {
      //   value = value.map((x) => {
      //     // cast array values here where possible?
      //     console.log(fieldType);
      //     if (fieldType.of.length === 1) {
      //       if (fieldType.of[0].type === "string") {
      //         return String(v);
      //       } else if (fieldType.of[0].type === "number") {
      //         return +v;
      //       }
      //     }
      //   });
      // }
      // add more types here?

      newDoc[key] = value;
    });

    console.log(sanityDocument.document);
    return newDoc;
  }

  function validate(obj, fields, onError) {
    console.log(obj);
    console.log(fields);
    let errors = [];

    fields.forEach((field) => {
      if (!obj[field]) errors.push(`Missing field ${field}.`);
    });

    // TODO: match schema with fields

    if (errors.length) {
      onError(errors.join("\n"));
      return false;
    }
    return true;
  }

  function importData(obj) {
    if (!validate(obj, sanityDocument.type.options.fields, setError)) {
      setState("default");
      return;
    }

    // TODO: open modal with confirm before this?

    const clientTransaction = client.transaction();
    clientTransaction.patch(sanityDocument.document._id, (doc) =>
      doc
        .set(
          Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null))
        )
        .unset(
          Object.entries(obj)
            .filter(([k, v]) => v === null)
            .map(([k, v]) => k)
        )
    );

    clientTransaction
      .commit()
      .then((updatedDocument) => {
        console.log(updatedDocument);
        setState("success");
      })
      .catch((err) => {
        setError(err.message);
        setState("error");
      });
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
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        className={cx(styles.area, { [styles[state]]: state })}
        onDrop={onReceive}
        onPaste={onReceive}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onClick={() => setState("default")}
      >
        {(state === "default" || state === "hovering") && (
          <p>Drag csv-file or paste from Excel/Numbers here to upload</p>
        )}

        {state === "success" && <p>Successfully imported document</p>}

        {state === "loading" && (
          <svg version="1.1" viewBox="0 0 100 100">
            <circle fill="#000" stroke="none" cx="6" cy="50" r="6">
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 15 ; 0 -15; 0 15"
                repeatCount="indefinite"
                begin="0.1"
              ></animateTransform>
            </circle>
            <circle fill="#000" stroke="none" cx="30" cy="50" r="6">
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 10 ; 0 -10; 0 10"
                repeatCount="indefinite"
                begin="0.2"
              ></animateTransform>
            </circle>
            <circle fill="#000" stroke="none" cx="54" cy="50" r="6">
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.3"
              ></animateTransform>
            </circle>
          </svg>
        )}
      </div>
    </div>
  );
});

export const exportCSV = withDocument((sanityDocument) => {
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
      className={cx(styles.area, { [styles[state]]: state })}
      onCopy={onCopy}
      onCut={onCopy}
      onClick={onClick}
    >
      {(state === "default" || state === "hovering") && (
        <p>Copy / drag csv file from here</p>
      )}
      {state === "success" && <p>Copied csv to clipboard</p>}
    </div>
  );
});
