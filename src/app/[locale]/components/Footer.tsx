import Link from "next/link";

import { Dictionary } from "@/dictionaries/locale";

import { ExportAll } from "../exporting/components/ExportAll";

interface Props {
  d: Dictionary;
}

function Footer({ d }: Props) {
  return (
    <footer className="col-span-2 row-span-1 flex justify-between bg-black p-1">
      <ul className="flex gap-4 px-5 text-xs">
        <li>
          <ExportAll />
        </li>
      </ul>
      <ul className="flex gap-4 px-5 text-xs">
        <li className="text-white hover:underline">
          <Link href="/wallets">{d.footer.inEnglish}</Link>
        </li>
        <li className="text-white hover:underline">
          <Link href="/be/wallets">{d.footer.inBelarusian}</Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
