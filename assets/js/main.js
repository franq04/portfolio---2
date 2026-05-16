(() => {
  document.documentElement.classList.remove("no-js");

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");

  const getPreferredTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  };

  const updateThemeLabel = () => {
    if (!themeLabel) return;
    themeLabel.textContent = root.dataset.theme === "dark" ? "Light" : "Dark";
  };

  applyTheme(getPreferredTheme());
  updateThemeLabel();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      updateThemeLabel();
    });
  }

  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 600);
  });

  const nav = document.getElementById("site-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navPanel = document.getElementById("nav-panel");

  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateNav();
  window.addEventListener("scroll", updateNav);

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });
  }

  document.querySelectorAll("#nav-panel a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!navPanel) return;
      navPanel.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  const navLinks = Array.from(document.querySelectorAll(".nav-list a[data-section]"));
  const navIndicator = document.getElementById("nav-indicator");
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      sectionMap.set(target.id, link);
    }
  });

  const setActiveLink = (link) => {
    navLinks.forEach((item) => item.classList.remove("is-active"));
    if (!link) return;
    link.classList.add("is-active");

    if (navIndicator && link.parentElement) {
      const linkRect = link.getBoundingClientRect();
      const parentRect = link.parentElement.getBoundingClientRect();
      navIndicator.style.width = `${linkRect.width}px`;
      navIndicator.style.transform = `translateX(${linkRect.left - parentRect.left}px)`;
    }
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = sectionMap.get(entry.target.id);
        if (link) {
          setActiveLink(link);
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
  );

  sectionMap.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) {
      sectionObserver.observe(section);
    }
  });

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-list a.is-active");
    if (active) {
      setActiveLink(active);
    }
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  const scrollTopButton = document.getElementById("scroll-top");
  const updateScrollTop = () => {
    if (!scrollTopButton) return;
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 600);
  };

  updateScrollTop();
  window.addEventListener("scroll", updateScrollTop);

  scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const contactCard = document.getElementById("contact-card");
  const triggerContactHighlight = () => {
    if (!contactCard) return;
    contactCard.classList.remove("contact-highlight");
    void contactCard.offsetWidth;
    contactCard.classList.add("contact-highlight");
  };

  document.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(triggerContactHighlight, 350);
    });
  });

  if (window.location.hash === "#contact") {
    triggerContactHighlight();
  }

  const galleries = {
    capstone: {
      name: "Capstone Inventory System",
      count: 13,
      path: "CapstoneImage",
      extension: "png",
      previewCount: 4,
      containerId: "capstone-gallery",
    },
    intern: {
      name: "HLM Pharmaceutical System",
      count: 10,
      path: "InternImage",
      extension: "png",
      previewCount: 4,
      containerId: "intern-gallery",
    },
  };

  const galleryState = {};

  Object.entries(galleries).forEach(([key, config]) => {
    const images = Array.from({ length: config.count }, (_, index) => {
      return `${config.path}/${index + 1}.${config.extension}`;
    });

    galleryState[key] = {
      name: config.name,
      images,
    };

    const container = document.getElementById(config.containerId);
    if (!container) return;

    const previewLimit = Math.min(config.previewCount ?? images.length, images.length);
    const previewImages = images.slice(0, previewLimit);
    const meta = document.getElementById(`${key}-gallery-meta`);

    if (meta) {
      meta.textContent = `Showing ${previewLimit} of ${images.length} screens`;
    }

    const shouldFeature = previewLimit >= 5;

    previewImages.forEach((src, index) => {
      const button = document.createElement("button");
      const isFeatured = shouldFeature && index === 0;
      button.type = "button";
      button.className = `gallery-item${isFeatured ? " is-featured" : ""}`;
      button.dataset.group = key;
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `${config.name} screen ${index + 1}`);
      button.innerHTML = `<img src="${src}" alt="${config.name} screen ${index + 1}" loading="lazy" decoding="async" />`;
      container.appendChild(button);
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxClose = document.getElementById("lightbox-close");

  let activeGroup = "capstone";
  let activeIndex = 0;

  const updateLightbox = () => {
    const groupData = galleryState[activeGroup];
    if (!groupData || !lightboxImage || !lightboxTitle) return;
    const total = groupData.images.length;
    const src = groupData.images[activeIndex];
    lightboxImage.src = src;
    lightboxTitle.textContent = `${groupData.name} (${activeIndex + 1}/${total})`;
  };

  const openLightbox = (group, index) => {
    activeGroup = group;
    activeIndex = index;
    updateLightbox();
    if (lightbox) {
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    }
    document.body.classList.add("overlay-open");
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("overlay-open");
  };

  const stepLightbox = (direction) => {
    const groupData = galleryState[activeGroup];
    if (!groupData) return;
    const total = groupData.images.length;
    activeIndex = (activeIndex + direction + total) % total;
    updateLightbox();
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-group][data-index]");
    if (!target) return;
    const group = target.dataset.group;
    const index = Number(target.dataset.index);
    openLightbox(group, index);
  });

  document.querySelectorAll("[data-gallery-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.getAttribute("data-gallery-open");
      if (group) {
        openLightbox(group, 0);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => stepLightbox(-1));
  lightboxNext?.addEventListener("click", () => stepLightbox(1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "ArrowLeft") stepLightbox(-1);
  });
})();
