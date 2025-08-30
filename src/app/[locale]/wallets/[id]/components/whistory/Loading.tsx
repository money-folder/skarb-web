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
  d: Dictionary["whistoryPage"]["whistoryTable"];
}

export default function Loading({ d }: Props) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr,_1fr] grid-rows-[auto,_1fr] gap-5">
      <div className="col-span-2 row-span-1 flex w-full gap-5">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-[100px] w-[180px] animate-pulse rounded-xl bg-gray-300"
          ></div>
        ))}
      </div>

      <div className="col-span-2 row-span-1 w-full max-w-[550px]">
        <div className="w-full animate-pulse">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{d.balance}</TableHead>
                <TableHead>{d.date}</TableHead>
                <TableHead>{d.changes}</TableHead>
                <TableHead>{d.comment}</TableHead>
                <TableHead>{d.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(16)].map((_, i) => (
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
                  <TableCell className="py-3"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="h-full w-full"></div>
    </div>
  );
}
