// src/App.jsx

import React, { useState, useEffect, useCallback } from "react";

// 서비스 및 유틸리티
import { fetchAlertHistory, normalizeAlert, byNewest, WS_URL } from "./services/types";

// UI 컴포넌트
import AlertHistory from "./components/alerts/AlertHistory";
import AlertBanner from "./components/alerts/AlertBanner";
import AlertToastContainer from "./components/alerts/AlertToastContainer";
import GrafanaEmbed from "./components/GrafanaEmbed";

function App() {
  const [alertHistory, setAlertHistory] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [toastAlerts, setToastAlerts] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  const removeToast = useCallback((id) => {
    setToastAlerts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1) 초기 알람 이력 로드
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await fetchAlertHistory();
        const normalizedHistory = historyData.map(normalizeAlert).sort(byNewest);
        if (normalizedHistory.length > 0) setCurrentAlert(normalizedHistory[0]);
        setAlertHistory(normalizedHistory);
      } catch (error) {
        console.error("Failed to load initial alert history:", error);
      }
    };

    loadHistory();
  }, []);

  // 2) WebSocket 연결
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setWsConnected(true);
      console.log("[WS] connected");
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log("[WS] disconnected");
    };

    ws.onerror = (e) => console.error("WS Error:", e);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message?.type === "alert" && message.payload) {
          const newAlert = normalizeAlert(message.payload);
          setAlertHistory((prev) => [newAlert, ...prev]);
          setCurrentAlert(newAlert);
          setToastAlerts((prev) => [...prev, newAlert].slice(0, 5));
        }
      } catch (e) {
        console.error("Error parsing WS message:", e);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="app-layout" style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <AlertToastContainer alerts={toastAlerts} removeToast={removeToast} />

      <header style={{ marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h1>MOBY 대시보드</h1>
        <p>WebSocket 상태: {wsConnected ? "🟢 연결됨" : "🔴 연결 끊김"}</p>
      </header>

      <main>
        {currentAlert && <AlertBanner alert={currentAlert} />}

        <div style={{ display: "flex", gap: "40px", marginTop: "20px", alignItems: "flex-start" }}>
          <AlertHistory items={alertHistory} wsStatus={wsConnected} />

          <div style={{ flexGrow: 1, minHeight: 200 }}>
            <GrafanaEmbed url={import.meta.env.VITE_GRAFANA_EMBED_URL} height={520} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
