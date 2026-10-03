/* =========================================================
   CONFIG
========================================================= */

/*
  true  = TẮT / BẢO TRÌ
  false = BẬT
*/

const MAINTENANCE_MODE = {
  script1: false,
  script2: false,
  script3: true,
  script4: false,
  script5: false,
  script6: false,
  script7: false,
  script8: false
};


/*
  =========================================================
  DANH SÁCH SCRIPT (8 SCRIPT)
  =========================================================
*/

const SCRIPTS = [

  {
    id: "script1",
    name: "Blox Fruits Farm",
    description: "Script mẫu cho nhóm tính năng farm của Blox Fruits.",
    category: "universal",
    platform: "pc",
    updated: "2026-10-03",
    version: "1.0.0",
    tags: ["Blox Fruits", "Farm", "PC"],
    content: `-- Blox Fruits Farm

-- Dán script của bạn vào đây

print("Blox Fruits Farm")`
  },

  {
    id: "script2",
    name: "Blox Fruits Utility",
    description: "Script utility với card, tag, version và trạng thái.",
    category: "universal",
    platform: "mobile",
    updated: "2026-10-02",
    version: "2.1.4",
    tags: ["Blox Fruits", "Utility", "Mobile"],
    content: `-- Blox Fruits Utility

print("Utility Script")`
  },

  {
    id: "script3",
    name: "Universal Main",
    description: "Script mẫu dùng làm entry cho nhiều game.",
    category: "universal",
    platform: "pc",
    updated: "2026-09-30",
    version: "3.0.0",
    tags: ["Universal", "Main"],
    content: `-- Universal Main

print("Universal Script")`
  },

  {
    id: "script4",
    name: "Arsenal Main",
    description: "Script đang bảo trì để minh họa trạng thái.",
    category: "arsenal",
    platform: "pc",
    updated: "2026-09-27",
    version: "0.9.2",
    tags: ["Arsenal", "PC"],
    content: `-- Arsenal Main

print("Maintenance demo")`
  },

  {
    id: "script5",
    name: "Mobile Farm",
    description: "Script mẫu cho nền tảng mobile.",
    category: "universal",
    platform: "mobile",
    updated: "2026-09-25",
    version: "1.3.2",
    tags: ["Mobile", "Farm"],
    content: `-- Mobile Farm

print("Mobile Farm")`
  },

  {
    id: "script6",
    name: "PC Utility",
    description: "Script tiện ích mẫu cho tab PC.",
    category: "utility",
    platform: "pc",
    updated: "2026-09-20",
    version: "1.1.0",
    tags: ["Utility", "PC"],
    content: `-- PC Utility

print("PC Utility")`
  },

  {
    id: "script7",
    name: "Aimbot Pro",
    description: "Script hỗ trợ ngắm cho các game FPS.",
    category: "universal",
    platform: "pc",
    updated: "2026-10-05",
    version: "4.2.1",
    tags: ["Aim", "FPS", "PC"],
    content: `-- Aimbot Pro

print("Aimbot Pro loaded")`
  },

  {
    id: "script8",
    name: "Auto Farm All Game",
    description: "Script auto farm tổng hợp cho nhiều tựa game.",
    category: "universal",
    platform: "mobile",
    updated: "2026-10-01",
    version: "2.0.0",
    tags: ["Auto Farm", "Universal", "Mobile"],
    content: `-- Auto Farm All Game

print("Auto Farm loaded")`
  }

];


/* =========================================================
   STATE
========================================================= */

const state = {
  tab: "all",
  query: "",
  selectedId: null,
  searchTimer: null
};


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isDisabled(script) {
  return Boolean(MAINTENANCE_MODE[script.id]);
}

function getStatus(script) {
  return isDisabled(script) ? "Bảo trì" : "Online";
}

function getTimeAgo(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Ngày cập nhật không rõ";

  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));

  if (days === 0) return "Cập nhật hôm nay";
  if (days === 1) return "Cập nhật hôm qua";
  if (days < 7) return `Cập nhật ${days} ngày trước`;
  if (days < 30) return `Cập nhật ${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `Cập nhật ${Math.floor(days / 30)} tháng trước`;
  return `Cập nhật ${Math.floor(days / 365)} năm trước`;
}


/* =========================================================
   FILTER
========================================================= */

function getFilteredScripts() {
  const q = state.query.trim().toLowerCase();

  return SCRIPTS.filter(script => {
    if (!q) return true;

    const haystack = [
      script.name,
      script.description,
      script.category,
      script.platform,
      script.version,
      ...script.tags
    ].join(" ").toLowerCase();

    return haystack.includes(q);
  });
}


/* =========================================================
   COUNTS
========================================================= */

function renderCounts() {
  const counts = { all: SCRIPTS.length };

  Object.entries(counts).forEach(([key, value]) => {
    const el = $(`[data-count="${key}"]`);
    if (el) el.textContent = value;
  });

  $("#totalScripts").textContent = SCRIPTS.length;
}


/* =========================================================
   CARD TEMPLATE
========================================================= */

function cardTemplate(script) {
  const disabled = isDisabled(script);
  const status = getStatus(script);

  return `
    <article
      class="script-card ${disabled ? "is-maintenance" : ""}"
      data-script-id="${escapeHTML(script.id)}"
    >
      <div class="card-topline">
        <span class="category-label">
          ${escapeHTML(script.category)}
        </span>

        <span class="status-badge ${disabled ? "maintenance" : "online"}">
          <i></i>
          ${status}
        </span>
      </div>

      <h3>${escapeHTML(script.name)}</h3>

      <p class="card-description">
        ${escapeHTML(script.description)}
      </p>

      <div class="tag-row">
        ${script.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}
      </div>

      <div class="card-info">
        <span>v${escapeHTML(script.version)}</span>
        <span title="${escapeHTML(script.updated)}">
          ${escapeHTML(getTimeAgo(script.updated))}
        </span>
      </div>

      <div class="card-actions">
        <button
          class="btn primary"
          data-action="copy"
          ${disabled ? 'disabled aria-disabled="true"' : ""}
        >
          ${disabled ? "Đang bảo trì" : "Copy Script"}
        </button>

        <button class="btn secondary" data-action="view">
          View Content
        </button>
      </div>
    </article>
  `;
}


/* =========================================================
   RENDER
========================================================= */

function renderScripts() {
  const grid = $("#scriptGrid");
  const empty = $("#searchEmpty");
  const results = getFilteredScripts();

  grid.innerHTML = results.map(cardTemplate).join("");
  empty.hidden = results.length > 0;
}


/* =========================================================
   SEARCH
========================================================= */

function initSearch() {
  const input = $("#searchInput");
  const clear = $("#searchClear");

  const apply = () => {
    state.query = input.value;
    clear.hidden = !state.query;
    renderScripts();
  };

  input.addEventListener("input", () => {
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(apply, 100);
  });

  clear.addEventListener("click", () => {
    input.value = "";
    apply();
    input.focus();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      input.value = "";
      apply();
    }
  });
}


/* =========================================================
   COPY
========================================================= */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      const result = document.execCommand("copy");
      area.remove();
      return result;
    } catch {
      return false;
    }
  }
}


/* =========================================================
   TOAST
========================================================= */

const toastIcons = {
  success: "✓",
  error: "!",
  info: "i"
};

function showToast(message, type = "info") {
  const container = $("#toastContainer");
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <span class="toast-icon">${toastIcons[type] || "i"}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}


/* =========================================================
   OPEN SCRIPT MODAL
========================================================= */

function openScript(script) {
  state.selectedId = script.id;

  $("#scriptModalTitle").textContent = script.name;

  $("#scriptModalMeta").innerHTML = `
    <span>${escapeHTML(script.category)}</span>
    <span>${escapeHTML(script.platform)}</span>
    <span>v${escapeHTML(script.version)}</span>
    <span class="${isDisabled(script) ? "meta-bad" : "meta-good"}">
      ${getStatus(script)}
    </span>
  `;

  $("#scriptContent").textContent = script.content;
  $("#modalCopy").disabled = isDisabled(script);

  const modal = $("#scriptModal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}


/* =========================================================
   CLOSE MODALS
========================================================= */

function closeModal() {
  $$(".modal-overlay.show").forEach(modal => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  });

  document.body.classList.remove("modal-open");
}


/* =========================================================
   SCRIPT ACTIONS
========================================================= */

function initScriptActions() {
  $("#scriptGrid").addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const card = button.closest("[data-script-id]");
    const script = SCRIPTS.find(x => x.id === card?.dataset.scriptId);
    if (!script) return;

    /* COPY */
    if (button.dataset.action === "copy") {
      if (isDisabled(script)) return;

      button.disabled = true;
      const oldText = button.textContent;
      button.textContent = "Copying...";

      const ok = await copyText(script.content);

      button.textContent = ok ? "Copied ✓" : "Copy lỗi";

      showToast(
        ok ? `Đã copy ${script.name}` : "Không thể copy script",
        ok ? "success" : "error"
      );

      await sleep(900);
      button.disabled = false;
      button.textContent = oldText;
    }

    /* VIEW */
    if (button.dataset.action === "view") {
      openScript(script);
    }
  });

  /* MODAL COPY */
  $("#modalCopy").addEventListener("click", async () => {
    const script = SCRIPTS.find(x => x.id === state.selectedId);
    if (!script || isDisabled(script)) return;

    const ok = await copyText(script.content);

    showToast(
      ok ? `Đã copy ${script.name}` : "Không thể copy script",
      ok ? "success" : "error"
    );
  });
}


/* =========================================================
   MODAL
========================================================= */

function initModal() {
  $$(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeModal();
    });
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
}


/* =========================================================
   GUIDE MODAL
========================================================= */

function initGuide() {
  const overlay = $("#guideOverlay");
  const open = $("#guideOpen");
  const close = $("#guideClose");

  open.addEventListener("click", () => {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });

  close.addEventListener("click", closeModal);
}


/* =========================================================
   THEME
========================================================= */

function initTheme() {
  const button = $("#themeToggle");
  const label = $("[data-role='theme-label']");

  const updateLabel = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    label.textContent = dark ? "Dark" : "Light";
  };

  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {}

    updateLabel();
  });

  document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      button.click();
    }
  });

  updateLabel();
}


/* =========================================================
   LOADER
========================================================= */

function initLoader() {
  const loader = $("#loader");
  const percentage = $("#percentage");
  const bar = $("#loaderBar");

  let value = 0;

  const timer = setInterval(() => {
    value += Math.floor(Math.random() * 18) + 7;
    value = Math.min(100, value);

    percentage.textContent = `${value}%`;
    bar.style.width = `${value}%`;

    if (value >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 220);
    }
  }, 110);
}


/* =========================================================
   READING PROGRESS
========================================================= */

function initReadingProgress() {
  const fill = $("#readingProgressFill");
  const top = $("#backToTop");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;

    fill.style.width = `${Math.min(100, percent)}%`;
    top.classList.toggle("show", window.scrollY > 420);
  };

  window.addEventListener("scroll", update, { passive: true });

  top.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  update();
}


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderCounts();
  renderScripts();
  initSearch();
  initScriptActions();
  initModal();
  initGuide();
  initTheme();
  initReadingProgress();
  initLoader();
});
