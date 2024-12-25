import { fireEvent, render, screen } from "@testing-library/react";

import PrimaryButton from "../PrimaryButton";

describe("PrimaryButton", () => {
  test("renders button with text", () => {
    render(<PrimaryButton text="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("applies correct default type and classes", () => {
    render(<PrimaryButton text="Click me" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "px-5",
      "py-2",
      "text-white",
      "bg-black",
      "cursor-pointer",
    );
  });

  test("handles custom type prop", () => {
    render(<PrimaryButton text="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  test("handles onClick event", () => {
    const handleClick = jest.fn();
    render(<PrimaryButton text="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
