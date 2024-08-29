import { read, utils } from "@e965/xlsx";
import { NextRequest, NextResponse } from "next/server";
import { generateData } from "../_actions/uploadData";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const allowedExtensions = [".xlsx", ".xls"];

    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Only Excel files are allowed." },
        { status: 400 },
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Read the Excel file from the ArrayBuffer
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(sheet);

    await generateData(data);

    return NextResponse.json(
      {
        message: "File processed successfully",
        rowCount: data.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 },
    );
  }
}
