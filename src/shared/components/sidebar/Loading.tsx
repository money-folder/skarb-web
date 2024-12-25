import LoadingBar from "./LoadingBar";

export default function SidebarLoading() {
  return (
    <div className="h-full w-[225px] border-r-2 border-r-black p-5">
      <div className="flex w-full flex-col items-center">
        <div className="w-fit overflow-hidden rounded-full">
          <div className="h-[128px] w-[128px] animate-pulse bg-gray-300"></div>
        </div>

        <h3 className="mt-5 w-full animate-pulse">
          <LoadingBar />
        </h3>
      </div>

      <ul className="mt-14 animate-pulse">
        <li>
          <LoadingBar />

          <ul className="mt-2 space-y-2 pl-5">
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
