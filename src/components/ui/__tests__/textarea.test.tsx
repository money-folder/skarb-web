import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { Textarea } from "../textarea";

describe("Textarea component", () => {
  it("renders a default textarea correctly", () => {
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders a textarea with custom className", () => {
    render(<Textarea className="custom-class" placeholder="Custom Textarea" />);

    const textarea = screen.getByPlaceholderText("Custom Textarea");
    expect(textarea).toHaveClass("custom-class");
  });

  it("spreads additional props to the textarea element", () => {
    render(<Textarea data-testid="test-textarea" aria-label="Test Textarea" />);

    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("aria-label", "Test Textarea");
  });

  it("applies the default styling", () => {
    render(<Textarea placeholder="Default Textarea" />);

    const textarea = screen.getByPlaceholderText("Default Textarea");
    expect(textarea).toHaveClass("min-h-[60px]");
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("rounded-md");
    expect(textarea).toHaveClass("border");
  });

  it("forwards ref to the textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("handles user input correctly", () => {
    render(<Textarea placeholder="Type here" />);

    const textarea = screen.getByPlaceholderText("Type here");
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });

    expect(textarea).toHaveValue("Hello, world!");
  });

  it("applies disabled styling when textarea is disabled", () => {
    render(<Textarea disabled placeholder="Disabled Textarea" />);

    const textarea = screen.getByPlaceholderText("Disabled Textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
    expect(textarea).toHaveClass("disabled:opacity-50");
  });

  it("handles rows and cols attributes correctly", () => {
    render(<Textarea rows={10} cols={50} placeholder="Sized Textarea" />);

    const textarea = screen.getByPlaceholderText("Sized Textarea");
    expect(textarea).toHaveAttribute("rows", "10");
    expect(textarea).toHaveAttribute("cols", "50");
  });
});
