"use client";
import React, { useRef, useState } from "react";
function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
}
const Page = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<any>([]);
  const chatContainerRef = useRef<HTMLUListElement>();
  const ref = useChatScroll(chats);

  async function sendQuery(e: any) {
    e.preventDefault();
    if (!query) return;

    try {
      setChats((value: any) => [...value, { type: "user", content: query }]);
      setLoading(true);
      const result = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(query),
      });
      setQuery("");
      const json = await result.json();
      // setResult(json.data);
      setLoading(false);
      setChats((value: any) => [...value, { type: "bot", content: json.data }]);
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    }
  }
  return (
    <main className="flex flex-col items-center justify-between ">
      {/* <button onClick={createIndexAndEmbeddings}>Create index and embeddings</button> */}
      <div className="container mx-auto">
        <div className="max-w-2xl border rounded">
          <div>
            <div className="w-full">
              <div className="relative flex items-center p-3 border-b border-gray-300">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src="https://iili.io/JztTzwF.png"
                  alt="Bot"
                />
                <span className="block ml-2 font-bold text-gray-600">Ai✨</span>
                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
              </div>
              <div
                className="relative w-full p-3 overflow-y-auto h-[20rem]"
                ref={ref}
              >
                <ul className="space-y-2">
                  {chats?.map((chat: any, i: any) => (
                    <div key={i}>
                      {chat.type == "bot" ? (
                        <>
                          <li className="flex justify-start">
                            <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                              <span className="block">{chat.content}</span>
                            </div>
                          </li>
                        </>
                      ) : chat.type == "user" ? (
                        <>
                          <li className="flex justify-end">
                            <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                              <span className="block">{chat.content}</span>
                            </div>
                          </li>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {loading ? (
                    <li className="flex justify-start">
                      <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow text-xs">
                        typing...
                      </div>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
              <form
                onSubmit={sendQuery}
                className="flex items-center justify-between w-full p-3 border-t border-gray-300"
              >
                <input
                  type="text"
                  placeholder="Message"
                  className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  name="message"
                  required
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  value={query}
                />

                <button type="submit" disabled={loading}>
                  <svg
                    className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
