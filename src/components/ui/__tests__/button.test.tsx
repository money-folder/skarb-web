import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { Button, buttonVariants } from "../button";

describe("Button component", () => {
  it("renders a default button correctly", () => {
    render(<Button>{"Click me"}</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("renders a button with custom className", () => {
    render(<Button className="custom-class">{"Custom Button"}</Button>);

    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("spreads additional props to the button element", () => {
    render(<Button data-testid="test-button">{"Test Button"}</Button>);

    const button = screen.getByTestId("test-button");
    expect(button).toBeInTheDocument();
  });

  it("renders different button variants correctly", () => {
    const { rerender } = render(
      <Button variant="destructive">{"Destructive"}</Button>,
    );

    let button = screen.getByRole("button", { name: /destructive/i });
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">{"Outline"}</Button>);
    button = screen.getByRole("button", { name: /outline/i });
    expect(button).toHaveClass("border-input");

    rerender(<Button variant="secondary">{"Secondary"}</Button>);
    button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-secondary");

    rerender(<Button variant="ghost">{"Ghost"}</Button>);
    button = screen.getByRole("button", { name: /ghost/i });
    expect(button).toHaveClass("hover:bg-accent");

    rerender(<Button variant="link">{"Link"}</Button>);
    button = screen.getByRole("button", { name: /link/i });
    expect(button).toHaveClass("text-primary");
  });

  it("renders different button sizes correctly", () => {
    const { rerender } = render(
      <Button size="default">{"Default Size"}</Button>,
    );

    let button = screen.getByRole("button", { name: /default size/i });
    expect(button).toHaveClass("h-9 px-4 py-2");

    rerender(<Button size="sm">{"Small"}</Button>);
    button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-8 rounded-md px-3 text-xs");

    rerender(<Button size="lg">{"Large"}</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button).toHaveClass("h-10 rounded-md px-8");

    rerender(<Button size="icon">{"Icon"}</Button>);
    button = screen.getByRole("button", { name: /icon/i });
    expect(button).toHaveClass("h-9 w-9");
  });

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/">{"Link Button"}</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass(
      buttonVariants({ variant: "default", size: "default" }),
    );
  });

  it("handles clicks correctly", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>{"Click me"}</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled styling when button is disabled", () => {
    render(<Button disabled>{"Disabled Button"}</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});
