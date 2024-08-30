"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { ImageDown, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/config/design?id=${configId}`);
      });
    },

    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropAccepted = (acceptFiles: File[]) => {
    if (acceptFiles[0].size > maxSizeInBytes) {
      toast({
        title: `Image size is more than 4 mb`,
        description: "Please choose an image size less than 4 MB",
        variant: "destructive",
      });
    }
    startUpload(acceptFiles, { configId: undefined });
  };

  const onDropRejected = (rejectedFile: FileRejection[]) => {
    const [file] = rejectedFile;
    setIsDragOver(false);

    if (rejectedFile.length > 1) {
      toast({
        title: "At a time only one image accepted",
        description: "please drop only one image at a time",
        variant: "default",
      });
    } else {
      toast({
        title: `${file.file.type} type is not supported`,
        description: "please use png, jpg, or jpeg image insted",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          isDragOver: "ring-blue-900/25 bg-blue-900/10",
        }
      )}
    >
      <div className="relative  flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          maxFiles={1}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-fll w-full  flex-1 flex flex-col justify-center items-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <ImageDown className="h-6 w-6 mb-2 text-zinc-500" />
              )}

              <div className="flex flex-col text-sm mb-2 text-zinc-700 justify-center">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, please wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop file </span>
                    to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">click to upload </span>
                    or drag and drop
                  </p>
                )}
              </div>

              {!isPending && (
                <>
                  <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
                  <p className="text-xs mt-0.5 text-zinc-400">
                    Max image size 4MB
                  </p>
                </>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Upload;
