import { useState, useEffect } from "react";
import { useDocumentOperation } from "@sanity/react-hooks";

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export function HeyYouChangedTheSlugAction({
  id,
  type,
  published,
  draft,
  onComplete,
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const { patch, publish } = useDocumentOperation(id, type);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    if (isPublishing && !draft) {
      setIsPublishing(false);
    }
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    if (!draft.title) return;
    if (published?.slug.current) return;
    setSlug(slugify(draft.title));
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    patch.execute([{ set: { slug: { ["current"]: slug } } }]);
  }, [slug]);

  return {
    disabled: publish.disabled,
    label: isPublishing ? "Publishing…" : "Publish",
    disabled: publish.disabled,
    label: "Publish",
    onHandle: () => {
      if (published && draft.slug.current !== published?.slug.current) {
        setDialogOpen(true);
      } else {
        publish.execute();
        onComplete();
      }
    },
    dialog: dialogOpen && {
      type: "confirm",
      onCancel: () => {
        onComplete();
      },
      onConfirm: () => {
        publish.execute();
        onComplete();
      },
      message:
        "Hey you changed the slug. You sure? ¡This will break the internet!",
    },
  };
}
