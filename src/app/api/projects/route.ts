import { connectDB } from "@/config/dbConfig";
import { UploadFile } from "@/models/uploadedFileModel";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const projects = await UploadFile.find({ userId });
    if (projects) {
      return NextResponse.json({ projects }, { status: 200 });
    } else {
      return NextResponse.json({ error: "no project found" }, { status: 404 });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
