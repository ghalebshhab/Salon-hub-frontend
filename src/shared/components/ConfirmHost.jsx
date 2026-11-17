import { useSyncExternalStore } from "react";
import ConfirmDialog from "./ConfirmDialog.jsx";
import {
  getConfirmSnapshot,
  subscribeConfirm,
} from "../confirm/confirmStore.js";

/** Mounted once in App; shows the dialog that confirmAction() asks for. */
export default function ConfirmHost() {
  const request = useSyncExternalStore(
    subscribeConfirm,
    getConfirmSnapshot,
    getConfirmSnapshot,
  );
  if (!request) return null;
  const { options, resolve } = request;

  return (
    <ConfirmDialog
      open
      {...options}
      onConfirm={(text) => resolve(options.input ? text : true)}
      onCancel={() => resolve(options.input ? null : false)}
    />
  );
}
