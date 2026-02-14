"use client";
import { Button, CancelButton } from "@/src/components/common/button";
import { CustomHeader } from "@/src/components/common/header";
import { useMutation } from "react-query";
import { useState } from "react";
import {
  TbCloudUpload,
  TbFileDownload,
  TbRosetteDiscountCheckFilled,
} from "react-icons/tb";
import { downloadCSV } from "./csv";
import toast from "react-hot-toast";
import CustomDialog from "@/src/components/common/modal/CustomDialog";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type !== "text/csv") {
        toast.error("❌ Please upload a valid CSV file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type !== "text/csv") {
        toast.error("❌ Please upload a valid CSV file.");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.custom("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://sandboxmobileapi.abiapay.com/api/v1/abssin/bulk-school-registration",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");


      const data = await response.json();
       setTotalRecords(data.total_records);
       setFile(null);

       toast.success(
        `✅ Success: ${data.response_message}, Records: ${data.total_records}`
      );
      (
        document.getElementById("createInfantABSSINDialog") as HTMLDialogElement
      )?.showModal();
    } catch (error) {
      toast.error("❌ Upload failed. Please try again.");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleUpload,
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg w-full grid gap-4">
      <CustomHeader
        title="Bulk Dependent ABSSIN"
        desc="Create Bulk ABSSIN for dependents"
      />
      <div
        onClick={downloadCSV}
        className="border-2 border-green-400 bg-green-100 p-4 rounded-lg flex items-center gap-2 my-0 md:my-4 cursor-pointer"
      >
        <TbFileDownload className="text-5xl text-green-500" />
        <p className="text-xs text-green-600">
          Click here to download the example CSV file for bulk upload of
          dependent ABSSIN
        </p>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition
          border-blue-500 bg-blue-100
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="block cursor-pointer">
          {dragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <p className="text-gray-600 flex flex-col items-center justify-center">
              <TbCloudUpload className="text-4xl text-blue-500 " />
              <br />
              Drag & drop a CSV file here, or click to select one. Only .csv
              files are allowed.
            </p>
          )}
        </label>
      </div>

      {file && (
        <p className="mt-2 text-sm text-green-600">
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      <Button
        onClick={() => mutate()}
        text={isPending ? "Creating Bulk ABSSIN..." : "Create Bulk ABSSIN"}
        loading={isPending}
        disabled={isPending || !file}
      />

      <CustomDialog
        id="createInfantABSSINDialog"
        onClose={() =>
          (
            document.getElementById(
              "createInfantABSSINDialog"
            ) as HTMLDialogElement
          )?.close()
        }
      >
        <div className="flex gap-1 items-center justify-center flex-col text-center">
          <TbRosetteDiscountCheckFilled className="text-green-600 text-7xl" />
          <h1 className="text-lg font-semibold">Created Successfully</h1>
          <p className="text-xs md:text-sm text-gray-400 max-w-[14rem]">
            You have successfully created {totalRecords} Infant ABSSINs
          </p>
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            <CancelButton link={"/identity"} />
            <Button
              text="Create New"
              onClick={() => {
                (
                  document.getElementById(
                    "createInfantABSSINDialog"
                  ) as HTMLDialogElement
                )?.close();
              }}
            />
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default FileUpload;
