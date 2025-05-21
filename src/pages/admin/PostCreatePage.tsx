import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post/post.api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function AdminPostCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy dữ liệu bài viết khi sửa
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["admin-post-detail", id],
    queryFn: () => (id ? postApi.getPost(id) : Promise.resolve(undefined)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && postData?.data) {
      setTitle(postData.data.title || "");
      setContent(postData.data.content || "");
      // Nếu có ảnh cũ, hiển thị preview
      if (postData.data.images && postData.data.images.length > 0) {
        setPreviewImages(postData.data.images.map((img) => img.url));
      }
    }
  }, [isEdit, postData]);

  // Mutation tạo bài viết
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return postApi.createPost(formData);
    },
    onSuccess: () => {
      toast.success(t("admin.posts.success.create"));
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      navigate("/admin/posts");
    },
    onError: () => {
      toast.error(t("admin.posts.error.create"));
    },
  });

  // Mutation cập nhật bài viết
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!id) throw new Error("Missing id");
      return postApi.updatePost(id, formData);
    },
    onSuccess: () => {
      toast.success(t("admin.posts.success.update"));
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      navigate("/admin/posts");
    },
    onError: () => {
      toast.error(t("admin.posts.error.update"));
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setPreviewImages(
        Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error(t("admin.posts.error.required"));
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      images.forEach((img) => formData.append("images", img));
      if (isEdit) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <Card className="p-8 mt-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? t("admin.posts.edit") : t("admin.posts.create_new")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">
              {t("admin.posts.field.title")}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("admin.posts.placeholder.title")}
              required
              disabled={isLoadingPost}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("admin.posts.field.content")}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("admin.posts.placeholder.content")}
              rows={10}
              required
              disabled={isLoadingPost}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {t("admin.posts.field.images")}
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoadingPost}
            />
            {previewImages.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewImages.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || isLoadingPost}>
              {isSubmitting
                ? isEdit
                  ? t("admin.posts.saving")
                  : t("admin.posts.submitting")
                : isEdit
                ? t("admin.posts.save")
                : t("admin.posts.submit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/posts")}
              disabled={isSubmitting}
            >
              {t("admin.posts.cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
