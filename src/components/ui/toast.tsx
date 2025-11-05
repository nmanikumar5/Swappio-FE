// minimal toast helper (no React runtime usage)

type ToastProps = {
  type?: "success" | "error" | "info";
  title?: string;
  description?: string;
};

export function showToast({ type = "info", title, description }: ToastProps) {
  // Minimal toast using browser notifications fallback to alert when not available.
  // Keep implementation tiny to avoid new dependencies. Consumers should replace
  // with a fancier toast system later.
  const text = title
    ? `${title}${description ? " — " + description : ""}`
    : description || "";
  if (typeof window !== "undefined" && "document" in window) {
    // create ephemeral toast div
    const containerId = "swappio-toast-container";
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.position = "fixed";
      container.style.right = "16px";
      container.style.top = "16px";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }

    const el = document.createElement("div");
    el.style.marginTop = "8px";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "8px";
    el.style.color = "#fff";
    el.style.minWidth = "200px";
    el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
    el.style.fontSize = "14px";
    el.style.opacity = "0";
    el.style.transition = "opacity 180ms ease, transform 180ms ease";
    el.style.transform = "translateY(-6px)";
    if (type === "success") el.style.background = "#16a34a";
    else if (type === "error") el.style.background = "#dc2626";
    else el.style.background = "#0ea5e9";

    el.textContent = text;
    container.appendChild(el);

    // animate in
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    // remove after 3.5s
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-6px)";
      setTimeout(() => el.remove(), 220);
    }, 3500);
    return;
  }

  // fallback
  alert(
    `${type.toUpperCase()} ${title ? title + ": " : ""}${description || ""}`
  );
}

export default function ToastPlaceholder() {
  return null;
}
