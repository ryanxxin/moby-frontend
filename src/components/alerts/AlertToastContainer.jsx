import React from "react";
import AlertToast from "./AlertToast";

export default function AlertToastContainer({ alerts, removeToast }) {
  const containerStyle = {
    position: "fixed",
    top: "30px",
    right: "30px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    pointerEvents: "none",
  };

  return (
    <div style={containerStyle}>
      {alerts.map((toast) => (
        <AlertToast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
