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

  /* Keep the current page in view in the scrollable header navigation. */
  var nav = document.getElementById("primary-nav");

  function revealActiveLink() {
    if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return;
    var active = nav.querySelector('a[aria-current="page"]');
    if (!active) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    active.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  revealActiveLink();
  window.addEventListener("orientationchange", revealActiveLink);

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

  /* Enquiry form: one question, handed to WhatsApp. No backend, nothing stored. */
  function initEnquiryForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      var field = form.querySelector("textarea");
      var question = field ? field.value.trim() : "";

      if (status) { status.className = "form-status"; status.textContent = ""; }

      if (!question) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "Write your question first.";
        }
        if (field) field.focus();
        return;
      }

      var url = "https://wa.me/639959164545?text=" + encodeURIComponent(question);
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
  Array.prototype.forEach.call(document.querySelectorAll("[data-enquiry-form]"), initEnquiryForm);

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

  /* College tabs. Every panel ships visible so a reader without JavaScript
     gets the full page; hiding happens only after the controls are confirmed. */
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

    /* A deep link can point at a panel hidden during parse, so the browser's
       fragment scroll misses it. Scroll again once the panel is visible. */
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

  /* Floating Ask DrDreams button: site-only answers plus the WhatsApp enquiry. */
  function initAskPopup() {
    var fab = document.getElementById("drask-fab");
    var popup = document.getElementById("drask-popup");
    var backdrop = document.getElementById("drask-backdrop");
    var closeBtn = document.getElementById("drask-close");
    if (!fab || !popup) return;

    var dialog = popup.querySelector(".drask-dialog");
    var head = dialog ? dialog.querySelector(".drask-head") : null;
    var desc = dialog ? dialog.querySelector(".drask-desc") : null;
    var form = dialog ? dialog.querySelector("[data-enquiry-form]") : null;
    if (!dialog || !head) return;

    if (desc) {
      desc.textContent = "Answers from this site only. Ask a question, or send it to Dr Nitz on WhatsApp.";
    }

    var tabs = document.createElement("div");
    tabs.className = "drask-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Ask DrDreams mode");
    tabs.innerHTML =
      '<button type="button" class="drask-tab is-active" data-drask-mode="chat" role="tab" aria-selected="true">Search answers</button>' +
      '<button type="button" class="drask-tab" data-drask-mode="human" role="tab" aria-selected="false">Ask Dr Nitz</button>';

    var chat = document.createElement("div");
    chat.className = "drask-chat";
    chat.setAttribute("role", "tabpanel");
    chat.setAttribute("aria-label", "Search answers");
    chat.innerHTML =
      '<div class="drask-log" role="log" aria-live="polite" aria-label="Answers from this site"></div>' +
      '<div class="drask-chips" aria-label="Suggested questions"></div>' +
      '<form class="drask-composer">' +
      '<label class="sr-only" for="drask-chat-input">Ask a question</label>' +
      '<input id="drask-chat-input" type="text" autocomplete="off" placeholder="Ask about fees, visa, FMGE, food...">' +
      '<button type="submit" aria-label="Send question">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
      '</button></form>';

    head.after(tabs);
    tabs.after(chat);
    if (form) form.hidden = true;

    var log = chat.querySelector(".drask-log");
    var chips = chat.querySelector(".drask-chips");
    var composer = chat.querySelector(".drask-composer");
    var input = chat.querySelector("input");
    var starters = [
      "Is the Philippines safe for Indian students?",
      "Will I get Indian food?",
      "Where is the cheapest place to live?",
      "Has NExT replaced FMGE yet?",
      "How long does the whole process take?"
    ];

    starters.forEach(function (question) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "drask-chip";
      chip.textContent = question;
      chip.addEventListener("click", function () { ask(question); });
      chips.appendChild(chip);
    });

    var stop = {
      the: 1, a: 1, an: 1, is: 1, are: 1, do: 1, does: 1, i: 1, my: 1, to: 1, for: 1,
      in: 1, on: 1, of: 1, and: 1, or: 1, what: 1, how: 1, can: 1, we: 1, you: 1, it: 1,
      be: 1, with: 1, about: 1, from: 1, at: 1, as: 1, by: 1, if: 1, this: 1, that: 1,
      there: 1, here: 1, will: 1, should: 1, need: 1, have: 1, has: 1, was: 1, were: 1,
      did: 1, get: 1, got: 1, much: 1, many: 1, when: 1, where: 1, who: 1, why: 1, which: 1
    };
    var synonyms = {
      fee: "fees cost price tuition", fees: "fee cost price tuition",
      cost: "fee fees price tuition", price: "fee fees cost tuition",
      visa: "9f conversion extension", "9f": "visa conversion extension",
      hostel: "rent room accommodation", rent: "hostel room accommodation",
      room: "rent hostel accommodation", accommodation: "room hostel rent",
      food: "mess indian restaurant", mess: "food indian restaurant",
      fmge: "next exam screening", next: "fmge exam screening", exam: "fmge next screening",
      internship: "crmi", crmi: "internship",
      safe: "safety crime", safety: "safe crime", crime: "safety safe",
      college: "colleges university", colleges: "college university",
      flight: "ticket travel", ticket: "flight travel",
      neet: "eligibility certificate", pcc: "police clearance"
    };

    var answers = null;
    var pending = null;

    function assetBase() {
      var link = document.querySelector('link[rel="stylesheet"][href$="site.css"]');
      var href = link ? link.getAttribute("href") : "assets/site.css";
      return href.replace(/site\.css$/, "");
    }

    function loadAnswers() {
      if (answers) return Promise.resolve(answers);
      if (!pending) {
        pending = fetch(assetBase() + "answers.json")
          .then(function (response) { return response.ok ? response.json() : []; })
          .catch(function () { return []; })
          .then(function (data) { answers = data; return data; });
      }
      return pending;
    }

    function unique(list) {
      return list.filter(function (item, index) { return list.indexOf(item) === index; });
    }

    function words(value) {
      return String(value || "").toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(function (word) { return word.length > 1 && !stop[word]; });
    }

    function expanded(word) {
      return [word].concat((synonyms[word] || "").split(" ").filter(Boolean));
    }

    function score(query, entry) {
      var terms = unique(words(query).reduce(function (all, word) {
        return all.concat(expanded(word));
      }, []));
      if (!terms.length) return 0;
      var question = words(entry.q);
      var keywords = words(entry.k);
      var answer = words(entry.a);
      var total = 0;
      var strong = false;
      terms.forEach(function (term) {
        if (question.indexOf(term) !== -1) { total += 3; strong = true; }
        else if (keywords.indexOf(term) !== -1) { total += 2; strong = true; }
        else if (answer.indexOf(term) !== -1) { total += 1; }
      });
      return strong ? total : 0;
    }

    function addMessage(text, who, entry, question) {
      var row = document.createElement("div");
      row.className = "drask-msg " + who;
      var bubble = document.createElement("div");
      bubble.className = "drask-bubble";
      bubble.textContent = text;

      if (entry) {
        var link = document.createElement("a");
        link.href = entry.u;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Source: " + entry.s;
        bubble.appendChild(link);
      }
      if (question) {
        var browse = document.createElement("a");
        browse.href = assetBase() + "faq/";
        browse.textContent = "Browse all questions";
        bubble.appendChild(browse);
        var handoff = document.createElement("button");
        handoff.type = "button";
        handoff.className = "drask-handoff";
        handoff.textContent = "Ask Dr Nitz on WhatsApp";
        handoff.addEventListener("click", function () {
          switchMode("human");
          var field = form ? form.querySelector("textarea") : null;
          if (field) field.value = question;
        });
        bubble.appendChild(handoff);
      }

      row.appendChild(bubble);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
    }

    function ask(text) {
      var question = String(text || "").trim();
      if (!question) return;
      addMessage(question, "user", null, null);
      input.value = "";

      loadAnswers().then(function (data) {
        var ranked = data.map(function (entry) {
          return { entry: entry, score: score(question, entry) };
        }).filter(function (item) { return item.score >= 3; })
          .sort(function (a, b) { return b.score - a.score; });

        var seen = {};
        var top = [];
        for (var i = 0; i < ranked.length && top.length < 2; i++) {
          if (top.length === 1 && ranked[i].score < ranked[0].score - 2) break;
          var entry = ranked[i].entry;
          var key = entry.u + "|" + entry.q;
          if (seen[key]) continue;
          seen[key] = true;
          top.push(entry);
        }

        if (!top.length) {
          addMessage("I cannot find that answer on this site. Ask Dr Nitz, or read the questions page.", "bot", null, question);
          return;
        }
        top.forEach(function (entry) { addMessage(entry.a, "bot", entry, null); });
      });
    }

    function switchMode(mode) {
      var isChat = mode === "chat";
      Array.prototype.forEach.call(tabs.querySelectorAll(".drask-tab"), function (button) {
        var active = button.getAttribute("data-drask-mode") === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
      });
      chat.hidden = !isChat;
      if (form) form.hidden = isChat;
    }

    tabs.addEventListener("click", function (event) {
      var button = event.target.closest(".drask-tab");
      if (button) switchMode(button.getAttribute("data-drask-mode"));
    });
    composer.addEventListener("submit", function (event) {
      event.preventDefault();
      ask(input.value);
    });

    var lastFocus = null;

    function focusable() {
      return Array.prototype.slice.call(dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
      )).filter(function (element) {
        return !element.hidden && !element.closest("[hidden]") && element.offsetParent !== null;
      });
    }

    function open(event) {
      if (event) event.preventDefault();
      lastFocus = document.activeElement;
      popup.classList.add("is-open");
      popup.style.visibility = "visible";
      popup.setAttribute("aria-hidden", "false");
      fab.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) {
        window.setTimeout(function () {
          if (popup.classList.contains("is-open")) closeBtn.focus();
        }, 0);
      }
    }

    function close() {
      popup.classList.remove("is-open");
      popup.style.visibility = "";
      popup.setAttribute("aria-hidden", "true");
      fab.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    fab.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (event) {
      if (!popup.classList.contains("is-open")) return;
      if (event.key === "Escape") { close(); return; }
      if (event.key !== "Tab") return;
      var items = focusable();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAskPopup);
  } else {
    initAskPopup();
  }

})();