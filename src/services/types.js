// src/services/types.js
// ⚙️ API 베이스 URL & 유틸 함수 모음

// ✅ Vite & CRA 공통 환경변수 처리
const viteEnv = (typeof import.meta !== "undefined" && import.meta.env) || {};

export const API_BASE =
  viteEnv.VITE_API_BASE_URL ||
  (typeof process !== "undefined"
    ? process.env.REACT_APP_API_BASE_URL
    : undefined) ||
  "ws://localhost:8000/ws"; 

// ✅ WebSocket URL (필요하면 .env에서 덮어쓰기)
export const WS_URL =
  viteEnv.VITE_WS_URL ||
  (typeof process !== "undefined"
    ? process.env.REACT_APP_WS_URL
    : undefined) ||
  "ws://localhost:8000/ws/sensor"; 

// ===============================
// REST API: 알람 히스토리 조회
// ===============================
export async function fetchAlertHistory(limit = 100) {
  const res = await fetch(`${API_BASE}/api/alerts/history?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to load alerts: ${res.status}`);
  }

  const data = await res.json();

  // 🔧 백엔드가 배열이 아니라 객체를 줄 수도 있으니 안전하게 정규화
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.alerts)) return data.alerts;
  if (Array.isArray(data.data)) return data.data;

  console.warn("[alerts] Unexpected history payload shape:", data);
  return [];
}

// ===============================
// 알람 데이터 정규화
// ===============================
export const normalizeAlert = (a) => {
  const safeId =
    a.id ??
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `alert_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  const ts =
    a.ts instanceof Date
      ? a.ts
      : a.ts
      ? new Date(a.ts)
      : new Date();

  return {
    id: safeId,
    level: a.level ?? "info",
    message: a.message ?? "",
    llm_summary: a.llm_summary ?? null,
    source: a.source ?? "edge",
    ts,
  };
};

// ===============================
// 최신순 정렬
// ===============================
export const byNewest = (a, b) => b.ts.getTime() - a.ts.getTime();
