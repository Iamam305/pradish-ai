// Import necessary modules and dependencies
import { envConf } from "@/config/envConfig";
import { UploadFile } from "@/models/uploadedFileModel";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore,
} from "langchain/vectorstores/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { connectDB } from "@/config/dbConfig";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { combineDocuments, formatMessage } from "@/lib/helper/utils";
import { Chat } from "@/models/chat-model";
import {
  Message,
  OpenAIStream,
  StreamingTextResponse,
  LangChainStream,
} from "ai";
import mongoose from "mongoose";
// Connect to the database

// export const runtime = "edge";
connectDB();

export async function POST(req: NextRequest) {
  try {
    // Extract required data from the request body
    const { query, fileId, chat, messages } = await req.json();
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    // Find the uploaded file by ID
    const uploadedFile = await UploadFile.findById(
      new mongoose.Types.ObjectId(fileId)
    );

    // If the file is not found, return a 404 response
    if (!uploadedFile) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    } else {
      const { handlers, writer } = LangChainStream();
      // Initialize OpenAIEmbeddings and Supabase client
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: envConf.openAiKey,
      });
      const client = createClient(envConf.supabseUri, envConf.supabaseSecret);

      // Initialize SupabaseVectorStore with specified parameters
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
      });

      // Define a filter function for Supabase based on the file's metadata
      const funcFilterFile: SupabaseFilterRPCCall = (rpc) =>
        rpc.filter("metadata->>source", "eq", uploadedFile.fileLocation);

      // Create a retriever using the vector store and filter function
      const retriever = vectorStore.asRetriever(1, funcFilterFile);

      // Initialize ChatOpenAI instance
      const llm = new ChatOpenAI({
        openAIApiKey: envConf.openAiKey,
        streaming: true,
        temperature: 0,
      });

      // Define a template for standalone questions
      const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
        conversation history: {chat_history}
        question: {question} 
        standalone question:`;

      // Create a prompt using the template
      const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
        standaloneQuestionTemplate
      );

      // Create a pipeline for standalone question processing
      const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm)
        .pipe(new StringOutputParser());

      // Define a template for AI assistant responses
      const answerTemplate = `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI can perform mathmetical opration on data based on the CONTEXT BLOCK provided 
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will not tell users about itself.

      context: {context}
      question: {question}
      answer:`;
      const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

      // Create a retriever chain for retrieving relevant context
      const retrieverChain = RunnableSequence.from([
        (prevResult) => prevResult.standalone_question,
        retriever,
        combineDocuments,
      ]);

      // Create a pipeline for processing answers
      const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

      // Create a sequence of runnables to process the overall question
      const chain = RunnableSequence.from([
        {
          standalone_question: standaloneQuestionChain,
          original_input: new RunnablePassthrough(),
        },
        {
          context: retrieverChain,
          question: ({ original_input }) => original_input.question,
        },
        answerChain,
      ]);

      // Invoke the chain with the provided question
      // const response = await chain.invoke({
      //   question: query,
      // });

      const stream = await chain.stream(
        {
          chat_history: formattedPreviousMessages.join("\n"),
          question: currentMessageContent,
        },
        {}
      );
      return new StreamingTextResponse(stream);
      // Return the response as JSON with a 200 status
      // return NextResponse.json({ response }, { status: 200 });
    }
  } catch (error) {
    // Handle any errors and return a 500 status response
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
