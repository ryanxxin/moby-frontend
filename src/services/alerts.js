const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchAlertHistory(limit = 100) {
  const res = await fetch(`${API_BASE}/api/alerts/history?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to load alerts: ${res.status}`);
  return await res.json();
}

export async function fetchReports() {
  const res = await fetch(`${API_BASE}/api/reports`);
  if (!res.ok) throw new Error(`Failed to load reports: ${res.status}`);
  return await res.json();
}