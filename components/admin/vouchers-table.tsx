"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash2, MoreHorizontal, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditVoucherDialog } from "@/components/admin/edit-voucher-dialog";
import { toast } from "sonner";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

export function VouchersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingVoucher, setEditingVoucher] = useState<Id<"vouchers"> | null>(null);
  
  const vouchers = useQuery(api.vouchers.getAllVouchers);
  const deleteVoucher = useMutation(api.vouchers.deleteVoucher);

  const handleNextPage = (totalPages: number) => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleEdit = (id: Id<"vouchers">) => {
    setEditingVoucher(id);
  };

  const handleDelete = async (id: Id<"vouchers">, name: string) => {
    if (confirm(`Are you sure you want to delete voucher "${name}"?`)) {
      try {
        await deleteVoucher({ id });
        toast.success("Voucher deleted successfully");
      } catch (error) {
        toast.error("Failed to delete voucher");
        console.error(error);
      }
    }
  };

  if (!vouchers) {
    return <div className="flex justify-center py-8">Loading vouchers...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVouchers = vouchers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(vouchers.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No vouchers found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVouchers.map((voucher) => (
                <TableRow key={voucher._id}>
                  <TableCell className="font-mono font-bold">{voucher.code}</TableCell>
                  <TableCell>{voucher.name}</TableCell>
                  <TableCell>
                    {voucher.type === "percentage" ? `${voucher.value}%` : `${voucher.value} EUR`}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {voucher.eligibleServices.map(s => (
                        <Badge key={s} variant="outline" className="text-[10px] capitalize">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>From: {format(voucher.startDate, "dd MMM yyyy")}</div>
                    {voucher.expiryDate && (
                      <div className="text-muted-foreground">
                        To: {format(voucher.expiryDate, "dd MMM yyyy")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {voucher.usageCount} / {voucher.maxUsage ?? "∞"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {voucher.active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(voucher._id)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(voucher._id, voucher.name)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {vouchers.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="cursor-default">
                  {currentPage} of {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handleNextPage(totalPages)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {editingVoucher && (
        <EditVoucherDialog
          id={editingVoucher}
          open={!!editingVoucher}
          onOpenChange={(o) => !o && setEditingVoucher(null)}
        />
      )}
    </div>
  );
}
