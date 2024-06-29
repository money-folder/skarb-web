import LoadingBar from "./LoadingBar";

export default function SidebarLoading() {
  return (
    <div className="p-5 w-[200px] h-full border-r-2 border-r-black">
      <ul className="animate-pulse">
        <li>
          <LoadingBar />

          <ul className="mt-2 pl-5 space-y-2">
            {[...Array(3)].map((_, i) => (
              <LoadingBar key={i} />
            ))}
          </ul>
        </li>

        {[...Array(2)].map((_, i) => (
          <li key={i} className="mt-2">
            <LoadingBar />
          </li>
        ))}
      </ul>
    </div>
  );
}
