import { getCurrentUserWallets } from "@/services/wallets";

import NavLink from "./Navlink";

export default async function Sidebar() {
  const wallets = await getCurrentUserWallets();

  return (
    <div className="w-[200px] h-full border-r-2 border-r-black">
      <ul className="p-5">
        <li>
          <NavLink activeClassName="text-white bg-black" href="/wallets">
            Wallets
          </NavLink>
        </li>

        {wallets ? (
          <ul className="pl-5">
            {wallets.map((w) => (
              <li key={w.id}>
                <NavLink
                  activeClassName="text-white bg-black"
                  href={`/wallets/${w.id}`}
                >
                  {w.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}
      </ul>
    </div>
  );
}
