"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName: string;
  isNested?: boolean;
}

const NavLink = ({
  href,
  children,
  activeClassName,
  className = "",
  isNested = false,
}: Props) => {
  const pathname = usePathname();
  const isActive = isNested ? pathname.includes(href) : pathname === href;

  return (
    <Link
      href={href}
      className={`hover:underline ${className} ${
        isActive ? activeClassName : ""
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
