import { VideoIdField } from "../custom/VideoComponent";
import React from "react";

export default {
  type: "object",
  name: "videoId",
  title: "Video ID",
  inputComponent: VideoIdField,
  fields: [
    {
      type: "string",
      name: "url",
      title: "Video URL",
      description: "A URL to a vimeo or youtube video",
    },
    {
      type: "string",
      name: "id",
      title: "Video ID",
      description: "Auto generated",
      readOnly: true,
    },
    {
      type: "string",
      name: "service",
      title: "Service",
      description: "Auto generated",
      readOnly: true,
    },
    {
      type: "string",
      name: "thumbnail",
      title: "Thumbnail",
      description: "Auto generated",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      id: "id",
      service: "service",
      thumbnail: "thumbnail",
    },
    prepare({ service = "", thumbnail }) {
      return {
        title: `video ${service}`,
        media: () => (thumbnail ? <img src={thumbnail} /> : null),
      };
    },
  },
};
