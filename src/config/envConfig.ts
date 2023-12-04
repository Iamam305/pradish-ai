export const envConf = {
  dbUri: process.env.DB_URI! || "",
  openAiKey: process.env.OPENAI_API_KEY || "",
  doSpaceKey: process.env.SPACES_KEY || "",
  doSpaceSecret: process.env.SPACES_SECRET || "",
  doSpaceBucket: process.env.SPACE_BUCKET_NAME || "",
  doSpaceEndPoint: process.env.SPACE_END_POINT || "",
  pineconeEnv: process.env.PINECONE_ENVIRONMENT || "",
  pineconeKey: process.env.PINECONE_API_KEY || "",
  supabseUri: process.env.SUPABASE_URI || "",
  supabaseSecret: process.env.SUPABSE_SECRET_KEY || "",
};
