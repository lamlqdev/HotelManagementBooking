export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export const mockProfileData: ProfileData = {
  id: "1",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Happy&backgroundColor=b6e3f4,c0aede,d1f4d9,ffd5dc,ffdfbf",
  createdAt: "2024-01-01",
  updatedAt: "2024-03-20",
};
