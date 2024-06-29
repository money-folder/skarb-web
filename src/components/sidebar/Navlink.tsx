"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName: string;
}

const NavLink = ({ href, children, activeClassName, className }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;

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
