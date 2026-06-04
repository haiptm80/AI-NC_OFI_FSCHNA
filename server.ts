import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for large Excel files
  app.use(express.json({ limit: "50mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { summary } = req.body;
      if (!summary) {
        return res.status(400).json({ error: "Missing summary payload" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Bạn là một Chuyên gia Đào tạo QA/FQA của FPT Education.
Yêu cầu trọng tâm của User: "${summary.userRequirement}"

Hãy tuân thủ KHUNG TƯ DUY KWSR sau đây khi phân tích:
• K - Knowledge (Bối cảnh & Kiến thức): Dữ liệu NC/OFI của FSCHNA qua các giai đoạn. Các phòng ban trọng yếu: Đào tạo, CTHS, Tuyển sinh, Văn phòng. Phương pháp phân tích áp dụng: Nguyên lý Pareto (80/20), Phân tích nguyên nhân gốc rễ (RCA), 5-Whys.
• W - Workflow (Luồng công việc): Tổng hợp số liệu → Phân tích xu hướng → Cắt lớp dữ liệu (phòng ban & nhóm lỗi) → Tìm nguyên nhân gốc rễ → Đề xuất hành động khắc phục (CAPA) và phòng ngừa.
• S - Strategy (Chiến lược báo cáo): Đi từ Tổng quan đến Chi tiết. Tập trung vào "Nhóm thiểu số trọng yếu" (Vital Few) gây ra 80% rủi ro (Pareto). Biến dữ liệu thành "câu chuyện chất lượng" dễ hiểu để Ban Giám Hiệu ra quyết định. Tập trung TRỌNG TÂM vào yêu cầu của user.
• R - Rules (Nguyên tắc & Tiêu chuẩn): Khách quan, không đổ lỗi cá nhân (blame-free). Văn phong điều hành, súc tích bằng tiếng Việt.

Đây là bản tóm tắt số liệu từ hệ thống (đã làm sạch):
${JSON.stringify(summary, null, 2)}

Hãy viết một báo cáo phân tích theo yêu cầu trọng tâm của User (Khoảng 200 - 400 từ) dạng Markdown.
Nếu User chỉ định phân tích rủi ro, hãy bỏ qua các phần khác để tập trung vào Rủi ro.
Nếu User chỉ định phân tích xu hướng, hãy phân tích xu hướng theo thời gian.
Cấu trúc linh hoạt dựa án theo yêu cầu trọng tâm, định dạng trực quan. LƯU Ý: Không bịa số liệu. Dựa sát vào 'summary' được cung cấp. Nếu dữ liệu quá ít, hãy nêu rõ giới hạn.
`;

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      let errorMessage = error.message || "Failed to analyze data";
      
      let isRateLimit = false;
      if (error.status === 429 || errorMessage.includes('429') || errorMessage.includes('Quota exceeded') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        isRateLimit = true;
      } else {
        try {
          const parsed = JSON.parse(errorMessage);
          if (parsed.error && parsed.error.message && parsed.error.message.includes('Quota exceeded')) {
            isRateLimit = true;
          }
        } catch(e) {}
      }

      let statusCode = 500;
      if (isRateLimit) {
        console.log("AI Analysis rate limit reached (429).");
        errorMessage = "Hệ thống đang xử lý quá nhiều yêu cầu phân tích AI cùng lúc (Quota exceeded - Error 429). Vui lòng chờ khoảng 1 phút rồi thử lại sau.";
        statusCode = 429;
      } else {
        console.error("Analysis error:", error);
      }

      if (error.status === 503 || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
        errorMessage = "Máy chủ AI hiện đang bị quá tải (API 503). Vui lòng thử lại sau ít phút.";
        statusCode = 503;
      }
      
      if (res.headersSent) {
        res.write("\n\n[Lỗi: " + errorMessage + "]");
        res.end();
      } else {
        res.status(statusCode).json({ error: errorMessage });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
