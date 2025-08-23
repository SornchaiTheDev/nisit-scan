import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export const FileUploader = ({
  onFileSelect,
  accept,
  maxSize = 5242880, // 5MB default
  multiple = false,
  className = "",
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect(acceptedFiles);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full px-4 transition-colors border-2 border-dashed rounded-lg cursor-pointer hover:bg-(--gray-3) ${
        isDragActive
          ? "border-(--lime-9) bg-(--lime-3)"
          : "border-(--gray-7) bg-(--gray-2)"
      } ${className}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 mb-2 text-(--gray-11))" />
      <p className="text-sm text-gray-11">
        {isDragActive
          ? "Drop the files here..."
          : "Drag & drop files here, or click to select"}
      </p>
      {maxSize && (
        <p className="mt-1 text-xs text-(--gray-10)">
          Max file size: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      )}
    </div>
  );
};
