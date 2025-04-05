import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Link } from "react-router";

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

// Mock data - sẽ được thay thế bằng dữ liệu thực từ API
const mockPartners = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    hotelName: "Grand Hotel",
    hotelAddress: "123 Đường ABC, Quận 1, TP.HCM",
    status: "pending",
    submittedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    hotelName: "Luxury Resort",
    hotelAddress: "456 Đường XYZ, Quận 2, TP.HCM",
    status: "pending",
    submittedAt: "2024-03-19T15:30:00Z",
  },
];

const PartnerApproval = () => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              {mockPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>{partner.hotelName}</TableCell>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>
                    <div>{partner.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {partner.phone}
                    </div>
                  </TableCell>
                  <TableCell>{partner.hotelAddress}</TableCell>
                  <TableCell>{formatDate(partner.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/partners/${partner.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default PartnerApproval;
