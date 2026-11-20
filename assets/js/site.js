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

  const toc = document.querySelector(".toc");
  if (toc && prose) {
    const headings = [...prose.querySelectorAll("h2[id], h3[id]")];
    if (headings.length < 2) toc.classList.add("empty");
    const list = toc.querySelector("ol");
    const links = headings.map((heading) => {
      const item = document.createElement("li");
      item.className = `lvl-${heading.tagName[1]}`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.firstChild.textContent.trim();
      item.append(link);
      list.append(item);
      return link;
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "0px 0px -75% 0px" });
    headings.forEach((heading) => observer.observe(heading));
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
      labels.set(element.textContent.replace(/^#/, "").toLowerCase(), element.textContent.replace(/^#/, ""));
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
      document.querySelector(".chip[data-tag-all]")?.setAttribute("aria-pressed", String(!selected.length));
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
