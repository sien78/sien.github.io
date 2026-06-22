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

function createBubbleTransition(x, y) {
  const transition = document.createElement("div");
  transition.className = "bubble-transition";

  transition.style.setProperty("--x", `${x}px`);
  transition.style.setProperty("--y", `${y}px`);

  const bubbleCount = 16;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("span");
    bubble.className = "transition-bubble";

    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 70;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const floatX = Math.cos(angle) * (80 + Math.random() * 130);
    const floatY = Math.sin(angle) * (80 + Math.random() * 130) - 40;

    const size = 7 + Math.random() * 24;
    const delay = Math.random() * 0.06;

    bubble.style.setProperty("--dx", `${dx}px`);
    bubble.style.setProperty("--dy", `${dy}px`);
    bubble.style.setProperty("--float-x", `${floatX}px`);
    bubble.style.setProperty("--float-y", `${floatY}px`);
    bubble.style.setProperty("--size", `${size}px`);
    bubble.style.setProperty("--delay", `${delay}s`);

    transition.appendChild(bubble);
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

  createBubbleTransition(x, y);

  setTimeout(() => {
    window.location.href = link.href;
  }, 320);
});
