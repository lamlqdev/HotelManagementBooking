import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/api/post/post.api";
import { Input } from "@/components/ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";

export default function AdminPostCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

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
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
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
      if (image) {
        formData.append("images", image);
      }
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
    <div className="w-full min-h-screen bg-white flex flex-col p-0 m-0">
      <div className="w-full max-w-full px-0 py-0">
        <div className="flex items-center gap-3 mb-8 mt-8 px-12">
          <span className="text-blue-500 text-3xl">
            <i className="fa-solid fa-pen-nib"></i>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-800">
            {isEdit ? t("admin.posts.edit") : t("admin.posts.create_new")}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 w-full px-12">
          <div>
            <Label
              className="font-semibold mb-2 text-gray-700 text-lg"
              htmlFor="post-title"
            >
              {t("admin.posts.field.title")}
            </Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("admin.posts.placeholder.title")}
              required
              disabled={isLoadingPost}
              className="h-12 text-lg rounded-xl border-gray-300 focus:border-blue-400 w-full"
            />
          </div>
          <div>
            <Label
              className="font-semibold mb-2 text-gray-700 text-lg"
              htmlFor="post-content"
            >
              {t("admin.posts.field.content")}
            </Label>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-full">
              <Editor
                id="post-content"
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={content}
                onEditorChange={(newValue) => setContent(newValue)}
                init={{
                  height: 600,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                    "image",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | help | image",
                  images_upload_url:
                    "http://localhost:3000/api/uploads/tinymce",
                  automatic_uploads: true,
                  images_upload_credentials: true,
                  width: "100%",
                }}
                disabled={isLoadingPost}
              />
            </div>
          </div>
          <div>
            <Label
              className="font-semibold mb-2 text-gray-700 text-lg"
              htmlFor="post-image"
            >
              Ảnh đại diện bài viết
            </Label>
            <Input
              id="post-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoadingPost}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="image preview"
                className="mt-4 w-40 h-40 object-cover rounded-xl border"
              />
            )}
          </div>
          <div className="flex gap-4 justify-end w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/posts")}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              {t("admin.posts.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingPost}
              className="h-12 px-8 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow"
            >
              {isSubmitting
                ? isEdit
                  ? t("admin.posts.saving")
                  : t("admin.posts.submitting")
                : isEdit
                ? t("admin.posts.save")
                : t("admin.posts.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
