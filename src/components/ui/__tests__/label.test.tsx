import { render, screen } from "@testing-library/react";
import * as React from "react";

import { Label } from "../label";

describe("Label component", () => {
  it("renders a default label correctly", () => {
    render(<Label htmlFor="test-input">{"Test Label"}</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("renders a label with custom className", () => {
    render(
      <Label htmlFor="custom-input" className="custom-class">
        {"Custom Label"}
      </Label>,
    );

    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("custom-class");
  });

  it("spreads additional props to the label element", () => {
    render(
      <Label htmlFor="test-input" data-testid="test-label">
        {"Test Label"}
      </Label>,
    );

    const label = screen.getByTestId("test-label");
    expect(label).toBeInTheDocument();
  });

  it("applies the default styling", () => {
    render(<Label htmlFor="test-input">{"Test Label"}</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("leading-none");
  });

  it("forwards ref to the label element", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <Label ref={ref} htmlFor="test-input">
        {"Test Label"}
      </Label>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
  });

  it("renders with disabled peer styling", () => {
    render(
      <div>
        <input id="disabled-input" disabled />
        <Label htmlFor="disabled-input">{"Disabled Input Label"}</Label>
      </div>,
    );

    const label = screen.getByText("Disabled Input Label");
    // The actual CSS behavior for peer-* classes can't be directly tested in JSDOM,
    // but we can verify the class is present
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });
});
