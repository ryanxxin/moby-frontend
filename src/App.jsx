// src/App.jsx (최종본)

import React, { useState, useEffect, useCallback } from "react";

// 서비스 및 유틸리티
import {
  fetchAlertHistory,
  normalizeAlert,
  byNewest,
  WS_URL,
} from "./services/types";

// UI 컴포넌트
import AlertHistory from "./components/alerts/AlertHistory";
import AlertBanner from "./components/alerts/AlertBanner";
import AlertToastContainer from "./components/alerts/AlertToastContainer";

function App() {
  const [alertHistory, setAlertHistory] = useState([]); // 전체 히스토리
  const [currentAlert, setCurrentAlert] = useState(null); // 상단 배너용 최신 알람
  const [toastAlerts, setToastAlerts] = useState([]); // 토스트 큐
  const [wsConnected, setWsConnected] = useState(false); // WS 연결 상태

  // 토스트 제거
  const removeToast = useCallback((id) => {
    setToastAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // --- 1. 초기 알람 히스토리 로딩 (REST API) ---
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await fetchAlertHistory();

        // 여기서 historyData는 항상 "배열"이 되도록 types.js에서 정규화했음
        const normalizedHistory = historyData
          .map(normalizeAlert)
          .sort(byNewest);

        if (normalizedHistory.length > 0) {
          setCurrentAlert(normalizedHistory[0]);
        }
        setAlertHistory(normalizedHistory);
      } catch (error) {
        console.error("Failed to load initial alert history:", error);
      }
    };

    loadHistory();
  }, []);

  // --- 2. WebSocket 연결 및 실시간 알람 처리 ---
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
  
    ws.onerror = (e) => {
      console.error("WS Error:", e);
    };
  
    ws.onmessage = (event) => {
      try {
        // 🔥 1) 서버에서 온 순수 문자열 먼저 찍기
        console.log("[WS RAW]", event.data);
  
        const message = JSON.parse(event.data);
  
        // 🔥 2) 파싱된 객체 찍기
        console.log("[WS MESSAGE]", message);
  
        // type 이 "alert" 인 메시지만 화면에 반영
        if (message.type === "alert" && message.payload) {
          const newAlert = normalizeAlert(message.payload);
  
          // 히스토리 추가
          setAlertHistory((prev) => [newAlert, ...prev]);
          // 배너 갱신
          setCurrentAlert(newAlert);
          // 토스트 추가
          setToastAlerts((prev) => [...prev, newAlert]);
        }
      } catch (e) {
        console.error("Error parsing WS message:", e, "data =", event.data);
      }
    };
  
    // 컴포넌트 언마운트 시 연결 정리
    return () => ws.close();
  }, []);
  
  // --- 3. 최종 렌더링 ---
  return (
    <div
      className="app-layout"
      style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
    >
      {/* 알람 토스트 컨테이너 (화면 고정) */}
      <AlertToastContainer alerts={toastAlerts} removeToast={removeToast} />

      <header
        style={{
          marginBottom: "20px",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h1>MOBY 대시보드</h1>
        <p>WebSocket 상태: {wsConnected ? "🟢 연결됨" : "🔴 연결 끊김"}</p>
      </header>

      <main>
        {/* 알람 배너 */}
        {currentAlert && <AlertBanner alert={currentAlert} />}

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "20px",
            alignItems: "flex-start",
          }}
        >
          {/* 알람 히스토리 */}
          <AlertHistory items={alertHistory} wsStatus={wsConnected} />

          {/* 보고서 / 기타 대시보드 영역 */}
          <div
            style={{
              flexGrow: 1,
              border: "1px dashed #ccc",
              padding: "20px",
              minHeight: "200px",
            }}
          >
            <h3>기타 대시보드 콘텐츠</h3>
            <p style={{ color: "#666", fontSize: 14 }}>
              ReportCard, AlertsPanel, 센서 상태 카드 등 추가 컴포넌트를
              이 영역에 배치하면 됨.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
