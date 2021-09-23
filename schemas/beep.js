import { createHeading } from "../custom/helpers";
import MyCustomString from "../custom/MyCustomString";
import { stringHelper, slugHelper } from "sanity-plugin-yaml-document";

export default {
  name: "beep",
  type: "document",
  title: "Beep",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      validation: (Rule) => Rule.required(),

    },
    createHeading("Video"),
    {
      title: "Video",
      name: "video",
      type: "videoId",
      description: "https://www.youtube.com/watch?v=F5pgG1M_h_U",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "gallery",
      description: "Video gallery",
      title: "Gallery",
      type: "array",
      options: {
        // layout: "grid",
      },
      of: [{ type: "videoId" }],
    },
        { type: 'text', name: 'text'},
    {
      name: 'myObject',
      type: 'object',
      fields: [
        { type: 'string', name: 'title'},
        { type: 'text', name: 'text'},
        { type: 'object', name: 'myObject', fields: [
          { type: 'string', name: 'title'},
          { type: 'text', name: 'text'},
        ]},
      ]
    },
    {
      name: "customStrings",
      description: "My custom strings",
      title: "Custom strings",
      type: "array",
      options: {
        // layout: "grid",
      },
      of: [
        {
          type: "object",
          fields: [
            {
              name: "myString",
              type: "string",
              inputComponent: MyCustomString,
            },
          ],
        },
      ],
    },
  ],
};
