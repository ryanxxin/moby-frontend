import React from "react";

export default function GrafanaEmbed({ url, height = 600 }) {
  const src = url || import.meta.env.VITE_GRAFANA_EMBED_URL || "/grafana/d/abcd1234/my-dashboard?orgId=1";
  return (
    <div style={{ width: "100%", height }}>
      <iframe
        src={src}
        title="Grafana Dashboard"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
