import SkeletonBar from "@/components/SkeletonBar";

export default function LoadingRow() {
  return (
    <tr className="h-[31px] w-full">
      <td className="p-2 h-1 border-2 border-black-300">
        <SkeletonBar />
      </td>
      <td className="p-2 h-1 border-2 border-black-300">
        <SkeletonBar />
      </td>
      <td className="p-2 h-1 border-2 border-black-300">
        <SkeletonBar />
      </td>
      <td className="p-2 h-1 border-2 border-black-300">
        <SkeletonBar />
      </td>
      <td className="p-2 h-1 border-2 border-black-300">
        <SkeletonBar />
      </td>
      <td className="p-2 h-1 border-2 border-black-300"></td>
    </tr>
  );
}
