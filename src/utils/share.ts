import { Share } from "react-native";

import { BASE_URL } from "@constants/config";
import * as URL from "@constants/links";

type ShareOption = {
  message?: string;
  url?: string;
  referralCode?: string;
  giftCode?: string;
  lessonId?: string;
  eventId?: string;
  newsId?: string;
};

export const onShare = async (
  {
    message,
    url,
    referralCode,
    giftCode,
    lessonId,
    eventId,
    newsId,
  }: ShareOption,
  sharedCallback?: () => void
) => {
  const getShareUrl = () => {
    if (url) {
      return url;
    }
    if (lessonId) {
      return `${BASE_URL}/lesson/${lessonId}`;
    }
    if (eventId) {
      return `${BASE_URL}/event/${eventId}`;
    }
    if (newsId) {
      return `${BASE_URL}/newsletter/${newsId}`;
    }
    if (referralCode) {
      return `${BASE_URL}/invite?u=${referralCode}`;
    }
    if (giftCode) {
      return `${BASE_URL}/redeem?u=${giftCode}`;
    }
    return URL.HOMEPAGE;
  };

  const content = {
    message: message ? `${message} | 懶人讀書會` : "懶人讀書會",
    url: getShareUrl(),
  };

  try {
    const result = await Share.share(content);
    console.log(result);

    // TODO - Android always resolved as shared
    if (result.action === Share.sharedAction) {
      const socialRegex = /(signal)|(whatsapp)|(wechat)/i;

      if (result.activityType && socialRegex.test(result.activityType)) {
        if (sharedCallback) {
          sharedCallback();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
