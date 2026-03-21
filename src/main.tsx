import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress known Firebase unhandled errors from showing standard Vite/React error overlays
window.addEventListener('error', (event) => {
  if (event.error && event.error.name === 'FirebaseError') {
    console.warn('Caught FirebaseError:', event.error);
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'FirebaseError') {
    console.warn('Caught unhandled FirebaseError:', event.reason);
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
