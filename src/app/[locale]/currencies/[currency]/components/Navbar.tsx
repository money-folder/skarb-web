"use client";

import NavLink from "@/shared/components/sidebar/Navlink";
import {
  redirect,
  RedirectType,
  useSelectedLayoutSegments,
} from "next/navigation";
import { Tab } from "../../types";

interface Props {
  tabs: Tab[];
}

export default function Navbar({ tabs }: Props) {
  const segments = useSelectedLayoutSegments();
  const tab = segments[0];

  if (!tab) {
    redirect(tabs[0].link, RedirectType.replace);
  }

  const listItems = tabs.map((tab) => (
    <li className="" key={tab.title}>
      <NavLink activeClassName="text-white bg-black" href={tab.link}>
        {tab.title}
      </NavLink>
    </li>
  ));

  return (
    <ul className="align-center m-3 flex flex-1 justify-center gap-3">
      {listItems}
    </ul>
  );
}
