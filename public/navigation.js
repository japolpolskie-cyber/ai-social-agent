// ======================================================
// AI Social Agent Platform Navigation
// ======================================================

const NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard.html",
    match: "dashboard.html",
    icon: "◫",
  },

  {
    label: "Generate",
    href: "/",
    match: "index.html",
    icon: "✦",
  },
];

// ======================================================
// Active Page
// ======================================================

function getCurrentPage() {
  const pathname =
    window.location.pathname;

  if (
    pathname === "/" ||
    pathname.endsWith(
      "/index.html"
    )
  ) {
    return "index.html";
  }

  return pathname
    .split("/")
    .pop();
}

function isActiveItem(
  item,
  currentPage
) {
  return (
    item.match ===
    currentPage
  );
}

// ======================================================
// Styles
// ======================================================

function injectNavigationStyles() {
  if (
    document.getElementById(
      "platformNavigationStyles"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "platformNavigationStyles";

  style.textContent = `
    .platform-navigation {
      position: sticky;
      top: 0;
      z-index: 1000;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      width: 100%;

      padding: 12px 24px;

      border-bottom:
        1px solid
        rgba(148, 163, 184, 0.18);

      background:
        rgba(10, 15, 29, 0.94);

      box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.18);

      backdrop-filter:
        blur(16px);
    }

    .platform-navigation-brand {
      display: flex;
      align-items: center;
      gap: 11px;

      color: #f8fafc;

      text-decoration: none;
    }

    .platform-navigation-logo {
      display: grid;

      width: 34px;
      height: 34px;

      place-items: center;

      border:
        1px solid
        rgba(124, 156, 255, 0.38);

      border-radius: 10px;

      color: #c7d2fe;

      background:
        rgba(124, 156, 255, 0.14);

      font-weight: 900;
    }

    .platform-navigation-title {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .platform-navigation-title strong {
      font-size: 0.9rem;
      letter-spacing: 0.01em;
    }

    .platform-navigation-title span {
      color: #8491a7;
      font-size: 0.68rem;
    }

    .platform-navigation-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .platform-navigation-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      padding: 9px 13px;

      border:
        1px solid transparent;

      border-radius: 9px;

      color: #aab5c7;

      text-decoration: none;

      font-size: 0.82rem;
      font-weight: 750;

      transition:
        color 160ms ease,
        border-color 160ms ease,
        background 160ms ease,
        transform 160ms ease;
    }

    .platform-navigation-link:hover {
      color: #f8fafc;

      border-color:
        rgba(148, 163, 184, 0.20);

      background:
        rgba(255, 255, 255, 0.05);

      transform:
        translateY(-1px);
    }

    .platform-navigation-link.active {
      color: #ffffff;

      border-color:
        rgba(124, 156, 255, 0.34);

      background:
        rgba(124, 156, 255, 0.16);
    }

    .platform-navigation-icon {
      font-size: 0.95rem;
    }

    @media (max-width: 640px) {
      .platform-navigation {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;

        padding:
          11px 14px;
      }

      .platform-navigation-links {
        width: 100%;
      }

      .platform-navigation-link {
        flex: 1;
        justify-content: center;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

// ======================================================
// Render
// ======================================================

function createNavigation() {
  const currentPage =
    getCurrentPage();

  const navigation =
    document.createElement(
      "nav"
    );

  navigation.className =
    "platform-navigation";

  navigation.setAttribute(
    "aria-label",
    "Platform navigation"
  );

  const links =
    NAVIGATION_ITEMS
      .map(
        (item) => {
          const active =
            isActiveItem(
              item,
              currentPage
            );

          return `
            <a
              href="${item.href}"
              class="
                platform-navigation-link
                ${active ? "active" : ""}
              "
              ${active
                ? 'aria-current="page"'
                : ""}
            >
              <span
                class="platform-navigation-icon"
                aria-hidden="true"
              >
                ${item.icon}
              </span>

              <span>
                ${item.label}
              </span>
            </a>
          `;
        }
      )
      .join("");

  navigation.innerHTML = `
    <a
      href="/dashboard.html"
      class="platform-navigation-brand"
    >
      <span
        class="platform-navigation-logo"
        aria-hidden="true"
      >
        AI
      </span>

      <span class="platform-navigation-title">
        <strong>
          AI Social Agent
        </strong>

        <span>
          Automation Platform
        </span>
      </span>
    </a>

    <div class="platform-navigation-links">
      ${links}
    </div>
  `;

  return navigation;
}

function initializeNavigation() {
  if (
    document.querySelector(
      ".platform-navigation"
    )
  ) {
    return;
  }

  injectNavigationStyles();

  document.body.prepend(
    createNavigation()
  );
}

// ======================================================
// Initialize
// ======================================================

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeNavigation
  );
} else {
  initializeNavigation();
}