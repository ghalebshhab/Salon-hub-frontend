import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import PasswordField from "./PasswordField.jsx";

it("reveals the password with a clear animated visibility control", () => {
  render(
    <PasswordField id="password" label="Password" value="SalonHub2026!" readOnly />,
  );

  const input = screen.getByLabelText("Password");

  expect(input.type).toBe("password");

  fireEvent.click(screen.getByRole("button", { name: "Show password" }));

  expect(input.type).toBe("text");
  expect(screen.getByRole("button", { name: "Hide password" })).toBeDefined();
});
