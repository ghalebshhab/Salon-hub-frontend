import { Fragment, useCallback, useMemo, useState } from "react";
import { I18nContext, translate } from "./i18nContext.js";
import { applyLanguage, getInitialLanguage, languageInfo } from "./language.js";

/**
 * Gives every screen the current language and `t()`. When the language
 * changes, the app is drawn again (the key changes), so text from the plain
 * `t()` function updates too.
 */
export default function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback(
    (code) => {
      if (code === language) return;
      setLanguageState(applyLanguage(code));
      // Some text is prepared once when the app loads (menus, labels, server
      // messages), so load the page again to show all of it in the new language.
      window.location.reload();
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      dir: languageInfo(language).dir,
      setLanguage,
      t: (text, values) => translate(language, text, values),
    }),
    [language, setLanguage],
  );

  return (
    <I18nContext.Provider value={value}>
      <Fragment key={language}>{children}</Fragment>
    </I18nContext.Provider>
  );
}
