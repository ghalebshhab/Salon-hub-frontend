import { useContext } from "react";
import AuthContext from "./authContext.js";
import t from "../i18n/t.js";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error(t("useAuth must be used inside AuthProvider"));
  return context;
}
