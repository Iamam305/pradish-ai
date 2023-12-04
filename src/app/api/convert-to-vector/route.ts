import { envConf } from "@/config/envConfig";
import { s3 } from "@/config/s3Config";
import { UploadFile } from "@/models/uploadedFileModel";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { downloadFromS3 } from "@/lib/helper/downloadS3";
import {
  embedDocument,
  getPineconeClient,
  prepareDocument,
} from "@/lib/helper/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { connectDB } from "@/config/dbConfig";

connectDB()
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    } else {
      const { fileId } = await req.json();
      const uploadedFile = await UploadFile.findOne({
        _id: fileId,
        userId: userId,
      });
      if (!uploadedFile) {
        return NextResponse.json({ error: "file not found" }, { status: 404 });
      } else {
        const fileName = await downloadFromS3(uploadedFile.fileKey);
        if (!fileName) {
          return NextResponse.json(
            { error: "could not download from s3" },
            { status: 400 }
          );
        } else {
          const client = await createClient(
            envConf.supabseUri,
            envConf.supabaseSecret
          );
          console.log("loading pdf into memory" + fileName);
          const chunk = await new PDFLoader(fileName).loadAndSplit(
            new CharacterTextSplitter({
              chunkSize: 5000,
              chunkOverlap: 100,
              separator: " ",
            })
          );
          const openAIEmbedding = await new OpenAIEmbeddings({
            openAIApiKey: envConf.openAiKey,
            modelName: "text-embedding-ada-002",
          });
          const vectorEmbbeddings = await SupabaseVectorStore.fromDocuments(
            chunk,
            openAIEmbedding,
            {
              client,
              tableName: "documents",
            }
          );
          console.log(vectorEmbbeddings);
          const updatedFile = await UploadFile.findByIdAndUpdate(
             uploadedFile._id,
           { fileLocation: fileName } 
          );
          return NextResponse.json(
            { chunk, vectorEmbbeddings, updatedFile },
            { status: 200 }
          );
        }
      }
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
