"use client";
import { Progress, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast/headless";

const Page = () => {
  const [uploading, setUploading] = useState(false);
  const [creatingVector, setCreatingVector] = useState(false);
  const router = useRouter();
  const uploadFileToS3 = async (acceptedFile: File) => {
    try {
      console.log(acceptedFile, acceptedFile.size);
  
      if (acceptedFile.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }
  
      setUploading(true);
  
      const fileFormData = new FormData();
      fileFormData.append("file", acceptedFile);
  
      console.log(fileFormData.get("file"));
  
      const uploadFile = await axios.post("/api/upload", fileFormData);
  
      if (uploadFile.status === 200 || uploadFile.status === 201) {
        console.log(uploadFile.data);
        setUploading(false);
        setCreatingVector(true);
  
        const convertToVectors = await axios.post("/api/convert-to-vector", {
          fileId: uploadFile.data.savedFile._id,
        });
  
        console.log(convertToVectors);
  
        if (convertToVectors.status === 200) {
          router.push("/", { scroll: false });
        }
      } else {
        throw new Error(uploadFile.data.error || "Something went wrong");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
      setCreatingVector(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center w-full max-w-xl mx-auto mt-16">
      {!uploading && !creatingVector ? (
        <>
          <Dropzone
            onDrop={(acceptedFile) => uploadFileToS3(acceptedFile[0])}
            accept={{ "application/pdf": [".pdf"] }}
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
          >
            {({ getRootProps, getInputProps }) => (
              <label
                {...getRootProps()}
                onClick={(e) => e.stopPropagation()}
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    pdf {`(max size : 10mb)`}
                  </p>
                </div>
                <input
                  {...getInputProps()}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                />
              </label>
            )}
          </Dropzone>
        </>
      ) : (
        ""
      )}
      {(uploading || creatingVector) && (
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center gap-2">
            <Spinner />
            <p>
              {uploading
                ? "uploading file"
                : creatingVector
                ? "creating vectors"
                : "done"}
            </p>
          </div>
          <Progress
            aria-label="Loading..."
            value={uploading ? 20 : creatingVector ? 60 : 100}
            className="max-w-md mt-4"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
