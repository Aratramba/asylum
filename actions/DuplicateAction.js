import { useDocumentOperation } from "@sanity/react-hooks";
import { useState } from "react";
import client from "part:@sanity/base/client";
import { v4 as uuid } from "uuid";

export function duplicateAction({ id, type, draft, onComplete }) {
  const { duplicate } = useDocumentOperation(id, type);
  const [dialogOpen, setDialogOpen] = useState(false);

  return {
    label: "Custom publish",
    dialog: dialogOpen && {
      type: "popover",
      onClose: onComplete,
      content: "Duplicating…",
    },
    onHandle: async () => {
      setDialogOpen(true);
      const dupeId = uuid();
      duplicate.execute(dupeId);
      await client
        .patch(`drafts.${dupeId}`)
        .set({ name: "patched title" })
        .commit();
      onComplete();
    },
  };
}
