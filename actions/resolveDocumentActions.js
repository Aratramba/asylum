import defaultResolve from "part:@sanity/base/document-actions";
import { PublishAction } from "part:@sanity/base/document-actions";
import { CustomPublishAction } from "./CustomPublishAction";
import { duplicateAction } from "./duplicateAction";

export default function resolveDocumentActions(props) {
  // use custom slugs check for pages and landingpages
  if (props.type === "beep") {
    return defaultResolve(props).map((Action) =>
      Action === PublishAction ? CustomPublishAction : Action
    );
  }

  return [duplicateAction, ...defaultResolve(props)];
}
