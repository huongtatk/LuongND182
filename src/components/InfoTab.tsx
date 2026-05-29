/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, BookOpen, KeyRound, Sparkles, AlertCircle } from "lucide-react";

// Inline simple custom markdown renderer for bold, bullet points, and paragraphs
function CustomMarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  
  return (
    <div className="space-y-2 text-sm text-gray-700 leading-relaxed font-normal">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // Render headings
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="font-bold text-gray-800 text-sm mt-3 border-l-2 border-blue-900 pl-2">
              {parseBold(trimmed.replace(/^###\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="font-extrabold text-[#003b5a] text-base mt-4 border-b border-gray-100 pb-1">
              {parseBold(trimmed.replace(/^##\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="font-extrabold text-[#003b5a] text-lg mt-5 border-b border-gray-200 pb-1">
              {parseBold(trimmed.replace(/^#\s*/, ""))}
            </h2>
          );
        }

        // Render bullet lists
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              <li className="list-item">
                {parseBold(trimmed.replace(/^[-*]\s*/, ""))}
              </li>
            </ul>
          );
        }

        // Plain line or blank
        if (trimmed === "") {
          return <div key={idx} className="h-1" />;
        }

        return <p key={idx}>{parseBold(line)}</p>;
      })}
    </div>
  );
}

// Function to replace **text** with bold tags
function parseBold(text: string) {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
    }
    return part;
  });
}

const PRESET_QUESTIONS = [
  "Nghị định 182/2026/NĐ-CP dự kiến có từ bao giờ và có gì nổi bật?",
  "Tôi giảng dạy 8 năm thâm niên giáo viên, cách tính lương thế nào?",
  "Ai được hưởng phụ cấp thâm niên nghề?",
  "Cách tính các khoản khấu trừ bảo hiểm bắt buộc?"
];

export default function InfoTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! Tôi là Trợ lý Lương Công Chức. Bạn có câu hỏi nào về Dự thảo cải cách tiền lương mới, Nghị định 182/2026/NĐ-CP hoặc cách tính các khoản phụ cấp không? Hãy hỏi tôi nhé!",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Gather last 4 messages to send as history for context
      const chatHistory = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: textToSend,
          history: chatHistory
        })
      });

      if (!res.ok) {
        let errMsg = "Không thể kết nối với máy chủ tư vấn.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.text || "Xin lỗi, máy chủ tư vấn gặp trục trặc.",
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: `⚠️ Đã xảy ra lỗi kết nối: ${err.message || "Vui lòng kiểm tra lại cấu hình khóa API trong Secrets."}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="info-tab-view">
      {/* 1. Policy Summary Dashboard */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-blue-900" style={{ color: "#1A5276" }}>
          <BookOpen className="w-5 h-5 stroke-[2.5]" />
          <h2 className="font-extrabold text-sm md:text-base tracking-wider uppercase">
            Cải Cách Tiền Lương Nghị Định 182
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl space-y-1">
            <h3 className="font-bold text-gray-800 text-sm">Lương cơ sở mới</h3>
            <p className="text-xs text-blue-900 font-extrabold">2.340.000 VNĐ</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Mức lương cơ bản dùng để nhân hệ số lương áp dụng chung từ ngày ban hành cải cách. 
            </p>
          </div>

          <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl space-y-1">
            <h3 className="font-bold text-gray-800 text-sm">Phụ cấp cải tổ</h3>
            <p className="text-xs text-blue-900 font-extrabold">Tinh gọn 9 nhóm</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Sắp xếp lại các phụ cấp ưu đãi nghề, công vụ, khu vực, thâm niên để phản ánh đúng khối lượng công việc.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-90 *0 shrink-0 pt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Các chế độ nâng lương thường xuyên, phụ cấp kiêm nhiệm và phụ cấp chức vụ lãnh đạo được tính đồng bộ từ hệ số lương để đảm bảo lợi ích cao nhất cho nhà giáo, bác sĩ, công chức đại diện nhân dân.
          </p>
        </div>
      </section>

      {/* 2. Interactive AI Assistant Section */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Chat header */}
        <div className="bg-blue-900 px-4 py-4 flex items-center justify-between text-white" style={{ backgroundColor: "#003b5a" }}>
          <div className="flex items-center gap-2">
            <div className="bg-cyan-700 p-1.5 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý Lương Công Chức AI</h3>
              <p className="text-[10px] text-gray-300">Tự động hóa tư vấn hành chính công cấp cao</p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse uppercase">
            Trực tuyến
          </span>
        </div>

        {/* Chat Messages flow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => {
            const isBot = message.sender === "bot";
            return (
              <div
                key={message.id}
                className={`flex gap-2.5 items-start ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center border border-blue-200 shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs border text-xs leading-relaxed ${
                    isBot
                      ? "bg-white text-gray-700 border-gray-100 rounded-tl-xs"
                      : "bg-[#003b5a] text-white border-blue-900 rounded-tr-xs"
                  }`}
                >
                  {isBot ? (
                    <CustomMarkdownRenderer text={message.text} />
                  ) : (
                    <p className="font-normal select-text whitespace-pre-wrap">{message.text}</p>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#003b5a] text-white flex items-center justify-center border border-blue-900 shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-2.5 items-start justify-start">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center border border-blue-200 shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-150 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-blue-950 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-blue-950 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-blue-950 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Questions capsule suggestions */}
        <div className="p-3 border-t border-gray-100 bg-white space-y-2">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">CÓ THỂ BẠN QUAN TÂM:</p>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin select-none">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-full border border-gray-200 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input line */}
        <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Hỏi trợ lý về Nghị định 182, thâm niên..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputText);
            }}
            disabled={loading}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 transition-colors focus:outline-hidden focus:border-blue-900 focus:bg-white"
            id="chat-text-input"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            className="bg-blue-900 hover:bg-blue-950 text-white p-3 rounded-xl transition-all flex items-center justify-center shadow-md cursor-pointer disabled:opacity-40 disabled:scale-100 active:scale-95"
            id="chat-send-btn"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
