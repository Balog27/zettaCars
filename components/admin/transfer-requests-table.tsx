"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
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
import { MoreHorizontal, CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export function AdminTransferTable() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const transferRequests = useQuery(api.transferRequests.getAllTransferRequests);
  const updateStatus = useMutation(api.transferRequests.updateTransferRequestStatus);
  const deleteRequest = useMutation(api.transferRequests.deleteTransferRequestPermanently);

  const handleStatusUpdate = async (requestId: Id<"transferRequests">, newStatus: "pending" | "confirmed" | "cancelled" | "completed") => {
    try {
      await updateStatus({ transferRequestId: requestId, newStatus: newStatus });
      toast.success("Transfer status updated", {
        description: `Status changed to ${newStatus}`,
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleDelete = async (requestId: Id<"transferRequests">, customerName: string) => {
    if (confirm(`Are you sure you want to delete the transfer request from ${customerName}?`)) {
      try {
        await deleteRequest({ transferRequestId: requestId });
        toast.success("Transfer request deleted");
      } catch (error) {
        toast.error("Failed to delete request");
        console.error(error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
      confirmed: { color: "bg-green-100 text-green-800 border-green-200", label: "Confirmed" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: "Cancelled" },
      completed: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Completed" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (transferRequests === undefined) {
    return <div className="flex justify-center py-8 text-muted-foreground italic">Loading transfer requests...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = transferRequests.slice(startIndex, endIndex);
  const totalPages = Math.ceil(transferRequests.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Traseu & Staționări</TableHead>
              <TableHead>Preț Estimat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nu s-au găsit cereri de transfer.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="font-medium">{request.customerInfo.name}</div>
                    <div className="text-xs text-muted-foreground">{request.customerInfo.email}</div>
                    <div className="text-xs text-muted-foreground">{request.customerInfo.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="capitalize">{request.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {request.rideType === 'one-way' ? 'Un sens' : 'Dus-întors'} 
                      ({request.passengers} pax)
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1 max-w-md">
                      {request.segments?.map((s: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           <span>{s.from} → {s.to}</span>
                           {s.waitingTime ? (
                             <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                               <Clock className="h-3 w-3" />
                               {s.waitingTime}h
                             </span>
                           ) : null}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">€{(request.estimatedPrice || 0).toFixed(2)}</div>
                    {request.totalDistanceKm && (
                      <div className="text-[10px] text-muted-foreground">
                        {request.totalDistanceKm} km
                      </div>
                    )}
                    {request.discountAmount && (
                      <div className="text-[10px] text-green-600 font-bold">
                        Voucher: -{request.discountAmount}€
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {request.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(request._id, "confirmed")}
                            className="cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmă
                          </DropdownMenuItem>
                        )}
                        {request.status === "confirmed" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(request._id, "completed")}
                            className="cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Finalizează
                          </DropdownMenuItem>
                        )}
                        {(request.status === "pending" || request.status === "confirmed") && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(request._id, "cancelled")}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Anulează
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(request._id, request.customerInfo.name)}
                          className="cursor-pointer text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Șterge definitiv
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

      {transferRequests.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Afișare {startIndex + 1} - {Math.min(endIndex, transferRequests.length)} din {transferRequests.length} cereri
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="cursor-default">
                  {currentPage} din {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
