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
  d: Dictionary["currencyPage"]["currencyTable"];
}

export default function Loading({ d }: Props) {
  return (
    <div className="w-full animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{d.moneyAmount}</TableHead>
            <TableHead>{d.changes}</TableHead>
            <TableHead>{d.wallets}</TableHead>
            <TableHead>{d.date}</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
