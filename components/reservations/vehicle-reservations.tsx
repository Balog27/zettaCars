"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useTranslations } from 'next-intl';
import { Loader2, ArrowUpDown } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type SortField = 'date' | 'price' | 'status';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  status: string | null;
  location: string | null;
}

export function VehicleReservations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    location: null,
  });
  
  const t = useTranslations('reservations');
  
  const reservations = useQuery(api.reservations.getCurrentUserReservations);

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const VehicleInfo = ({ vehicleId }: { vehicleId: Id<"vehicles"> }) => {
    const vehicle = useQuery(api.vehicles.getById, { id: vehicleId });
    
    if (!vehicle) {
      return <span className="text-muted-foreground">Loading...</span>;
    }

    return (
      <div>
        <div className="font-medium">
          {vehicle.make} {vehicle.model}
        </div>
        <div className="text-sm text-muted-foreground">
          {vehicle.year}
        </div>
      </div>
    );
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

  const getSortedAndFilteredReservations = () => {
    if (!reservations) return [];

    let filtered = [...reservations];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter(r => 
        r.pickupLocation.toLowerCase().includes(filters.location!.toLowerCase()) ||
        r.restitutionLocation.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'date') {
        compareValue = a.startDate - b.startDate;
      } else if (sortField === 'price') {
        compareValue = a.totalPrice - b.totalPrice;
      } else if (sortField === 'status') {
        const statusOrder = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
        compareValue = (statusOrder[a.status as keyof typeof statusOrder] ?? 4) - (statusOrder[b.status as keyof typeof statusOrder] ?? 4);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  };

  const sortedData = getSortedAndFilteredReservations();
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReservations = sortedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  if (reservations === undefined) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  if (reservations === null || reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('noReservations')}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('noReservationsDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
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

        <div className="flex-1">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            {t('filters.location')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('filters.locationPlaceholder')}
              value={filters.location || ""}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, location: e.target.value || null }));
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {(filters.status || filters.location) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({ status: null, location: null });
                  setCurrentPage(1);
                }}
              >
                {t('filters.clear')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{t('table.vehicle')}</TableHead>
              <TableHead 
                className="w-[200px] cursor-pointer hover:bg-muted"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  {t('table.dates')}
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px]">{t('table.locations')}</TableHead>
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
            {paginatedReservations.map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>
                  <VehicleInfo vehicleId={reservation.vehicleId} />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">{formatDate(reservation.startDate)}</div>
                    <div className="text-sm text-muted-foreground">to {formatDate(reservation.endDate)}</div>
                    <div className="text-xs text-muted-foreground">
                      {reservation.pickupTime} - {reservation.restitutionTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{t('table.pickup')}: {reservation.pickupLocation}</div>
                    <div className="text-sm">{t('table.return')}: {reservation.restitutionLocation}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{formatPrice(reservation.totalPrice)}</div>
                  {reservation.promoCode && (
                    <div className="text-xs text-green-600">
                      {t('table.promo')}: {reservation.promoCode}
                    </div>
                  )}
                  {reservation.isSCDWSelected ? (
                    <div className="text-xs text-green-600">
                      ✓ {t('table.scdw')}
                    </div>
                  ) : (
                    <div className="text-xs text-blue-600">
                      ✓ {t('table.warranty')} (€{reservation.deductibleAmount})
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
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
    </div>
  );
}
