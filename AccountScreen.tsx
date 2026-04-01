@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

body {
  overscroll-behavior-y: none; /* Prevents pull-to-refresh jitter on mobile */
}
