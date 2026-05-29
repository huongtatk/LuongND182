/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the GoogleGenAI instance dynamically (lazy evaluation)
function getAIClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === "MY_GEMINI_API_KEY" || currentKey.includes("YOUR_") || currentKey === "undefined" || currentKey === "null") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    const currentKey = process.env.GEMINI_API_KEY;
    const isConfigured = !!(currentKey && currentKey !== "MY_GEMINI_API_KEY" && !currentKey.includes("YOUR_") && currentKey !== "undefined" && currentKey !== "null");
    res.json({ status: "ok", apiKeyConfigured: isConfigured });
  });

  // API Route - AI Consultant/Chat with Gemini
  app.post("/api/consult", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Yêu cầu cung cấp câu hỏi." });
      }

      const activeAI = getAIClient();
      if (!activeAI) {
        // Fallback responsive instructions if API key is not configured yet
        return res.json({
          text: `[Chế độ dự phòng] Cửa sổ tư vấn lương hoạt động bình thường, tuy nhiên bạn cần cấu hình khóa API (GEMINI_API_KEY) trong mục Secrets (Cài đặt) để trò chuyện thực tế với AI. \n\nDưới đây là thông tin chung về Nghị định 182/2026/NĐ-CP:\n- Mức lương cơ sở mới đề xuất là 2.340.000 VNĐ (Có thêm quyền chọn tăng 8% lên 2.527.200 VNĐ).\n- Các phụ cấp chính bao gồm: Phụ cấp ưu đãi nghề (ví dụ 35% cho giáo viên/y tế cơ sở), Phụ cấp công vụ (25% cho công chức hành chính), Phụ cấp chức vụ (tính lũy kế trực tiếp vào lương hệ số), và Phụ cấp thâm niên nghề (giáo viên, quân đội, công an sau 5 năm công tác).`
        });
      }

      const systemInstruction = `Bạn là "Trợ lý Lương Công Chức" - một chuyên gia tư vấn luật cán bộ, công chức, viên chức Việt Nam và các nghị định điều chỉnh cải cách tiền lương mới nhất (Nghị định 182/2026/NĐ-CP và Nghị định 73/2024/NĐ-CP).
Hãy đưa ra các giải đáp khách quan, đầy đủ, chuyên nghiệp, súc tích bằng tiếng Việt.
Thông tin trọng tâm:
1. Mức lương cơ sở tăng từ 1.800.000đ lên 2.340.000đ đóng vai trò là nền tảng tính lương hệ số kể từ cải cách mới nhất (chính thức từ đợt cải cách lương).
2. Công thức tính lương cơ bản: Hệ số lương x Lương cơ sở (2.340.000 VNĐ).
3. Các khoản phụ cấp:
   - Phụ cấp ưu đãi nghề: 30% - 50% tùy cấp học, lĩnh vực (ví dụ nghề giáo mầm non thường hưởng 35%, nghề y tế cơ sở lên tới 40% - 100%).
   - Phụ cấp thâm niên: Chỉ áp dụng cho một số ngành như giáo dục, quân đội, công an, tòa án... tính sau 5 năm công tác (mức khởi điểm là 5%, sau đó mỗi năm tăng thêm 1%).
   - Phụ cấp công vụ: Áp dụng cho công chức hành chính quản lý nhà nước ở mức 25%.
   - Bảo hiểm bắt buộc: Trừ 10.5% tính trực tiếp từ tiền lương theo hệ số (BHXH 8%, BHYT 1.5%, BHTN 1%).
Câu trả lời của bạn nên định dạng đẹp bằng Markdown để dễ đọc, trình bày rõ ràng, thân thiện với các công chức, giáo viên, bác sĩ.`;

      // Structure contents with history for full chat context
      const contents = [];
      
      // Map previous history if provided
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      }
      
      // Append current message
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const response = await activeAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      let errorMsg = error.message || "Lỗi xử lý tư vấn lương.";
      if (errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("API key not valid") || errorMsg.includes("not authorized")) {
        errorMsg = "Khóa API Gemini không đúng hoặc không hợp lệ. Vui lòng kiểm tra lại cấu hình GEMINI_API_KEY trong Settings > Secrets.";
      }
      res.status(500).json({ error: errorMsg });
    }
  });

  // Integration of Vite development middleware or production static build
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
