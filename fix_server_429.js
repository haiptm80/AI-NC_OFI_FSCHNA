import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(error\.status === 503 \|\| errorMessage\.includes\('503'\) \|\| errorMessage\.includes\('UNAVAILABLE'\)\) \{[\s\S]*?\}/;

const newCatch = `if (error.status === 503 || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
        errorMessage = "Máy chủ AI hiện đang bị quá tải (API 503). Vui lòng thử lại sau ít phút.";
      } else if (error.status === 429 || errorMessage.includes('429') || errorMessage.includes('Quota exceeded') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "Hệ thống đang xử lý quá nhiều yêu cầu phân tích AI cùng lúc (Quota exceeded - Error 429). Vui lòng chờ khoảng 1 phút rồi thử lại sau.";
      } else {
         try {
             const parsed = JSON.parse(errorMessage);
             if (parsed.error && parsed.error.message && parsed.error.message.includes('Quota exceeded')) {
                 errorMessage = "Hệ thống đang xử lý quá nhiều yêu cầu phân tích AI cùng lúc (Quota exceeded - Error 429). Vui lòng chờ khoảng 1 phút rồi thử lại sau.";
             }
         } catch(e) {}
      }`;

content = content.replace(regex, newCatch);

fs.writeFileSync('server.ts', content);
