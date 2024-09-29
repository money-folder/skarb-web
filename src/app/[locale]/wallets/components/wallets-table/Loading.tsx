import LoadingRow from './LoadingRow';

export default async function WalletsTableLoading() {
  return (
    <div className="w-full">
      <table className="w-full border-collapse animate-pulse">
        <thead>
          <tr>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Name</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Balance</th>
            <th className="w-1/12 border-2 border-black p-1 text-sm">Currency</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Changes</th>
            <th className="w-3/12 border-2 border-black p-1 text-sm">Since Latest Report</th>
            <th className="w-2/12 border-2 border-black p-1 text-sm">Actions</th>
          </tr>
        </thead>

        <tbody>
          {[...Array(7)].map((_, i) => (
            <LoadingRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
