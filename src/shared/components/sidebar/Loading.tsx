import LoadingBar from "./LoadingBar";

export default function SidebarLoading() {
  return (
    <div className="p-5 w-[225px] h-full border-r-2 border-r-black">
      <div className="w-full flex flex-col items-center">
        <div className="w-fit overflow-hidden rounded-full">
          <div className="w-[128px] h-[128px] bg-gray-300 animate-pulse"></div>
        </div>

        <h3 className="mt-5 w-full animate-pulse">
          <LoadingBar />
        </h3>
      </div>

      <ul className="mt-14 animate-pulse">
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
