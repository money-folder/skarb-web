import { fireEvent, render, screen } from "@testing-library/react";

import SecondaryButton from "../SecondaryButton";

describe("SecondaryButton", () => {
  it("renders with the provided text", () => {
    render(<SecondaryButton text="Click me" />);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<SecondaryButton text="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has correct type attribute", () => {
    render(<SecondaryButton text="Click me" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("applies correct default styling classes", () => {
    render(<SecondaryButton text="Click me" />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("cursor-pointer");
    expect(button).toHaveClass("border-[1px]");
    expect(button).toHaveClass("border-black");
    expect(button).toHaveClass("px-5");
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("text-black");
  });

  it("works without onClick handler", () => {
    render(<SecondaryButton text="Click me" />);

    const button = screen.getByRole("button");
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });

  it("handles long text content", () => {
    const longText =
      "This is a very long button text that should still render properly";
    render(<SecondaryButton text={longText} />);
    expect(screen.getByRole("button")).toHaveTextContent(longText);
  });

  it("passes correct event object to onClick handler", () => {
    const handleClick = jest.fn();
    render(<SecondaryButton text="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "click",
      }),
    );
  });
});
