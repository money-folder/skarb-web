import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { Input } from "../input";

describe("Input component", () => {
  it("renders a default input correctly", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders an input with custom className", () => {
    render(<Input className="custom-class" placeholder="Custom Input" />);

    const input = screen.getByPlaceholderText("Custom Input");
    expect(input).toHaveClass("custom-class");
  });

  it("spreads additional props to the input element", () => {
    render(<Input data-testid="test-input" aria-label="Test Input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Test Input");
  });

  it("applies the correct type attribute", () => {
    const { rerender } = render(<Input type="text" aria-label="Text Input" />);

    let input = screen.getByLabelText("Text Input");
    expect(input).toHaveAttribute("type", "text");

    rerender(<Input type="password" aria-label="Password Input" />);
    input = screen.getByLabelText("Password Input");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="email" aria-label="Email Input" />);
    input = screen.getByLabelText("Email Input");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="number" aria-label="Number Input" />);
    input = screen.getByLabelText("Number Input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("handles user input correctly", async () => {
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    fireEvent.change(input, { target: { value: "Hello, world!" } });

    expect(input).toHaveValue("Hello, world!");
  });

  it("applies disabled styling when input is disabled", () => {
    render(<Input disabled placeholder="Disabled Input" />);

    const input = screen.getByPlaceholderText("Disabled Input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
    expect(input).toHaveClass("disabled:opacity-50");
  });
});
