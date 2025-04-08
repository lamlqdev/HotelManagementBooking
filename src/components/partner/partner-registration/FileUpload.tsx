import React from "react";
import { useTranslation } from "react-i18next";
import { UploadIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const FileUpload = React.forwardRef<
  HTMLInputElement,
  {
    onChange?: (files: File | File[] | null) => void;
    accept?: string;
    multiple?: boolean;
    value?: File | File[];
  }
>((props, ref) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
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

  const createPreviews = (files: File[]) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      // Revoke old preview URLs to prevent memory leaks
      prev.forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (props.multiple) {
        const currentFiles = Array.isArray(props.value) ? props.value : [];
        const updatedFiles = [...currentFiles, ...newFiles];
        props.onChange?.(updatedFiles);
        createPreviews(updatedFiles);
        setFileNames(updatedFiles.map((f) => f.name));
      } else {
        props.onChange?.(newFiles[0]);
        createPreviews([newFiles[0]]);
        setFileNames([newFiles[0].name]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (props.multiple) {
        const currentFiles = Array.isArray(props.value) ? props.value : [];
        const updatedFiles = [...currentFiles, ...newFiles];
        props.onChange?.(updatedFiles);
        createPreviews(updatedFiles);
        setFileNames(updatedFiles.map((f) => f.name));
      } else {
        props.onChange?.(newFiles[0]);
        createPreviews([newFiles[0]]);
        setFileNames([newFiles[0].name]);
      }
    }
  };

  const handleRemove = (index: number) => {
    if (props.multiple && Array.isArray(props.value)) {
      const newFiles = [...props.value];
      newFiles.splice(index, 1);
      props.onChange?.(newFiles.length > 0 ? newFiles : null);
      createPreviews(newFiles);
      setFileNames(newFiles.map((f) => f.name));
    } else {
      props.onChange?.(null);
      setPreviews([]);
      setFileNames([]);
    }
  };

  // Update fileNames and previews when value changes
  React.useEffect(() => {
    if (props.value) {
      if (Array.isArray(props.value)) {
        setFileNames(props.value.map((f) => f.name));
        createPreviews(props.value);
      } else {
        setFileNames([props.value.name]);
        createPreviews([props.value]);
      }
    } else {
      setFileNames([]);
      setPreviews([]);
    }
  }, [props.value]);

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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

      {fileNames.length === 0 ? (
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
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={fileNames[index]}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <Cross2Icon className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500 truncate text-center">
                {fileNames[index]}
              </p>
            </div>
          ))}
          {props.multiple && (
            <div className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:border-primary dark:hover:border-primary transition-colors">
              <div className="text-center">
                <UploadIcon className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm text-gray-500">
                  {t("register_partner.file_upload.add_more")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
