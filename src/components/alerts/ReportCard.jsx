import React from "react";

export default function ReportCard({ report }) {
  if (!report) return null;
  return (
    <div style={{
      border:"1px solid #eee", borderRadius:12, padding:16, minWidth:260
    }}>
      <div style={{fontWeight:700, marginBottom:6}}>
        보고서 #{report.id} • {new Date(report.ts).toLocaleString?.()}
      </div>
      <div style={{fontSize:14, marginBottom:10}}>
        {report.title || "자동 요약 보고서"}
      </div>
      {report.llm_summary && (
        <div style={{fontSize:13, opacity:.9}}>
          <b>AI 요약</b>: {report.llm_summary}
        </div>
      )}
    </div>
  );
}