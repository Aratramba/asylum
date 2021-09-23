import { useEffect, useState, useRef } from "react";
import { withDocument } from "part:@sanity/form-builder";
import client from "part:@sanity/base/client";
import cx from "classnames";
import Papa from "papaparse";
import React from "react";
import schema from "part:@sanity/base/schema";
import styles from "./Field.module.css";
import ConfirmDialog from "part:@sanity/components/dialogs/confirm";

export const ImportField = withDocument((sanityDocument) => {
  const [error, setError] = useState(null);
  const [state, setState] = useState("default");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [mutations, setMutations] = useState(null);

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
      newDoc[key] = value;
    });

    console.log(sanityDocument.document);
    return newDoc;
  }

  function validate(obj, fields, onError) {
    let errors = [];

    fields.forEach((field) => {
      if (!obj[field]) return errors.push(`Missing field ${field}.`);
      // todo: schema validation here?
      // const typeName = getSanityFieldType(sanityDocument.document._type, field);
      //   schema
      // .get(sanityDocument.document._type)
      // .fields.filter((field) => field.name === fieldName)[0]?.type;
    });

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

    setMutations(
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          {
            old: sanityDocument.document[k],
            new: v,
          },
        ])
      )
    );

    setConfirmOpen(true);

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
    setTransaction(clientTransaction);
  }

  function onConfirmCancel() {
    setConfirmOpen(false);
    setMutations(null);
    setState("default");
  }

  function onConfirm() {
    setState("loading");
    transaction
      .commit()
      .then((updatedDocument) => {
        console.log(updatedDocument);
        setMutations(null);
        setState("success");
        setConfirmOpen(false);
      })
      .catch((err) => {
        setError(err.message);
        setState("error");
        setConfirmOpen(false);
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
      {confirmOpen && (
        <ConfirmDialog
          cancelButtonText="Cancel"
          cancelColor="primary"
          color="primary"
          confirmButtonText="I'm sure"
          confirmColor="success"
          onCancel={onConfirmCancel}
          onConfirm={onConfirm}
          title="Are you sure?"
        >
          <p>
            This will overwrite existing data and remove any missing content.
            This will not publish the document and you can still restore an
            older version.
          </p>
          {mutations && (
            <table className={styles.mutationsTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>old</th>
                  <th className={styles.spacer}></th>
                  <th>new</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mutations).map(([key, value]) => (
                  <tr key={key}>
                    <th className={styles.fieldName}>{key}</th>
                    <td className={styles.oldValue}>{value.old}</td>
                    <td className={styles.spacer}>→</td>
                    <td className={styles.newValue}>{value.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ConfirmDialog>
      )}
      <div
        className={cx(styles.area, styles.import, { [styles[state]]: state })}
        onDrop={onReceive}
        onPaste={onReceive}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onClick={() => setState("default")}
      >
        {(state === "default" || state === "hovering") && (
          <p>
            Drag CSV-file or paste a table from Excel/Numbers here to upload
          </p>
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
