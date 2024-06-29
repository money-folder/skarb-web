import { fetchCurrentUserWallets } from "@/actions/wallets";

import NavLink from "./Navlink";

export default async function Sidebar() {
  const result = await fetchCurrentUserWallets();

  return (
    <div className="w-[200px] h-full border-r-2 border-r-black">
      <ul className="p-5">
        <li>
          <NavLink activeClassName="text-white bg-black" href="/wallets">
            Wallets
          </NavLink>
        </li>

        {result.data ? (
          <ul className="pl-5">
            {result.data.map((w) => (
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
