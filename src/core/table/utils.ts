import { DEFAULT_PADDING, MD_FONT_SIZE } from "./constants";
import type { RelationType } from "./types";

export const computeConnectionSymbolPoints = (
  relationType: RelationType,
  rightSide: boolean,
  x: number,
  y: number
): number[] => {
  return relationType === "1"
    ? [
        x + (rightSide ? MD_FONT_SIZE : -MD_FONT_SIZE),
        y - 5,
        x + (rightSide ? MD_FONT_SIZE : -MD_FONT_SIZE),
        y + 5,
      ]
    : [
        x,
        y - 5,
        x + (rightSide ? DEFAULT_PADDING : -DEFAULT_PADDING) * 2,
        y,
        x,
        y + 5,
      ];
};
