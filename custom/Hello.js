import React from "react";
import Snackbar from "part:@sanity/components/snackbar/item";
import DefaultDialog from "part:@sanity/components/dialogs/default";
import DialogContent from "part:@sanity/components/dialogs/content";

import styles from "./Hello.module.css";

import { Icon } from "@iconify/react";
import gift from "@iconify/icons-teenyicons/gift-outline";

export const Hello = ({ color }) => {
  return (
    <div className={styles.hello} style={{ background: color }}>
      Welcome to the Asylum! <Icon icon={gift} />
      <Snackbar
        kind="success"
        title="hello"
        subtitle="subtitle"
        icon={false}
        isCloseable={false}
        action={() => {}}
        id="boo"
        isOpen={true}
        onSetHeight={() => {}}
        onDismiss={() => {}}
      >
        text
      </Snackbar>
      <DefaultDialog
        title="hello"
        color="info"
        showCloseButton="true"
        onEscape={() => console.log("escape")}
        onClose={() => console.log("close")}
        onAction={() => console.log("action")}
        actions={[{ index: 1, title: "Beep", color: "primary" }]}
      >
        <DialogContent size="medium" padding="medium">
          <h1>Hello</h1>
          <p>hello</p>
        </DialogContent>
      </DefaultDialog>
    </div>
  );
};
