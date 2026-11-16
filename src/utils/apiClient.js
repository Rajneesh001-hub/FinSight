import { supabase } from "./supabaseClient";

const BASE_URL = '/api';

// Get JWT token from active Supabase session
const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    console.warn('[API] No active session - token is null');
  }
  return session?.access_token || null;
};

// Generic request handler
const request = async (method, path, body = null) => {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

// ─── API methods ──────────────────────────────────────────────────────────────

export const api = {
  // Health check
  health: () => request("GET", "/health"),

  // Dashboard
  dashboard: {
    get: () => request("GET", "/dashboard"),
  },

  // Transactions
  transactions: {
    list:   (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request("GET", `/transactions${q ? "?" + q : ""}`).then(res => res.data || res);
    },
    create: (data) => request("POST", "/transactions", data),
    update: (id, data) => request("PUT", `/transactions/${id}`, data),
    delete: (id) => request("DELETE", `/transactions/${id}`),
  },

  // Budgets
  budgets: {
    list:   () => request("GET", "/budgets").then(res => res.data || res),
    create: (data) => request("POST", "/budgets", data),
    update: (id, data) => request("PUT", `/budgets/${id}`, data),
    delete: (id) => request("DELETE", `/budgets/${id}`),
  },

  // Goals
  goals: {
    list:   () => request("GET", "/goals").then(res => res.data || res),
    create: (data) => request("POST", "/goals", data),
    update: (id, data) => request("PUT", `/goals/${id}`, data),
    delete: (id) => request("DELETE", `/goals/${id}`),
  },

  // Import / Export
  import: {
    csv: async (formData) => {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // multipart/form-data, no Content-Type header
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Import failed");
      }
      return data;
    },
  },

  export: {
    csv: async (params = {}) => {
      const token = await getToken();
      const q = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/export${q ? "?" + q : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Export failed");
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/csv") && !contentType.includes("application/octet-stream")) {
        throw new Error("Unexpected response format from export endpoint");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "finsight-transactions.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
