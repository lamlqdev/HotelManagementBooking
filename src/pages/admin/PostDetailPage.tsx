import React from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post/post.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const AdminPostDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-post-detail", id],
    queryFn: () => postApi.getPost(id!),
    enabled: !!id,
  });

  const post = data?.data;

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleDelete = async () => {
    if (!post) return;
    try {
      await postApi.deletePost(post._id || post.id);
      toast.success("Xoá bài viết thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      navigate("/admin/posts");
    } catch {
      toast.error("Xoá bài viết thất bại!");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6 mb-2" />
        <Skeleton className="h-6 w-4/6 mb-2" />
      </div>
    );
  }

  if (isError || !post) {
    return <div className="text-red-500">{t("common.error")}</div>;
  }

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-white mb-4"
      >
        <ArrowLeft className="mr-2" />
        {t("common.back")}
      </Button>
      <div className="flex items-center mb-4 relative">
        <FileText className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold flex-1">{post.title}</h1>
        <div className="absolute right-0">
          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive bg-red-100 hover:bg-red-200"
                onClick={() => setOpenDelete(true)}
                title="Xoá bài viết"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn xoá bài viết này?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Bài viết sẽ bị xoá vĩnh viễn
                  khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} autoFocus>
                  Xoá
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
        <div>
          <span className="font-semibold">Tác giả:</span>{" "}
          {typeof post.userId === "object" ? post.userId.name : post.userId}
        </div>
        <div>
          <span className="font-semibold">Ngày tạo:</span>{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Trạng thái:</span>{" "}
          <Badge
            variant={
              post.status === "approved"
                ? "default"
                : post.status === "pending"
                ? "secondary"
                : "destructive"
            }
            className="whitespace-nowrap capitalize"
          >
            {post.status === "approved"
              ? "Đã duyệt"
              : post.status === "pending"
              ? "Chờ duyệt"
              : "Từ chối"}
          </Badge>
        </div>
      </div>
      <div className="mb-4 text-xs text-muted-foreground">ID: {post.id}</div>
      <div
        className="prose prose-lg max-w-none bg-card p-6 rounded-xl shadow mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default AdminPostDetailPage;
