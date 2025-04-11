import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { partnerApi } from "@/api/partner/partner.api";
import { PartnerResponse, Partner } from "@/api/partner/types";

const PartnerApproval = () => {
  const { t } = useTranslation();

  const { data: response, isLoading } = useQuery<PartnerResponse>({
    queryKey: ["pendingPartners"],
    queryFn: async () => {
      const response = await partnerApi.getPendingPartners();
      return response;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {t("admin.partners.approval.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.partners.approval.pendingRequestsDescription")}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("admin.partners.approval.table.hotelName")}
                </TableHead>
                <TableHead>
                  {t("admin.partners.approval.table.ownerName")}
                </TableHead>
                <TableHead>
                  {t("admin.partners.approval.table.contact")}
                </TableHead>
                <TableHead>
                  {t("admin.partners.approval.table.address")}
                </TableHead>
                <TableHead>
                  {t("admin.partners.approval.table.submittedAt")}
                </TableHead>
                <TableHead className="text-right">
                  {t("admin.partners.approval.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Hiển thị skeleton loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40 mb-1" />
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-36" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : response?.data && response.data.length > 0 ? (
                response.data.map((partner: Partner) => (
                  <TableRow key={partner.user._id}>
                    <TableCell>{partner.hotel.name}</TableCell>
                    <TableCell>{partner.user.name}</TableCell>
                    <TableCell>
                      <div>{partner.user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {partner.user.phone}
                      </div>
                    </TableCell>
                    <TableCell>{partner.hotel.address}</TableCell>
                    <TableCell>{formatDate(partner.hotel.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/partners/${partner.user._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("admin.partners.approval.noPendingRequests")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default PartnerApproval;
