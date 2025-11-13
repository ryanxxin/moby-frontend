import React, { useEffect, useMemo, useRef, useState } from "react";
import AlertBanner from "./AlertBanner";
import AlertToast from "./AlertToast";
import AlertHistory from "./AlertHistory";
import ReportCard from "./ReportCard";
import { fetchAlertHistory } from "../../services/alerts";
import { normalizeAlert, byNewest } from "../../services/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const WS_URL =
  (API_BASE.startsWith("https") ? API_BASE.replace("https", "wss")
                                : API_BASE.replace("http", "ws")) + "/ws";

export default function AlertsPanel() {
  const [latest, setLatest] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([]);
  const [reports, setReports] = useState([]);

  const wsRef = useRef(null);
  const retryRef = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchAlertHistory(100);
        const normalized = rows.map(normalizeAlert).sort(byNewest);
        setHistory(normalized);
        setLatest(normalized[0] ?? null);
      } catch (e) {
        console.error("Failed to load alert history", e);
      }
    })();
  }, []);

  useEffect(() => {
    let closed = false;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        retryRef.current = 0;
        console.log("[AlertsPanel WS] connected");
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          
          if (msg?.type === "alert") {
            const a = normalizeAlert(msg.payload);
            setLatest(a);
            setHistory((prev) => [a, ...prev].slice(0, 500));
            setToasts((prev) => [{ ...a, id: a.id || crypto.randomUUID() }, ...prev].slice(0, 5));
          } 
          else if (msg?.type === "report") {
            setReports((prev) => [{ ...msg.payload }, ...prev].slice(0, 20));
          }
        } catch (e) {
          console.warn("WS message parse error", e);
        }
      };

      ws.onclose = () => {
        if (closed) return;
        const delay = Math.min(1000 * Math.pow(2, retryRef.current++), 10000);
        console.warn(`[AlertsPanel WS] closed. retry in ${delay}ms`);
        setTimeout(connect, delay);
      };

      ws.onerror = (e) => {
        console.error("[AlertsPanel WS] error", e);
        ws.close();
      };
    }

    connect();
    return () => { 
      closed = true; 
      wsRef.current?.close(); 
    };
  }, []);

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const lastReport = useMemo(() => reports[0] ?? null, [reports]);

  return (
    <div style={{marginBottom: 24}}>
      <h3 style={{margin:"0 0 16px", fontSize: 20}}>알림 & 보고서</h3>

      <AlertBanner alert={latest} />

      {lastReport && (
        <div style={{display:"flex", gap:12, marginBottom:16}}>
          <ReportCard report={lastReport} />
        </div>
      )}

      <AlertHistory items={history} />

      <div style={{
        position:"fixed", right:16, bottom:16, display:"flex",
        flexDirection:"column", alignItems:"flex-end", zIndex:9999
      }}>
        {toasts.map((t) => (
          <AlertToast key={t.id} toast={t} onClose={handleCloseToast} />
        ))}
      </div>
    </div>
  );
}