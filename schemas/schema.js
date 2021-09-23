import createSchema from "part:@sanity/base/schema-creator";

import schemaTypes from "all:part:@sanity/base/schema-type";
import project from "./project";
import { dataTable, row } from "./dataTable";
import address from "./address";
import assetGallery from "./assetGallery";
import assetTag from "./assetTag";
import author from "./author";
import color from "./color";
import country from "./country";
import figure from "./figure";
import gallery from "./gallery";
import math from "./math";
import nothing from "./void";
import page from "./page";
import richtext from "./richtext";
import richTextOnlyLink from "./richTextOnlyLink";
import siteSettings from "./siteSettings";
import socialIcon from "./socialIcon";
import beep from "./beep";
import youtube from "./youtube";
import videoId from "./videoId";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    address,
    assetGallery,
    assetTag,
    author,
    color,
    country,
    dataTable,
    figure,
    gallery,
    math,
    nothing,
    page,
    project,
    richtext,
    richTextOnlyLink,
    row,
    siteSettings,
    socialIcon,
    beep,
    youtube,
    videoId,
  ]),
});
