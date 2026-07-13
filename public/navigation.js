// ======================================================
// AI Social Agent Platform Navigation
// ======================================================

const NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard.html",
    match: "dashboard.html",
    icon: "D",
  },
  {
    label: "Generate",
    href: "/",
    match: "index.html",
    icon: "+",
  },
  {
    label: "Executions",
    href: "/executions.html",
    match: "executions.html",
    icon: "E",
  },
];

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

  if (
    pathname.endsWith(
      "/execution-details.html"
    )
  ) {
    return "executions.html";
  }

  return pathname
    .split("/")
    .pop();
}

function isActiveItem(
  item,
  currentPage
) {
  return item.match ===
    currentPage;
}

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
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: var(--nav-height, 72px);
      padding: 12px max(24px, calc((100vw - 1440px) / 2));
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      background: rgba(9, 9, 11, 0.78);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(22px) saturate(140%);
    }

    .platform-navigation::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 1px;
      pointer-events: none;
      content: "";
      background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.28), transparent);
    }

    .platform-navigation-brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: max-content;
      color: #f8fafc;
      text-decoration: none;
    }

    .platform-navigation-logo {
      position: relative;
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      overflow: hidden;
      color: #ede9fe;
      border: 1px solid rgba(139, 92, 246, 0.38);
      border-radius: 12px;
      background: linear-gradient(145deg, rgba(124, 58, 237, 0.26), rgba(99, 102, 241, 0.08));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 24px rgba(124, 58, 237, 0.12);
      font-size: 0.72rem;
      font-weight: 850;
      letter-spacing: -0.02em;
    }

    .platform-navigation-logo::after {
      position: absolute;
      inset: auto -8px -12px auto;
      width: 24px;
      height: 24px;
      content: "";
      background: #8b5cf6;
      border-radius: 50%;
      filter: blur(10px);
    }

    .platform-navigation-title {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .platform-navigation-title strong {
      color: #f8fafc;
      font-size: 0.86rem;
      font-weight: 720;
      letter-spacing: -0.01em;
    }

    .platform-navigation-title span {
      color: #64748b;
      font-size: 0.64rem;
      font-weight: 550;
      letter-spacing: 0.03em;
    }

    .platform-navigation-links {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.025);
    }

    .platform-navigation-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 8px 13px;
      color: #94a3b8;
      border: 1px solid transparent;
      border-radius: 9px;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 650;
      transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms ease;
    }

    .platform-navigation-link:hover {
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.045);
    }

    .platform-navigation-link.active {
      color: #f5f3ff;
      border-color: rgba(139, 92, 246, 0.24);
      background: rgba(124, 58, 237, 0.14);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .platform-navigation-icon {
      display: grid;
      width: 19px;
      height: 19px;
      place-items: center;
      color: #7c8aa0;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 6px;
      font-size: 0.58rem;
      font-weight: 800;
    }

    .platform-navigation-link.active .platform-navigation-icon {
      color: #c4b5fd;
      border-color: rgba(139, 92, 246, 0.25);
      background: rgba(124, 58, 237, 0.12);
    }

    @media (max-width: 700px) {
      .platform-navigation {
        align-items: center;
        min-height: 64px;
        padding: 9px 12px;
      }

      .platform-navigation-title span {
        display: none;
      }

      .platform-navigation-links {
        gap: 2px;
      }

      .platform-navigation-link {
        gap: 5px;
        min-height: 36px;
        padding: 7px 9px;
      }

      .platform-navigation-icon {
        display: none;
      }
    }

    @media (max-width: 500px) {
      .platform-navigation-brand {
        gap: 8px;
      }

      .platform-navigation-logo {
        width: 34px;
        height: 34px;
      }

      .platform-navigation-title {
        display: none;
      }

      .platform-navigation-links {
        flex: 1;
        justify-content: flex-end;
      }

      .platform-navigation-link {
        flex: 1;
        justify-content: center;
        max-width: 104px;
        font-size: 0.72rem;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

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
              class="platform-navigation-link ${active ? "active" : ""}"
              ${active ? 'aria-current="page"' : ""}
            >
              <span class="platform-navigation-icon" aria-hidden="true">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `;
        }
      )
      .join("");

  navigation.innerHTML = `
    <a href="/dashboard.html" class="platform-navigation-brand" aria-label="AI Social Agent dashboard">
      <span class="platform-navigation-logo" aria-hidden="true">AI</span>
      <span class="platform-navigation-title">
        <strong>AI Social Agent</strong>
        <span>Intelligent content platform</span>
      </span>
    </a>
    <div class="platform-navigation-links">${links}</div>
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
