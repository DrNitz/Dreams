/* DrDreams shared behaviour. No dependencies.
   Everything here has a visible effect. If an element is not on the page, its handler does nothing. */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* Theme. Saved choice wins, otherwise the system preference decides through CSS. */
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  try {
    var saved = localStorage.getItem("drdreams-theme");
    if (saved === "dark" || saved === "light") applyTheme(saved);
  } catch (e) {
    /* Private mode blocks storage. The CSS preference still applies. */
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effectiveTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return systemPrefersDark() ? "dark" : "light";
  }

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.setAttribute("aria-pressed", effectiveTheme() === "dark" ? "true" : "false");
    themeBtn.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("drdreams-theme", next); } catch (e) {}
    });
  }

  /* Mobile navigation. */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("primary-nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* Header shadow once the page scrolls. */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Wide tables get a swipe hint only when they actually overflow. */
  var tableWraps = document.querySelectorAll(".table-wrap");
  function syncTables() {
    tableWraps.forEach(function (wrap) {
      var caption = wrap.querySelector("caption");
      var alreadySays = caption && /scroll|swipe|sideways/i.test(caption.textContent);
      wrap.classList.toggle("is-scrollable", !alreadySays && wrap.scrollWidth > wrap.clientWidth + 2);
    });
  }
  if (tableWraps.length) {
    syncTables();
    window.addEventListener("resize", syncTables, { passive: true });
  }

  /* One reveal per section, skipped entirely for reduced motion. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Enquiry form: validates, then hands the message to WhatsApp. No backend, nothing stored. */
  var form = document.querySelector("[data-enquiry-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var course = form.elements.course ? form.elements.course.value.trim() : "";
      var question = form.elements.question.value.trim();

      if (status) { status.className = "form-status"; status.textContent = ""; }

      if (!name || !phone || !question) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "Add your name, a number we can reach, and what you want to ask.";
        }
        return;
      }
      if (phone.replace(/\D/g, "").length < 8) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "That number looks short. Include the country code.";
        }
        return;
      }

      var lines = [
        "Hello, I found DrDreams.",
        "Name: " + name,
        "Phone: " + phone
      ];
      if (course) lines.push("Interested in: " + course);
      lines.push("", question);

      var url = "https://wa.me/639959164545?text=" + encodeURIComponent(lines.join("\n"));
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
      }
      if (status) {
        status.className = "form-status";
        status.textContent = "Opening WhatsApp\u2026";
      }
      window.open(url, "_blank", "noopener");
      if (status) {
        status.className = "form-status ok";
        status.textContent = "Opening WhatsApp. If nothing happens, message +63 995 916 4545 directly.";
      }
      if (submitBtn) {
        window.setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }, 1500);
      }
    });
  }

  /* Gallery lightbox. Buttons carry the image source and caption, so the markup stays readable. */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector("[data-lb-caption]");
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]"));
    var index = 0;
    var lastFocus = null;

    function show(i) {
      if (!triggers.length) return;
      index = (i + triggers.length) % triggers.length;
      var trigger = triggers[index];
      var img = trigger.querySelector("img");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = trigger.getAttribute("data-caption") || "";
    }

    function open(i, trigger) {
      lastFocus = trigger || document.activeElement;
      show(i);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var close = lightbox.querySelector(".lb-close");
      if (close) close.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener("click", function () { open(i, trigger); });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });
    var closeBtn = lightbox.querySelector(".lb-close");
    var prevBtn = lightbox.querySelector(".lb-prev");
    var nextBtn = lightbox.querySelector(".lb-next");
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }

  /* College tabs. The markup ships with every panel visible, so a reader
     without JavaScript gets the full page. This only hides the inactive ones
     after it has confirmed the controls exist. */
  var tabSets = document.querySelectorAll("[data-tabs]");
  tabSets.forEach(function (set) {
    var list = set.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(set.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });
    if (!list || !tabs.length || panels.indexOf(null) !== -1) return;

    function activate(next, moveFocus, updateHash) {
      tabs.forEach(function (tab, i) {
        var selected = i === next;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
        panels[i].hidden = !selected;
        panels[i].classList.toggle("is-active", selected);
      });
      if (moveFocus) tabs[next].focus();
      var id = panels[next].id;
      if (updateHash && id && history.replaceState) {
        history.replaceState(null, "", "#" + id);
      }
    }

    function fromHash() {
      return tabs.findIndex(function (tab) {
        return "#" + tab.getAttribute("aria-controls") === window.location.hash;
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(i, false, true); });
      tab.addEventListener("keydown", function (event) {
        var target = null;
        if (event.key === "ArrowRight") target = (i + 1) % tabs.length;
        if (event.key === "ArrowLeft") target = (i - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = tabs.length - 1;
        if (target === null) return;
        event.preventDefault();
        activate(target, true, true);
      });
    });

    var first = fromHash();
    set.classList.add("is-ready");
    activate(first === -1 ? 0 : first, false, false);

    /* A deep link like colleges.html#dmsf points at a panel that was hidden
       while the page parsed, so the browser's own fragment scroll can miss it.
       Scroll once the panel is visible. */
    if (first !== -1) {
      requestAnimationFrame(function () {
        panels[first].scrollIntoView({ block: "start" });
      });
    }

    /* Links inside a profile point at another tab. Activate it when the hash
       changes, and bring the strip into view so the reader sees the switch. */
    window.addEventListener("hashchange", function () {
      var next = fromHash();
      if (next === -1) return;
      activate(next, false, false);
      set.scrollIntoView({ block: "start" });
    });
  });

})();