// src/components/alerts/AlertToast.jsx
import React, { useEffect, useState } from "react";

export default function AlertToast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1) 처음 등장할 때 Fade-in
    setVisible(true);

    // 2) 10초 동안 보이다가 Fade-out 시작
    const timer = setTimeout(() => {
      handleClose();
    }, 10000); // 10초

    return () => clearTimeout(timer);
  }, [toast.id]);

  const handleClose = () => {
    // 이미 사라지는 중이면 무시
    if (!visible) return;
    // Fade-out 시작
    setVisible(false);
    // 애니메이션(0.45초) 끝난 뒤 리스트에서 제거
    setTimeout(() => onClose(toast.id), 450);
  };

  // level별 색상
  const levelColors = {
    info:    { bg: "#e8f4ff", fg: "#0a66c2", border: "#bfe0ff" },
    warning: { bg: "#fff8e1", fg: "#b26a00", border: "#ffe082" },
    error:   { bg: "#ffebee", fg: "#c62828", border: "#ffcdd2" },
    critical:{ bg: "#ffebee", fg: "#b71c1c", border: "#ffcdd2" },
  };

  const c = levelColors[toast.level] ?? levelColors.info;

  return (
    <div
      style={{
        transition: "all 0.45s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(-12px)",
        padding: "14px 18px",
        minWidth: "280px",
        borderRadius: "10px",
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        fontSize: "14px",
        fontWeight: 500,
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        pointerEvents: "auto",
      }}
    >
      {/* 레벨 표시 / 아이콘 느낌 */}
      <div style={{ fontSize: 18, marginTop: -2 }}>
        {toast.level === "warning" && "⚠️"}
        {toast.level === "error" && "❌"}
        {toast.level === "critical" && "🔥"}
        {toast.level === "info" && "ℹ️"}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>
          {toast.level.toUpperCase()}
        </div>
        <div>{toast.message}</div>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        style={{
          background: "transparent",
          border: "none",
          color: c.fg,
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
        }}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}
