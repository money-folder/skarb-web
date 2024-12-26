import { fireEvent, render, screen } from "@testing-library/react";

import CreateButton from "../CreateButton";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={props.src.src || props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
      />
    );
  },
}));

// Mock the SVG import
jest.mock("@/assets/plus.svg", () => ({
  src: "/mock-plus-icon.svg",
  height: 16,
  width: 16,
}));

describe("CreateButton", () => {
  it("renders with plus icon and without text when text prop is not provided", () => {
    render(<CreateButton onClick={() => {}} />);

    // Check if icon is rendered
    const icon = screen.getByAltText("plus");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");

    // Verify text is not rendered
    expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
  });

  it("renders with plus icon and text when text prop is provided", () => {
    render(<CreateButton text="Add Item" onClick={() => {}} />);

    // Check if icon is rendered
    expect(screen.getByAltText("plus")).toBeInTheDocument();

    // Check if text is rendered
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<CreateButton text="Add Item" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct default styling classes", () => {
    render(<CreateButton onClick={() => {}} />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("inline-flex");
    expect(button).toHaveClass("cursor-pointer");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("space-x-2");
    expect(button).toHaveClass("opacity-75");
  });

  it("maintains correct spacing between icon and text", () => {
    render(<CreateButton text="Add Item" onClick={() => {}} />);
    const button = screen.getByRole("button");

    expect(button.children[0]).toHaveAttribute("alt", "plus");
    expect(button.children[1]).toHaveTextContent("Add Item");
    expect(button).toHaveClass("space-x-2");
  });

  it("renders with long text content", () => {
    const longText =
      "This is a very long button text that should still render properly";
    render(<CreateButton text={longText} onClick={() => {}} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("is keyboard focusable", () => {
      render(<CreateButton text="Add Item" onClick={() => {}} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has proper image alt text", () => {
      render(<CreateButton text="Add Item" onClick={() => {}} />);
      expect(screen.getByAltText("plus")).toBeInTheDocument();
    });
  });

  describe("hover states", () => {
    it("has hover styles", () => {
      render(<CreateButton text="Add Item" onClick={() => {}} />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("hover:underline");
      expect(button).toHaveClass("hover:opacity-100");
    });
  });
});
