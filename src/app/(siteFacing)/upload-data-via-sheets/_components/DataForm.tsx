"use client";

import React, { FormEvent, useState, useTransition, ChangeEvent } from "react";
import XLSX from "@e965/xlsx";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { generateOrUpdateData, ProductData } from "../_actions/uploadData";

export default function DataForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const processExcel = async (file: File): Promise<ProductData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData = (jsonData as any[]).map((row) => ({
          name: row.name || "",
          body: row.body || "",
          price: row.price,
          newPrice: row.newPrice,
          quantity: row.quantity,
          category: row.category,
          brand: row.brand,
          productType: row.productType,
          options: row.options,
          offerStartsAt: row.offerStartsAt,
          offerEndsAt: row.offerEndsAt,
          productImage: row.productImage || "",
          brandImage: row.brandImage || "",
          categoryImage: row.categoryImage || "",
          description: row.description,
        }));

        resolve(processedData as ProductData[]);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    startTransition(async () => {
      try {
        setMessage("Processing file...");
        const processedData = await processExcel(file);
        setMessage("Uploading products...");
        await generateOrUpdateData(processedData);
        setMessage("Products uploaded successfully!");
      } catch (error) {
        console.error("Error processing file:", error);
        setMessage("Error processing file. Please try again.");
      }
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0];
    setFile(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0] || null;
    setFile(selectedFile);
  };

  return (
    <div>
      {!pending ? (
        <form onSubmit={handleSubmit}>
          <section className="drag-drop">
            <div
              className={`document-uploader ${
                file && file?.size > 0 ? "upload-box active" : "upload-box"
              }`}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              <div className="upload-info">
                <AiOutlineCloudUpload />
                <div>
                  <p>Drag and drop your files here</p>
                  <p>Supported file: .XLSX</p>
                </div>
              </div>
              <input
                type="file"
                name="file"
                hidden
                id="browse"
                onChange={handleFileChange}
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              />
              <label htmlFor="browse" className="browse-btn mb-4">
                Browse files
              </label>
              {file && file?.size > 0 && (
                <div className="file-list">
                  <div className="file-list__container">
                    <div className="file-item">
                      <div className="file-info">
                        <p>{file.name}</p>
                        <p>{file.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {file && file?.size > 0 && (
                <div className="success-file">
                  <AiOutlineCheckCircle
                    style={{ color: "#6DC24B", marginRight: 1 }}
                  />
                </div>
              )}
            </div>
          </section>
          <div className="mt-4">
            <Button className="w-full" type="submit">
              Upload
            </Button>
          </div>
        </form>
      ) : (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-200">
          <Loader2 className="size-24 animate-spin text-rayanPrimary-dark" />
        </div>
      )}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
