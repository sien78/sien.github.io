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

function getDiagonalWaveSvg(direction) {
  if (direction === "from-right") {
    return `
      <svg viewBox="0 0 1400 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="sienWaveRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.94" />
            <stop offset="14%" stop-color="#bdf4ff" stop-opacity="0.98" />
            <stop offset="42%" stop-color="#31bfff" stop-opacity="0.98" />
            <stop offset="72%" stop-color="#0065d8" stop-opacity="0.98" />
            <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M1400 0
             H430
             C260 95 540 210 360 330
             C130 485 585 610 330 760
             C250 810 215 860 230 900
             H1400 Z"
          fill="url(#sienWaveRight)"
        />

        <path
          class="wave-highlight"
          d="M430 0
             C260 95 540 210 360 330
             C130 485 585 610 330 760
             C250 810 215 860 230 900"
        />

        <path
          class="wave-highlight soft"
          d="M545 0
             C390 105 650 230 480 350
             C295 485 710 625 470 770
             C400 815 370 862 385 900"
        />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 1400 900" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sienWaveLeft" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.94" />
          <stop offset="14%" stop-color="#bdf4ff" stop-opacity="0.98" />
          <stop offset="42%" stop-color="#31bfff" stop-opacity="0.98" />
          <stop offset="72%" stop-color="#0065d8" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M0 0
           H970
           C1140 95 860 210 1040 330
           C1270 485 815 610 1070 760
           C1150 810 1185 860 1170 900
           H0 Z"
        fill="url(#sienWaveLeft)"
      />

      <path
        class="wave-highlight"
        d="M970 0
           C1140 95 860 210 1040 330
           C1270 485 815 610 1070 760
           C1150 810 1185 860 1170 900"
      />

      <path
        class="wave-highlight soft"
        d="M855 0
           C1010 105 750 230 920 350
           C1105 485 690 625 930 770
           C1000 815 1030 862 1015 900"
      />
    </svg>
  `;
}

function createFoamSplash(x, y, transition) {
  const foam = document.createElement("div");
  foam.className = "foam-splash";

  foam.innerHTML = `
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <path
        class="foam-line"
        d="M10 70
           C45 25 85 95 122 50
           C155 12 185 80 230 35"
      />
      <path
        class="foam-line thin"
        d="M18 92
           C58 62 82 118 126 78
           C160 48 190 102 224 70"
      />
    </svg>
  `;

  transition.appendChild(foam);
}

function createDroplets(x, y, transition) {
  const dropletCount = 10;

  for (let i = 0; i < dropletCount; i++) {
    const droplet = document.createElement("span");
    droplet.className = "sea-droplet";

    const angle = -Math.PI / 4 + (Math.random() - 0.5) * Math.PI;
    const distance = 50 + Math.random() * 130;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    const size = 5 + Math.random() * 15;
    const delay = Math.random() * 0.08;

    droplet.style.setProperty("--size", `${size}px`);
    droplet.style.setProperty("--move-x", `${moveX}px`);
    droplet.style.setProperty("--move-y", `${moveY}px`);
    droplet.style.setProperty("--delay", `${delay}s`);

    transition.appendChild(droplet);
  }
}

function createSeaTransition(x, y) {
  const direction = x > window.innerWidth / 2 ? "from-right" : "from-left";

  const transition = document.createElement("div");
  transition.className = `sea-transition ${direction}`;

  transition.style.setProperty("--x", `${x}px`);
  transition.style.setProperty("--y", `${y}px`);

  createFoamSplash(x, y, transition);
  createDroplets(x, y, transition);

  const wave = document.createElement("div");
  wave.className = "diagonal-wave";
  wave.innerHTML = getDiagonalWaveSvg(direction);

  transition.appendChild(wave);
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

  createSeaTransition(x, y);

  setTimeout(() => {
    window.location.href = link.href;
  }, 460);
});
