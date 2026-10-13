const API = {
  base: "/api",

  getToken() { return localStorage.getItem("token"); },
  getUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },
  setSession(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  logout() {
    this.clearSession();
    window.location.href = "/index.html";
  },

  async request(method, path, body) {
    const headers = { "Content-Type": "application/json" };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(this.base + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    let data = {};
    try { data = await res.json(); } catch (e) { /* no body */ }

    if (res.status === 401) {
      this.clearSession();
      window.location.href = "/index.html";
      throw new Error("Session expired. Please log in again.");
    }
    if (!res.ok) throw new Error(data.message || "Something went wrong.");
    return data;
  },

  get(path) { return this.request("GET", path); },
  post(path, body) { return this.request("POST", path, body); },
  put(path, body) { return this.request("PUT", path, body); },
  del(path) { return this.request("DELETE", path); }
};

// Guards used at the top of protected pages
function requireRole(role) {
  const user = API.getUser();
  if (!API.getToken() || !user) { window.location.href = "/index.html"; return null; }
  if (user.role !== role) { window.location.href = user.role === "teacher" ? "/teacher-dashboard.html" : "/student-dashboard.html"; return null; }
  return user;
}

function renderTopbar(user, activeLabel) {
  const el = document.getElementById("topbar");
  if (!el) return;
  el.innerHTML = `
    <div class="brand">Test<span class="mark">ASSESS</span></div>
    <div class="who">
      <span>${user.name} &middot; ${user.role}</span>
      <button class="linklike" onclick="API.logout()">Log out</button>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
