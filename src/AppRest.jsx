// src/AppRest.jsx - 왼쪽 사이드바 + 오른쪽 Grafana 임베드 레이아웃
import React from 'react'
import './AppRest.css'

function MenuItem({ icon, label }) {
  return (
    <div className="menu-item">
      <div className="menu-icon">{icon}</div>
      <div className="menu-label">{label}</div>
    </div>
  )
}

export default function AppRest() {
  const grafanaUrl = import.meta.env.VITE_GRAFANA_EMBED_URL || '/grafana/'

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="logo">MOBY</div>
        <div className="menu">
          <MenuItem icon={<span className="bell">🔔</span>} label="알림" />
          <MenuItem icon={<span className="chart">📊</span>} label="운영 지표" />
          <MenuItem icon={<span className="report">📄</span>} label="보고서" />
          <MenuItem icon={<span className="settings">⚙️</span>} label="설정" />
          <div className="spacer" />
          <MenuItem icon={<span className="logout">🔓</span>} label="로그아웃" />
        </div>
      </aside>

      <main className="content">
        <div className="grafana-panel">
          <iframe
            title="Grafana Dashboard"
            src={grafanaUrl}
            className="grafana-frame"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  )
}