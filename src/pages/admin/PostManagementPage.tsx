import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post/post.api";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Post } from "@/types/post";
import { GetPostsResponse } from "@/api/post/types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function AdminPostManagementPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetPostsResponse>({
    queryKey: ["admin-posts", search],
    queryFn: () => postApi.getPosts(),
  });

  const posts: Post[] = (data?.data || []).filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      postId,
      status,
    }: {
      postId: string;
      status: string;
    }) => {
      const formData = new FormData();
      formData.append("status", status);
      return postApi.updatePost(postId, formData);
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
    onError: () => {
      toast.error("Cập nhật trạng thái thất bại!");
    },
  });

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t("admin.posts.title")}</h1>
              </div>
              <Button onClick={() => navigate("/admin/posts/create")}>
                Tạo bài viết
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              {t("admin.posts.list_description")}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%]">
                  {t("admin.posts.field.title")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("common.author", "Tác giả")}
                </TableHead>
                <TableHead className="w-[15%]">
                  {t("common.status", "Trạng thái")}
                </TableHead>
                <TableHead className="w-[20%]">
                  {t("common.createdAt", "Ngày tạo")}
                </TableHead>
                <TableHead className="w-[15%]">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow
                    key={post._id}
                    className="hover:bg-transparent cursor-pointer"
                    onClick={() => navigate(`/admin/posts/${post._id}`)}
                  >
                    <TableCell className="max-w-[30%] py-4">
                      <span className="font-medium truncate block">
                        {post.title}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[20%] py-4">
                      <span>
                        {typeof post.userId === "object"
                          ? post.userId.name
                          : post.userId}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className={
                              post.status === "approved"
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                : post.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                                : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                            }
                          >
                            {post.status === "approved"
                              ? "Đã duyệt"
                              : post.status === "pending"
                              ? "Chờ duyệt"
                              : "Từ chối"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                postId: post._id || post.id,
                                status: "pending",
                              })
                            }
                            disabled={
                              post.status === "pending" ||
                              updateStatusMutation.isPending
                            }
                          >
                            Chờ duyệt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                postId: post._id || post.id,
                                status: "approved",
                              })
                            }
                            disabled={
                              post.status === "approved" ||
                              updateStatusMutation.isPending
                            }
                          >
                            Đã duyệt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                postId: post._id || post.id,
                                status: "rejected",
                              })
                            }
                            disabled={
                              post.status === "rejected" ||
                              updateStatusMutation.isPending
                            }
                          >
                            Từ chối
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="max-w-[20%] py-4">
                      {new Date(post.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-[15%] py-4">
                      <span className="truncate block">{post._id}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("admin.posts.no_posts")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
