(() => {
  const root = document.documentElement;

  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    const isDark = root.dataset.theme === "dark" ||
      (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  const header = document.querySelector(".site-header");
  const onScroll = () => header?.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const prose = document.querySelector(".post .prose");
  if (prose) {
    prose.querySelectorAll("blockquote").forEach((quote) => {
      const first = quote.firstElementChild?.firstChild;
      if (first?.nodeName === "STRONG") quote.classList.add("callout");
    });

    prose.querySelectorAll("h2[id], h3[id]").forEach((heading) => {
      const anchor = document.createElement("a");
      anchor.className = "anchor";
      anchor.href = `#${heading.id}`;
      anchor.textContent = "#";
      anchor.setAttribute("aria-label", "Link to this section");
      heading.append(anchor);
    });

    prose.querySelectorAll("div.highlighter-rouge").forEach((block) => {
      const button = document.createElement("button");
      button.className = "copy-btn";
      button.type = "button";
      button.textContent = "Copy";
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(block.querySelector("code").innerText);
          button.textContent = "Copied";
        } catch (e) { button.textContent = "Failed"; }
        setTimeout(() => (button.textContent = "Copy"), 1500);
      });
      block.append(button);
    });
  }

  if (document.body.classList.contains("has-toc")) {
    const entries = prose
      ? [...prose.querySelectorAll("h2[id], h3[id]")].map((heading) => ({
          id: heading.id, level: heading.tagName[1], element: heading,
          label: heading.textContent.replace(/#$/, "").trim(),
        }))
      : [...document.querySelectorAll("main [data-toc][id]")].map((block) => ({
          id: block.id, level: block.dataset.tocLevel || "2", label: block.dataset.toc,
          element: block.querySelector(":scope > .section-head, :scope > .area-head") || block,
        }));
    const tocs = [...document.querySelectorAll(".toc")];
    const tocBar = document.querySelector(".toc-bar");

    if (entries.length < 2) {
      document.body.classList.remove("has-toc");
      tocs.forEach((toc) => toc.classList.add("empty"));
    } else {
      const lists = [...tocs.map((toc) => toc.querySelector("ol")), tocBar?.querySelector("ol")].filter(Boolean);
      const links = lists.flatMap((list) => entries.map((entry) => {
        const item = document.createElement("li");
        item.className = `lvl-${entry.level}`;
        const link = document.createElement("a");
        link.href = `#${entry.id}`;
        link.dataset.id = entry.id;
        link.textContent = entry.label;
        item.append(link);
        list.append(item);
        return link;
      }));

      const current = tocBar?.querySelector(".toc-bar-current");
      const toggle = tocBar?.querySelector(".toc-bar-toggle");
      const barList = tocBar?.querySelector(".toc-bar-list");
      const setOpen = (open) => {
        if (!toggle) return;
        toggle.setAttribute("aria-expanded", String(open));
        barList.hidden = !open;
      };
      toggle?.addEventListener("click", () => setOpen(barList.hidden));
      barList?.addEventListener("click", (event) => { if (event.target.closest("a")) setOpen(false); });
      document.addEventListener("click", (event) => { if (tocBar && !tocBar.contains(event.target)) setOpen(false); });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
      });

      let activeId;
      const update = () => {
        const line = Math.max(180, innerHeight * 0.3);
        const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
        let active = atBottom ? entries.at(-1) : null;
        if (!active) {
          for (const entry of entries) {
            if (entry.element.getBoundingClientRect().top > line) break;
            active = entry;
          }
        }
        if (active?.id === activeId) return;
        activeId = active?.id;
        links.forEach((link) => link.classList.toggle("active", link.dataset.id === activeId));
        if (current) current.textContent = active ? active.label : "";
      };
      let ticking = false;
      addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; update(); });
      }, { passive: true });
      addEventListener("resize", update);
      update();
    }
  }

  const postList = document.querySelector("[data-post-list]");
  if (postList) {
    const rows = [...postList.querySelectorAll(".post-row")];
    const pageSize = Number(postList.dataset.pageSize) || 6;
    const tagChips = [...document.querySelectorAll(".chip[data-tag]")];
    const clearButtons = document.querySelectorAll("[data-tag-all]");
    const focusCards = [...document.querySelectorAll(".focus-card")];
    const moreButton = document.querySelector(".show-more");
    const emptyNote = document.querySelector(".empty-note");
    const status = document.querySelector(".filter-status");
    const tagsOf = (element) => element.dataset.tags ? element.dataset.tags.split("|") : [];
    const hasAll = (row, tags) => tags.every((tag) => tagsOf(row).includes(tag));
    const labels = new Map();
    document.querySelectorAll(".focus-tag, .chip[data-tag]").forEach((element) => {
      const label = element.dataset.label || element.textContent.replace(/^#/, "");
      labels.set(label.toLowerCase(), label);
    });
    let selected = [];
    let visibleCount = pageSize;

    const render = () => {
      const matching = rows.filter((row) => hasAll(row, selected));
      rows.forEach((row) => (row.hidden = true));
      matching.slice(0, visibleCount).forEach((row) => (row.hidden = false));
      const remaining = matching.length - visibleCount;
      moreButton.hidden = remaining <= 0;
      moreButton.textContent = `Show more (${remaining})`;
      emptyNote.hidden = matching.length > 0;
      tagChips.forEach((chip) => chip.setAttribute("aria-pressed", String(selected.includes(chip.dataset.tag))));
      document.querySelectorAll(".chip[data-tag-all]").forEach((chip) => chip.setAttribute("aria-pressed", String(!selected.length)));
      status.hidden = !selected.length;
      let activeFocus = "";
      focusCards.forEach((card) => {
        const cardTags = tagsOf(card);
        const isActive = cardTags.length === selected.length && cardTags.every((tag) => selected.includes(tag));
        card.setAttribute("aria-pressed", String(isActive));
        if (isActive) activeFocus = card.querySelector(".focus-title").textContent;
      });
      status.firstElementChild.innerHTML = (activeFocus ? `Focus: <strong>${activeFocus}</strong>. ` : "") +
        `${matching.length} post${matching.length === 1 ? "" : "s"} tagged ` +
        selected.map((tag) => `<strong>#${labels.get(tag) || tag}</strong>`).join(" + ") + ".";
    };
    const select = (tags) => { selected = tags; visibleCount = pageSize; render(); };

    tagChips.forEach((chip) => chip.addEventListener("click", () => {
      const tag = chip.dataset.tag;
      select(selected.includes(tag) ? selected.filter((other) => other !== tag) : [...selected, tag]);
      const writing = document.getElementById("writing");
      const box = writing.getBoundingClientRect();
      if (chip.hasAttribute("data-scroll") && (box.top > innerHeight * 0.6 || box.bottom < 200)) writing.scrollIntoView({ behavior: "smooth" });
    }));
    clearButtons.forEach((button) => button.addEventListener("click", () => select([])));
    moreButton.addEventListener("click", () => { visibleCount += pageSize; render(); });
    focusCards.forEach((card) => {
      const count = rows.filter((row) => hasAll(row, tagsOf(card))).length;
      card.querySelector(".focus-count").textContent = count ? `${count} post${count === 1 ? "" : "s"} →` : "No posts yet";
      card.addEventListener("click", () => {
        select(card.getAttribute("aria-pressed") === "true" ? [] : tagsOf(card));
        document.getElementById("writing").scrollIntoView({ behavior: "smooth" });
      });
    });
    render();
  }

  const recent = document.querySelector("[data-recent]");
  if (recent) {
    const items = [...recent.children];
    const batch = Number(recent.dataset.batch) || 2;
    const hint = document.querySelector(".recent-hint");
    let shown = Math.min(items.length, batch * 2);
    const reveal = () => items.forEach((item, index) => (item.hidden = index >= shown));
    const fit = () => {
      recent.style.maxHeight = items.length > batch ? `${items[batch].offsetTop + 44}px` : "";
    };
    const sync = () => {
      const below = recent.scrollHeight - recent.scrollTop - recent.clientHeight;
      if (below < 60 && shown < items.length) {
        shown = Math.min(items.length, shown + batch);
        reveal();
      }
      const more = recent.scrollHeight - recent.scrollTop - recent.clientHeight > 4;
      recent.classList.toggle("has-more", more);
      hint.hidden = !more || recent.scrollTop > 0;
    };
    reveal();
    fit();
    sync();
    recent.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", () => { fit(); sync(); });
  }

  const navLinks = [...document.querySelectorAll(".nav a[href*='#']")];
  const sections = navLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.toggleAttribute("aria-current", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((section) => spy.observe(section));
  }
})();
