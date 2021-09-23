// https://teenyicons.com/

import React from "react";
import { Hello } from "./Hello";
import S from "@sanity/desk-tool/structure-builder";

import { Icon } from "@iconify/react";
import archive from "@iconify/icons-teenyicons/archive-outline";
import eyeClosed from "@iconify/icons-teenyicons/eye-closed-outline";
import eye from "@iconify/icons-teenyicons/eye-outline";
import tag from "@iconify/icons-teenyicons/tag-outline";
import cog from "@iconify/icons-teenyicons/cog-outline";
import gift from "@iconify/icons-teenyicons/gift-outline";
import gif from "@iconify/icons-teenyicons/gif-outline";
import image from "@iconify/icons-teenyicons/image-outline";
import gridLayout from "@iconify/icons-teenyicons/grid-layout-outline";
import edit from "@iconify/icons-teenyicons/edit-outline";
import upload from "@iconify/icons-teenyicons/upload-outline";

import YAMLDocument from "sanity-plugin-yaml-document";

const AssetPreview = ({ document }) => {
  const { displayed } = document;
  return (
    displayed.url && (
      <div style={{ padding: "1em" }}>
        <img src={`${displayed.url}?w=600`} style={{ maxWidth: "100%" }} />
      </div>
    )
  );
};
const AssetDoc = (assetId) =>
  S.document()
    .documentId(assetId)
    .views([
      S.view.component(AssetPreview).title("Image preview"),
      S.view.form().title("Meta-information"),
    ]);

export default () =>
  S.list()
    .title("Content")
    .items([
      // projects
      S.listItem()
        .title("Projects")
        .icon(() => <Icon icon={archive} width={15} height={15} />)
        .child(
          S.list()
            .title("Projects")
            .items([
              // filter visible projects
              S.listItem()
                .title("Visible projects")
                .icon(() => <Icon icon={eye} width={15} height={15} />)
                .schemaType("project")
                .child((id) =>
                  S.documentList()
                    .title("Visible Projects")
                    .filter('_type == "project" && visible == true')
                ),

              // filter hidden projects
              S.listItem()
                .title("Hidden projects")
                .icon(() => <Icon icon={eyeClosed} width={15} height={15} />)
                .schemaType("project")
                .child((id) =>
                  S.documentList()
                    .title("Hidden Projects")
                    .filter('_type == "project" && visible == false')

                    .initialValueTemplates([
                      S.initialValueTemplateItem("project-hidden", {}),
                    ])
                ),

              // authors
              S.listItem()
                .title("Authors")
                .schemaType("author")
                .child(S.documentTypeList("author").title("Authors")),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["siteSettings", "author", "project", "assetTag"].includes(
            listItem.getId()
          )
      ),
      S.divider(),

      // custom hello component
      S.listItem()
        .title("Hello")
        .icon(() => <Icon icon={gift} width={15} height={15} />)
        .child((id) =>
          S.document()
            .schemaType("void")
            .title("hellooo")
            .views([S.view.component(() => <Hello />).title("Hello")])
        ),
      S.divider(),

      S.listItem()
        .title("Media")
        .icon(() => <Icon icon={gridLayout} width={15} height={15} />)
        .child(
          S.list()
            .title("Assets")
            .items([
              S.listItem()
                .title("Tags")
                .icon(() => <Icon icon={tag} width={15} height={15} />)
                .child(S.documentTypeList("assetTag")),

              S.listItem()
                .title("All images")
                .icon(() => <Icon icon={image} width={15} height={15} />)
                .child(S.documentTypeList("sanity.imageAsset").child(AssetDoc)),

              // List images with width over 1000px
              S.listItem()
                .title("Large images (1000px+)")
                .icon(() => <Icon icon={image} width={15} height={15} />)
                .child(
                  S.documentList()
                    .title("Large images")
                    .filter(
                      '_type == "sanity.imageAsset" && metadata.dimensions.width > 1000'
                    )
                    .child(AssetDoc)
                ),
              // List images with the file extension of “gif”
              S.listItem()
                .title("GIFs")
                .icon(() => <Icon icon={gif} width={15} height={15} />)
                .child(
                  S.documentList()
                    .title("GIFs")
                    .filter(
                      '_type == "sanity.imageAsset" && extension == "gif"'
                    )
                    .child(AssetDoc)
                ),
              // List images that has been uploaded with the unsplash asset selector
              S.listItem()
                .title("From Unsplash")
                .icon(() => <Icon icon={image} width={15} height={15} />)
                .child(
                  S.documentList()
                    .title("From Unsplash")
                    .filter(
                      '_type == "sanity.imageAsset" && source.name == "unsplash"'
                    )
                    .child(AssetDoc)
                ),
            ])
        ),

      S.divider(),

      // site settings
      S.listItem()
        .title("Settings")
        .icon(() => <Icon icon={cog} width={15} height={15} />)
        .child(
          S.editor()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .views([
              S.view.form(),

              // add custom preview
              S.view
                .component(({ document }) => (
                  <Hello color={document.displayed.color} />
                ))
                .title("Preview"),
            ])
        ),
    ]);

export const getDefaultDocumentNode = ({ schemaType }) => {
  console.log(schemaType);
  if (schemaType === "beep") {
    return S.document().views([
      S.view.form().icon(() => <Icon icon={edit} width={11} height={11} />),
      S.view
        // .component((props) => {
        //   const El = YAMLDocument.component;
        //   return <El definition={{ hello: 1 }} {...props} />;
        // })
        .component((props) => <YAMLDocument definition="faa" {...props} />)
        .title("Import YAML")
        .icon(() => <Icon icon={upload} width={11} height={11} />),
    ]);
  }

  return S.document().views([
    S.view.form().icon(() => <Icon icon={edit} width={11} height={11} />),
  ]);
};
