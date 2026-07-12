// ======================================================
// AI Social Agent Platform Layout
// ======================================================

(function initializePlatformLayoutModule() {
  const DEFAULT_CONFIG =
    Object.freeze({
      applicationName:
        "AI Social Agent",

      applicationLabel:
        "Automation Platform",

      page:
        "platform",

      title:
        "Platform",

      description:
        "",

      showFooter:
        true,
    });

  // ====================================================
  // Helpers
  // ====================================================

  function normalizeText(
    value,
    fallback = ""
  ) {
    if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      return fallback;
    }

    return value.trim();
  }

  function resolvePageFromPath() {
    const pathname =
      window.location.pathname;

    if (
      pathname === "/" ||
      pathname.endsWith(
        "/index.html"
      )
    ) {
      return {
        page:
          "generate",

        title:
          "Generate",

        description:
          "Create, validate, and repair AI-powered social content.",
      };
    }

    if (
      pathname.endsWith(
        "/dashboard.html"
      )
    ) {
      return {
        page:
          "dashboard",

        title:
          "Dashboard",

        description:
          "Monitor executions, providers, pipelines, and platform health.",
      };
    }

    if (
      pathname.endsWith(
        "/executions.html"
      )
    ) {
      return {
        page:
          "executions",

        title:
          "Executions",

        description:
          "Browse execution history, inspect details, and replay previous runs.",
      };
    }

    const fileName =
      pathname
        .split("/")
        .pop()
        .replace(
          /\.html$/i,
          ""
        );

    const title =
      fileName
        .split("-")
        .filter(Boolean)
        .map(
          (word) =>
            word.charAt(0)
              .toUpperCase() +
            word.slice(1)
        )
        .join(" ");

    return {
      page:
        fileName ||
        "platform",

      title:
        title ||
        "Platform",

      description:
        "",
    };
  }

  function resolveConfiguration(
    options = {}
  ) {
    const inferred =
      resolvePageFromPath();

    return {
      ...DEFAULT_CONFIG,

      ...inferred,

      ...options,

      applicationName:
        normalizeText(
          options.applicationName,
          DEFAULT_CONFIG.applicationName
        ),

      applicationLabel:
        normalizeText(
          options.applicationLabel,
          DEFAULT_CONFIG.applicationLabel
        ),

      page:
        normalizeText(
          options.page,
          inferred.page
        ),

      title:
        normalizeText(
          options.title,
          inferred.title
        ),

      description:
        normalizeText(
          options.description,
          inferred.description
        ),

      showFooter:
        options.showFooter !==
        false,
    };
  }

  // ====================================================
  // Shared Styles
  // ====================================================

  function injectLayoutStyles() {
    if (
      document.getElementById(
        "platformLayoutStyles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "platformLayoutStyles";

    style.textContent = `
      body.platform-page {
        min-height: 100vh;
      }

      .platform-page-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;

        width: min(
          1480px,
          calc(100% - 32px)
        );

        margin: 28px auto 0;
        padding: 18px 4px 24px;

        border-top:
          1px solid
          rgba(148, 163, 184, 0.16);

        color: #8491a7;

        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        font-size: 0.76rem;
      }

      .platform-page-footer strong {
        color: #cbd5e1;
        font-weight: 750;
      }

      .platform-page-footer-meta {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .platform-page-footer-dot {
        width: 5px;
        height: 5px;

        border-radius: 50%;

        background: #4ade80;

        box-shadow:
          0 0 10px
          rgba(74, 222, 128, 0.75);
      }

      @media (max-width: 640px) {
        .platform-page-footer {
          align-items: flex-start;
          flex-direction: column;

          width:
            calc(100% - 28px);
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  // ====================================================
  // Document Metadata
  // ====================================================

  function applyDocumentMetadata(
    config
  ) {
    document.title =
      `${config.title} | ${config.applicationName}`;

    document.body.classList.add(
      "platform-page"
    );

    document.body.dataset
      .platformPage =
      config.page;

    document.body.dataset
      .platformTitle =
      config.title;

    if (config.description) {
      document.body.dataset
        .platformDescription =
        config.description;
    }
  }

  // ====================================================
  // Navigation State
  // ====================================================

  function updateNavigationState(
    config
  ) {
    const links =
      document.querySelectorAll(
        ".platform-navigation-link"
      );

    links.forEach(
      (link) => {
        const href =
          link.getAttribute(
            "href"
          );

        const isDashboard =
          config.page ===
            "dashboard" &&
          href ===
            "/dashboard.html";

        const isGenerate =
          config.page ===
            "generate" &&
          (
            href === "/" ||
            href ===
              "/index.html"
          );

        const isExecutions =
          config.page ===
            "executions" &&
          href ===
            "/executions.html";

        const active =
          isDashboard ||
          isGenerate ||
          isExecutions;

        link.classList.toggle(
          "active",
          active
        );

        if (active) {
          link.setAttribute(
            "aria-current",
            "page"
          );
        } else {
          link.removeAttribute(
            "aria-current"
          );
        }
      }
    );
  }

  // ====================================================
  // Shared Footer
  // ====================================================

  function createFooter(
    config
  ) {
    const footer =
      document.createElement(
        "footer"
      );

    footer.className =
      "platform-page-footer";

    footer.dataset
      .platformLayoutFooter =
      "true";

    footer.innerHTML = `
      <span>
        <strong>
          ${config.applicationName}
        </strong>

        · ${config.applicationLabel}
      </span>

      <span class="platform-page-footer-meta">
        <span
          class="platform-page-footer-dot"
          aria-hidden="true"
        ></span>

        <span>
          ${config.title} · Local development
        </span>
      </span>
    `;

    return footer;
  }

  function ensureFooter(
    config
  ) {
    if (!config.showFooter) {
      return;
    }

    const existingFooter =
      document.querySelector(
        ".dashboard-footer, " +
        "[data-platform-layout-footer]"
      );

    if (existingFooter) {
      return;
    }

    document.body.appendChild(
      createFooter(
        config
      )
    );
  }

  // ====================================================
  // Public Initializer
  // ====================================================

  function initializePlatformLayout(
    options = {}
  ) {
    const config =
      resolveConfiguration(
        options
      );

    injectLayoutStyles();

    applyDocumentMetadata(
      config
    );

    updateNavigationState(
      config
    );

    ensureFooter(
      config
    );

    window.dispatchEvent(
      new CustomEvent(
        "platformlayoutready",
        {
          detail:
            config,
        }
      )
    );

    return Object.freeze({
      ...config,
    });
  }

  // ====================================================
  // Export
  // ====================================================

  window.PlatformLayout =
    Object.freeze({
      initialize:
        initializePlatformLayout,
    });

  window.initializePlatformLayout =
    initializePlatformLayout;
})();