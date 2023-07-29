import { I18nManager } from "react-native";
import I18n, { TranslateOptions, Scope } from "i18n-js";
import moment from "moment";

type translationOptions = {
  [key: string]: any;
};

const translations: translationOptions = {
  en: require("../translations/en.json"),
  zh: require("../translations/zh.json"),
};

export const t = (key: Scope, config?: TranslateOptions) => I18n.t(key, config);

export const setI18nConfig = (userLang?: string): void => {
  // fallback if no available language fits
  const config = { languageTag: "zh", isRTL: false };

  const lang = config.languageTag;
  const isRTL = config.isRTL;

  // update layout direction
  I18nManager.forceRTL(isRTL);

  // i18n-js config
  I18n.translations = { [lang]: translations[lang] };
  I18n.defaultLocale = "zh";
  I18n.locale = "zh";
  I18n.missingBehaviour = "guess";

  require("moment/locale/zh-hk");
  moment.locale("zh-hk");
};

export default I18n;
