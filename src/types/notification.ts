export interface Notification {
  _id: string;
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "voucher" | "admin" | "system";
  status: "unread" | "read";
  relatedModel?: string;
  relatedId?: string;
  createdAt: Date;
  updatedAt: Date;
}
