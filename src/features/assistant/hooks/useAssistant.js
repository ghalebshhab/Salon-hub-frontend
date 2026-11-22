import { useContext } from "react";
import AssistantContext from "../providers/assistantContext.js";
import t from "../../../shared/i18n/t.js";

export default function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error(t("useAssistant must be used inside AssistantProvider"));
  }
  return context;
}
