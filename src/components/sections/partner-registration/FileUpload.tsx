import React from "react";
import { useTranslation } from "react-i18next";
import { ImageIcon, UploadIcon } from "@radix-ui/react-icons";

const FileUpload = React.forwardRef<
  HTMLInputElement,
  {
    onChange?: (files: FileList | null) => void;
    accept?: string;
    multiple?: boolean;
  }
>((props, ref) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const { t } = useTranslation();
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      props.onChange?.(e.dataTransfer.files);
      setFileNames(Array.from(e.dataTransfer.files).map((f) => f.name));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      props.onChange?.(e.target.files);
      setFileNames(Array.from(e.target.files).map((f) => f.name));
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary"
        }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={ref}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept={props.accept}
        multiple={props.multiple}
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          <UploadIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("register_partner.file_upload.drag_drop")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("register_partner.file_upload.supported_formats")}
          </p>
        </div>
        {fileNames.length > 0 && (
          <div className="mt-4 space-y-2">
            {fileNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
