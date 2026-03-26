"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Info, Loader2, ArrowUpDown } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type SortField = 'date' | 'price' | 'status';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  status: string | null;
}

export function TransferReservations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<FilterState>({
    status: null,
  });
  
  const t = useTranslations('reservations');
  const router = useRouter();
  
  const transferRequests = useQuery(api.transferRequests.getCurrentUserTransferRequests);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: t('status.pending') },
      confirmed: { color: "bg-green-100 text-green-800 border-green-200", label: t('status.confirmed') },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: t('status.cancelled') },
      completed: { color: "bg-blue-100 text-blue-800 border-blue-200", label: t('status.completed') },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'Pending';
    return `€${price.toFixed(2)}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getSortedAndFilteredRequests = () => {
    if (!transferRequests) return [];

    let filtered = [...transferRequests];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'date') {
        compareValue = new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime();
      } else if (sortField === 'price') {
        const aPrice = a.estimatedPrice || 0;
        const bPrice = b.estimatedPrice || 0;
        compareValue = aPrice - bPrice;
      } else if (sortField === 'status') {
        const statusOrder = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
        compareValue = (statusOrder[a.status as keyof typeof statusOrder] ?? 4) - (statusOrder[b.status as keyof typeof statusOrder] ?? 4);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  };

  const sortedData = getSortedAndFilteredRequests();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = sortedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  if (transferRequests === undefined) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              {t('transfer.note')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            {t('filters.status')}
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => {
              setFilters(prev => ({ ...prev, status: value === "all" ? null : value }));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
              <SelectItem value="pending">{t('status.pending')}</SelectItem>
              <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
              <SelectItem value="completed">{t('status.completed')}</SelectItem>
              <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filters.status && (
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({ status: null });
                setCurrentPage(1);
              }}
            >
              {t('filters.clear')}
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {transferRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{t('transfer.title')} - {t('noReservations')}</p>
              <p className="text-sm text-muted-foreground">
                {t('transfer.details')}
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/transfers/book')}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t('transfer.bookButton')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/contact')}
                >
                  {t('transfer.contactButton')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">{t('transfer.title')}</TableHead>
                  <TableHead 
                    className="w-[180px] cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      {t('table.dates')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">Locations</TableHead>
                  <TableHead className="w-[100px]">Passengers</TableHead>
                  <TableHead 
                    className="w-[130px] cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-2">
                      {t('table.totalPrice')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[130px] cursor-pointer hover:bg-muted"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      {t('table.status')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <div className="font-medium capitalize">{request.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.customerInfo.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{formatDate(request.transferDate)}</div>
                        <div className="text-xs text-muted-foreground">
                          {request.transferTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">From:</span> {request.pickupLocation}</div>
                        <div><span className="font-medium">To:</span> {request.dropoffLocation}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {request.numberOfPassengers}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatPrice(request.estimatedPrice)}</div>
                      {request.distanceKm && (
                        <div className="text-xs text-muted-foreground">
                          {request.distanceKm} km
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {sortedData.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t('pagination.showing')} {startIndex + 1} {t('pagination.to')} {Math.min(endIndex, sortedData.length)} {t('pagination.of')} {sortedData.length}
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
                      {currentPage} of {totalPages}
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
        </>
      )}

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('transfer.whatYouNeed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t('transfer.need1')}</li>
              <li>{t('transfer.need2')}</li>
              <li>{t('transfer.need3')}</li>
              <li>{t('transfer.need4')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('transfer.howItWorks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t('transfer.step1')}</li>
              <li>{t('transfer.step2')}</li>
              <li>{t('transfer.step3')}</li>
              <li>{t('transfer.step4')}</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
