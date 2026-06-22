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

function getWaveSvg(direction) {
  if (direction === "from-right") {
    return `
      <svg viewBox="0 0 1400 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="waveGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
            <stop offset="16%" stop-color="#bff5ff" stop-opacity="0.98" />
            <stop offset="44%" stop-color="#31bfff" stop-opacity="0.98" />
            <stop offset="72%" stop-color="#0065d8" stop-opacity="0.98" />
            <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M1400 0 H470
             C330 70 525 165 360 275
             C185 390 555 505 330 650
             C255 700 220 755 245 800
             H1400 Z"
          fill="url(#waveGradientRight)"
        />

        <path
          class="wave-foam"
          d="M470 0
             C330 70 525 165 360 275
             C185 390 555 505 330 650
             C255 700 220 755 245 800"
        />

        <path
          class="wave-foam soft"
          d="M570 0
             C435 88 610 174 455 285
             C302 395 655 520 440 665
             C370 716 340 762 365 800"
        />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 1400 800" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="waveGradientLeft" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="16%" stop-color="#bff5ff" stop-opacity="0.98" />
          <stop offset="44%" stop-color="#31bfff" stop-opacity="0.98" />
          <stop offset="72%" stop-color="#0065d8" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#020b24" stop-opacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M0 0 H930
           C1070 70 875 165 1040 275
           C1215 390 845 505 1070 650
           C1145 700 1180 755 1155 800
           H0 Z"
        fill="url(#waveGradientLeft)"
      />

      <path
        class="wave-foam"
        d="M930 0
           C1070 70 875 165 1040 275
           C1215 390 845 505 1070 650
           C1145 700 1180 755 1155 800"
      />

      <path
        class="wave-foam soft"
        d="M830 0
           C965 88 790 174 945 285
           C1098 395 745 520 960 665
           C1030 716 1060 762 1035 800"
      />
    </svg>
  `;
}

function createWaveTransition(x, y) {
  const direction = x > window.innerWidth / 2 ? "from-right" : "from-left";

  const transition = document.createElement("div");
  transition.className = `wave-transition ${direction}`;

  transition.style.setProperty("--x", `${x}px`);
  transition.style.setProperty("--y", `${y}px`);

  const ripple1 = document.createElement("span");
  ripple1.className = "wave-ripple";

  const ripple2 = document.createElement("span");
  ripple2.className = "wave-ripple second";

  const ripple3 = document.createElement("span");
  ripple3.className = "wave-ripple third";

  transition.appendChild(ripple1);
  transition.appendChild(ripple2);
  transition.appendChild(ripple3);

  const oceanWave = document.createElement("div");
  oceanWave.className = "ocean-wave";
  oceanWave.innerHTML = getWaveSvg(direction);

  transition.appendChild(oceanWave);

  const dropletCount = 12;

  for (let i = 0; i < dropletCount; i++) {
    const droplet = document.createElement("span");
    droplet.className = "wave-droplet";

    const top = 8 + Math.random() * 84;
    const size = 6 + Math.random() * 20;
    const delay = Math.random() * 0.12;
    const floatY = -60 + Math.random() * 120;

    droplet.style.setProperty("--top", `${top}%`);
    droplet.style.setProperty("--size", `${size}px`);
    droplet.style.setProperty("--delay", `${delay}s`);
    droplet.style.setProperty("--float-y", `${floatY}px`);

    transition.appendChild(droplet);
  }

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

  createWaveTransition(x, y);

  setTimeout(() => {
    window.location.href = link.href;
  }, 420);
});
