import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
export function combineDocuments(docs: any[]){
  return docs.map((doc)=>doc.pageContent).join('\n\n')
}

export const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};