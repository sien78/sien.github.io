let isPageTransitioning = false;

function isInternalPageLink(link) {
  const href = link.getAttribute("href");

  if (!href) return false;
  if (href === "#") return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:")) return false;
  if (href.startsWith("tel:")) return false;
  if (link.target === "_blank") return false;
  if (link.hasAttribute("download")) return false;

  const url = new URL(href, window.location.href);
  return url.origin === window.location.origin;
}

function getWhaleWakeSvg(direction) {
  if (direction === "from-right") {
    return `
      <svg viewBox="0 0 1500 950" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="whaleWakeRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96" />
            <stop offset="10%" stop-color="#d9fbff" stop-opacity="0.98" />
            <stop offset="26%" stop-color="#7fe6ff" stop-opacity="0.98" />
            <stop offset="48%" stop-color="#31bfff" stop-opacity="0.98" />
            <stop offset="74%" stop-color="#0065d8" stop-opacity="0.98" />
            <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M1500 -50
             H520
             C345 70 725 190 455 350
             C210 495 790 640 405 820
             C330 855 305 910 350 980
             H1500 Z"
          fill="url(#whaleWakeRight)"
        />

        <path
          class="wake-foam-edge"
          d="M520 -50
             C345 70 725 190 455 350
             C210 495 790 640 405 820
             C330 855 305 910 350 980"
        />

        <path
          class="wake-foam-inner"
          d="M635 -50
             C490 85 835 205 575 365
             C360 498 890 650 535 825
             C475 860 455 920 495 980"
        />

        <path
          class="wake-foam-inner"
          d="M770 -50
             C630 95 950 220 705 380
             C520 505 1000 660 665 830
             C610 865 595 920 630 980"
        />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 1500 950" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="whaleWakeLeft" x1="100%" y1="0%" x2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96" />
          <stop offset="10%" stop-color="#d9fbff" stop-opacity="0.98" />
          <stop offset="26%" stop-color="#7fe6ff" stop-opacity="0.98" />
          <stop offset="48%" stop-color="#31bfff" stop-opacity="0.98" />
          <stop offset="74%" stop-color="#0065d8" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M0 -50
           H980
           C1155 70 775 190 1045 350
           C1290 495 710 640 1095 820
           C1170 855 1195 910 1150 980
           H0 Z"
        fill="url(#whaleWakeLeft)"
      />

      <path
        class="wake-foam-edge"
        d="M980 -50
           C1155 70 775 190 1045 350
           C1290 495 710 640 1095 820
           C1170 855 1195 910 1150 980"
      />

      <path
        class="wake-foam-inner"
        d="M865 -50
           C1010 85 665 205 925 365
           C1140 498 610 650 965 825
           C1025 860 1045 920 1005 980"
      />

      <path
        class="wake-foam-inner"
        d="M730 -50
           C870 95 550 220 795 380
           C980 505 500 660 835 830
           C890 865 905 920 870 980"
      />
    </svg>
  `;
}

function createTailSplash(transition) {
  const splash = document.createElement("div");
  splash.className = "tail-splash";

  splash.innerHTML = `
    <svg viewBox="0 0 310 170" aria-hidden="true">
      <path
        class="splash-line-main"
        d="M18 112
           C58 42 116 128 160 70
           C196 22 236 34 292 76"
      />

      <path
        class="splash-line-sub"
        d="M28 134
           C72 90 114 158 165 106
           C202 70 242 92 286 116"
      />

      <path
        class="splash-line-sub"
        d="M52 82
           C92 48 120 72 148 42
           C170 18 202 20 225 42"
      />

      <circle class="splash-dot d1" cx="85" cy="50" r="5" />
      <circle class="splash-dot d2" cx="132" cy="34" r="4" />
      <circle class="splash-dot d3" cx="205" cy="45" r="6" />
      <circle class="splash-dot d4" cx="245" cy="70" r="4" />
    </svg>
  `;

  transition.appendChild(splash);
}

function createSeaStreaks(transition, direction) {
  const streakCount = 6;

  for (let i = 0; i < streakCount; i++) {
    const streak = document.createElement("span");
    streak.className = "sea-streak";

    const baseAngle = direction === "from-right" ? -28 : 28;
    const angle = baseAngle + (Math.random() - 0.5) * 18;

    const length = 50 + Math.random() * 100;
    const move =
      direction === "from-right"
        ? -(90 + Math.random() * 140)
        : 90 + Math.random() * 140;

    const delay = Math.random() * 0.12;

    streak.style.setProperty("--angle", `${angle}deg`);
    streak.style.setProperty("--length", `${length}px`);
    streak.style.setProperty("--move", `${move}px`);
    streak.style.setProperty("--delay", `${delay}s`);

    transition.appendChild(streak);
  }
}

function createWhaleTransition(x, y) {
  const direction = x > window.innerWidth / 2 ? "from-right" : "from-left";

  const transition = document.createElement("div");
  transition.className = `whale-transition ${direction}`;

  transition.style.setProperty("--x", `${x}px`);
  transition.style.setProperty("--y", `${y}px`);

  createTailSplash(transition);
  createSeaStreaks(transition, direction);

  const wake = document.createElement("div");
  wake.className = "whale-wake";
  wake.innerHTML = getWhaleWakeSvg(direction);

  transition.appendChild(wake);
  document.body.appendChild(transition);
}

document.addEventListener("click", function (event) {
  const link = event.target.closest("a[href]");

  if (!link) return;
  if (!isInternalPageLink(link)) return;

  event.preventDefault();

  if (isPageTransitioning) return;
  isPageTransitioning = true;

  const rect = link.getBoundingClientRect();

  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  createWhaleTransition(x, y);

  setTimeout(() => {
    window.location.href = link.href;
  }, 780);
});
