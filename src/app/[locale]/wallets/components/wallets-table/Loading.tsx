import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dictionary } from "@/dictionaries/locale";

import LoadingCell from "./LoadingCell";

interface Props {
  d: Dictionary["walletsPage"]["walletsTable"];
}

export default function Loading({ d }: Props) {
  return (
    <div className="w-full animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{d.name}</TableHead>
            <TableHead>{d.balance}</TableHead>
            <TableHead>{d.currency}</TableHead>
            <TableHead>{d.changes}</TableHead>
            <TableHead>{d.sinceLastReport}</TableHead>
            <TableHead>{d.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(7)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="py-3">
                <LoadingCell />
              </TableCell>
              <TableCell className="py-3">
                <LoadingCell />
              </TableCell>
              <TableCell className="py-3">
                <LoadingCell />
              </TableCell>
              <TableCell className="py-3">
                <LoadingCell />
              </TableCell>
              <TableCell className="py-3">
                <LoadingCell />
              </TableCell>
              <TableCell className="py-3"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
