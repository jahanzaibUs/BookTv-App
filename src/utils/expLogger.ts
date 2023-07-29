/**
 * track exp activity
 */

import { setItem, getItem } from "@utils/storage";
import { postExpEvent } from "@actions/questAction";
import { store } from "../store";

export const EXP = {
  LOGIN: 1,
  COMPLETE: 2,
  SHARE: 3,
  FACEBOOK: 4,
  INSTAGRAM: 5,
  YOUTUBE: 6,
  EVENT: 7,
  INVITE_EVENT: 8,
};

export const logEvent = async (source: number, lesson?: number | string) => {
  const token = await getItem("jwt");
  if (!token) {
    return false;
  }
  // @ts-ignore
  const { success } = await store.dispatch(postExpEvent([{ source, lesson }]));

  return success;
};
