import SkeletonBar from "@/shared/components/SkeletonBar";

export default function LoadingRow() {
  return (
    <tr className="h-[31px] w-full">
      <td className="border-black-300 h-1 border-2 p-2">
        <SkeletonBar />
      </td>
      <td className="border-black-300 h-1 border-2 p-2">
        <SkeletonBar />
      </td>
      <td className="border-black-300 h-1 border-2 p-2">
        <SkeletonBar />
      </td>
      <td className="border-black-300 h-1 border-2 p-2">
        <SkeletonBar />
      </td>
      <td className="border-black-300 h-1 border-2 p-2">
        <SkeletonBar />
      </td>
      <td className="border-black-300 h-1 border-2 p-2"></td>
    </tr>
  );
}
