import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import SalonCoverEditor from "../../salons/components/SalonCoverEditor.jsx";
import { uploadSalonCoverApi, uploadSalonCoverFromDriveApi } from "../api/mediaApi.js";
import { showErrorToast, showSuccessToast } from "../../../shared/notifications/toast.jsx";

vi.mock("../api/mediaApi.js", () => ({
  uploadSalonCoverApi: vi.fn(),
  uploadSalonCoverFromDriveApi: vi.fn(),
}));
vi.mock("../../../shared/notifications/toast.jsx", () => ({
  showErrorToast: vi.fn(), showSuccessToast: vi.fn(), showWarningToast: vi.fn(),
}));

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

beforeEach(() => {
  vi.resetAllMocks();
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

function openEditor() {
  const onUploaded = vi.fn();
  const view = render(<SalonCoverEditor currentUrl="https://example.com/old.jpg" onUploaded={onUploaded} />);
  fireEvent.click(screen.getByRole("button", { name: "Change picture" }));
  return { ...view, onUploaded };
}

function chooseImage(container) {
  fireEvent.change(container.querySelector('input[type="file"]'), {
    target: { files: [new File(["image"], "cover.png", { type: "image/png" })] },
  });
}

it("shows transfer progress and waits for confirmed persistence before success", async () => {
  const pending = deferred();
  uploadSalonCoverApi.mockReturnValue(pending.promise);
  const { container, onUploaded } = openEditor();
  chooseImage(container);
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  const [, config] = uploadSalonCoverApi.mock.calls[0];
  expect(config.showLoading).toBe(false); // Keep the cancel button reachable.
  expect(screen.getByRole("button", { name: "Choose from device" }).matches(":disabled")).toBe(true);
  expect(screen.getByRole("button", { name: "Close picture editor" }).disabled).toBe(true);
  act(() => config.onUploadProgress({ loaded: 50, total: 100 }));
  expect(screen.getByRole("progressbar").value).toBe(50);
  act(() => config.onUploadProgress({ loaded: 100, total: 100 }));
  expect(screen.getByRole("status").textContent).toContain("Waiting for the server");
  expect(onUploaded).not.toHaveBeenCalled();
  await act(async () => pending.resolve({ success: true, data: { secureUrl: "https://example.com/new.jpg" } }));
  expect(onUploaded).toHaveBeenCalledWith("https://example.com/new.jpg");
  expect(showSuccessToast).toHaveBeenCalledTimes(1);
});

it("cancels the request and ignores a late success or progress event", async () => {
  const pending = deferred();
  uploadSalonCoverApi.mockReturnValue(pending.promise);
  const { container, onUploaded } = openEditor();
  chooseImage(container);
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  const [, config] = uploadSalonCoverApi.mock.calls[0];
  fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
  expect(config.signal.aborted).toBe(true);
  expect(screen.getByRole("status").textContent).toContain("server may still finish");
  await act(async () => {
    config.onUploadProgress({ loaded: 99, total: 100 });
    pending.resolve({ success: true, data: { secureUrl: "https://example.com/late.jpg" } });
  });
  expect(onUploaded).not.toHaveBeenCalled();
  expect(showSuccessToast).not.toHaveBeenCalled();
  expect(showErrorToast).not.toHaveBeenCalled();
  expect(screen.queryByRole("progressbar")).toBeNull();
});

it("aborts on navigation and suppresses errors after unmount", async () => {
  const pending = deferred();
  uploadSalonCoverApi.mockReturnValue(pending.promise);
  const { container, unmount } = openEditor();
  chooseImage(container);
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  const [, config] = uploadSalonCoverApi.mock.calls[0];
  unmount();
  expect(config.signal.aborted).toBe(true);
  await act(async () => pending.reject(new Error("Cancelled")));
  expect(showErrorToast).not.toHaveBeenCalled();
});

it("keeps the selection on configuration failure so the owner can retry", async () => {
  uploadSalonCoverApi.mockResolvedValueOnce({ success: false, message: "Media uploads are not configured." })
    .mockResolvedValueOnce({ success: true, data: { secureUrl: "https://example.com/new.jpg" } });
  const { container, onUploaded } = openEditor();
  chooseImage(container);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Save picture" })));
  expect(screen.getByRole("alert").textContent).toContain("not configured");
  expect(onUploaded).not.toHaveBeenCalled();
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Save picture" })));
  expect(uploadSalonCoverApi).toHaveBeenCalledTimes(2);
  expect(onUploaded).toHaveBeenCalledTimes(1);
});

it("shows Drive imports as indeterminate and exposes safe network errors", async () => {
  const pending = deferred();
  uploadSalonCoverFromDriveApi.mockReturnValue(pending.promise);
  const { onUploaded } = openEditor();
  fireEvent.click(screen.getByRole("button", { name: "Google Drive" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Public Google Drive share link" }), {
    target: { value: "https://drive.google.com/file/d/abc/view" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Use link" }));
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  const [url, config] = uploadSalonCoverFromDriveApi.mock.calls[0];
  expect(url).toContain("file/d/abc");
  act(() => config.onUploadProgress({ loaded: 100, total: 100 }));
  expect(screen.getByRole("progressbar").hasAttribute("value")).toBe(false);
  expect(screen.getByRole("status").textContent).toContain("Importing picture");
  await act(async () => pending.reject(new Error("Network unavailable")));
  expect(screen.getByRole("alert").textContent).toBe("Network unavailable");
  expect(onUploaded).not.toHaveBeenCalled();
});

it("does not save after clearing the selected picture", () => {
  const { container } = openEditor();
  chooseImage(container);
  fireEvent.click(screen.getByRole("button", { name: "Clear selected media" }));
  expect(screen.getByRole("button", { name: "Save picture" }).disabled).toBe(true);
  expect(uploadSalonCoverApi).not.toHaveBeenCalled();
});

it("an older cancelled response cannot clear a newer pending request", async () => {
  const old = deferred(), next = deferred();
  uploadSalonCoverApi.mockReturnValueOnce(old.promise).mockReturnValueOnce(next.promise);
  const { container, onUploaded } = openEditor();
  chooseImage(container);
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel upload" }));
  fireEvent.click(screen.getByRole("button", { name: "Save picture" }));
  await act(async () => old.resolve({ success: true, data: { secureUrl: "old" } }));
  expect(screen.getByRole("button", { name: "Cancel upload" })).toBeTruthy();
  expect(onUploaded).not.toHaveBeenCalled();
  await act(async () => next.resolve({ success: true, data: { secureUrl: "new" } }));
  expect(onUploaded).toHaveBeenCalledWith("new");
});
