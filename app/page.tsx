"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `ERROR: ${data.error}`,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.result,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `ERROR: ${String(error)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-4xl flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-2">
          🌍 Language Learning AI Tutor
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Belajar bahasa dengan bantuan AI
        </p>

        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[75vh]">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-400 mt-20">
                Mulai percakapan dengan AI...
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {msg.role === "assistant" ? (
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  🤖 Sedang berpikir...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan..."
                rows={3}
                className="flex-1 border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-black text-white font-semibold disabled:opacity-50"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}