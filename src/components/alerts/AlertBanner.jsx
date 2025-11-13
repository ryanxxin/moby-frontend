// src/components/alerts/AlertBanner.jsx

import React from "react";

const colors = {
  info:    { bg: "#e8f4ff", fg: "#0a66c2", border: "#bfe0ff" },
  warning: { bg: "#fff6e5", fg: "#b26a00", border: "#ffe1b8" },
  error:   { bg: "#ffebee", fg: "#c62828", border: "#ffcdd2" }, // critical 대신 error 사용
  critical:{ bg: "#ffebee", fg: "#c62828", border: "#ffcdd2" },
};

export default function AlertBanner({ alert }) {
  if (!alert) return null;

  // level이 colors 객체에 없으면 info를 기본값으로 사용
  const c = colors[alert.level] ?? colors.info;

  return (
    <div
      style={{
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {alert.level.toUpperCase()} • {alert.ts?.toLocaleString()}
      </div>
      <div style={{ fontSize: 15 }}>{alert.message}</div>

      {/* LLM 요약 */}
      {alert.llm_summary && (
        <div
          style={{
            marginTop: 10,
            fontStyle: "italic",
            opacity: 0.9,
            paddingTop: "8px",
            borderTop: `1px solid ${c.border}`,
          }}
        >
          AI 요약: {alert.llm_summary}
        </div>
      )}
    </div>
  );
}
