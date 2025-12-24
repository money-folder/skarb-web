"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dictionary } from "@/dictionaries/locale";
import { useRouter, useSearchParams } from "next/navigation";

import { ClientEarningDto } from "../../types";

interface Props {
  earnings: ClientEarningDto[];
  currency: string;
  total: number;
  dictionary: Dictionary["currencyPage"]["earningsTable"];
}

const ITEMS_PER_PAGE = 10;

export const GroupedEarningsTableClient = ({
  earnings,
  currency,
  total,
  dictionary,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Calculate pagination
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">{dictionary.type}</TableHead>
              <TableHead className="text-right">{dictionary.amount}</TableHead>
              <TableHead className="text-center">{dictionary.date}</TableHead>
              <TableHead className="text-left">{dictionary.comment}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.id}>
                <TableCell
                  className={`text-left ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.type}
                </TableCell>
                <TableCell
                  className={`text-right ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.moneyAmount.toFixed(2)} {currency}
                </TableCell>
                <TableCell
                  className={`text-center ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {new Date(earning.date).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell
                  className={`text-left ${earning.deletedAt ? "opacity-30" : ""}`}
                >
                  {earning.comment || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center border-t pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {visiblePages.map((page, index) => {
                const prevPage = visiblePages[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && (
                      <PaginationItem>
                        <span className="px-2">{"..."}</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
