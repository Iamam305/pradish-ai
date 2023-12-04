import { connectDB } from "@/config/dbConfig";
import { s3 } from "@/config/s3Config";
import { UploadFile } from "@/models/uploadedFileModel";

import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;
    console.log(file);

    if (
      !file ||
      file.size > 10 * 1024 * 1024 ||
      file.type !== "application/pdf"
    ) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    const fileKey =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    const params = {
      Bucket: process.env.SPACE_BUCKET_NAME!,
      Key: fileKey,
      Body: (await file.arrayBuffer()) as Buffer,
    };
    const upload = await s3.putObject(params);
    const newFile = new UploadFile({
      fileKey,
      fileName: file.name,
      fileType: file.type,
      userId,
    });
    const savedFile = await newFile.save();

    return NextResponse.json({ savedFile, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
