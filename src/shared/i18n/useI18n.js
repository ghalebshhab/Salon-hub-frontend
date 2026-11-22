import { useContext } from "react";
import { I18nContext } from "./i18nContext.js";

/** `const { t, language, setLanguage, dir } = useI18n();` */
export default function useI18n() {
  return useContext(I18nContext);
}
