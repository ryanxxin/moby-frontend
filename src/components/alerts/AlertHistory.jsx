// src/components/alerts/AlertHistory.jsx

import React from "react";

// 레벨별 색상
const levelColors = {
  info: "blue",
  warning: "orange",
  error: "red",
  critical: "darkred",
  default: "#333",
};

export default function AlertHistory({ items, wsStatus }) {
  const wsColor = wsStatus ? "green" : "red";
  const wsText = wsStatus ? "🟢 실시간" : "🔴 끊김";

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          fontWeight: 700,
          background: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>🚨 Alert History</span>
        <span
          style={{
            fontSize: "12px",
            color: wsColor,
            fontWeight: "bold",
          }}
        >
          {wsText}
        </span>
      </div>

      <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#fcfcfc", textAlign: "left" }}>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                Time
              </th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                Level
              </th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                Message
              </th>
              <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                LLM
              </th>
            </tr>
          </thead>
          <tbody>
            {(!items || items.length === 0) ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: 10,
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  알람 기록 없음
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id}>
                  <td
                    style={{
                      padding: 10,
                      borderBottom: "1px solid #f2f2f2",
                    }}
                  >
                    {a.ts?.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      borderBottom: "1px solid #f2f2f2",
                      color: levelColors[a.level] ?? levelColors.default,
                    }}
                  >
                    {a.level}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      borderBottom: "1px solid #f2f2f2",
                    }}
                  >
                    {a.message}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      borderBottom: "1px solid #f2f2f2",
                      opacity: 0.85,
                    }}
                  >
                    {a.llm_summary ? "✅" : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
