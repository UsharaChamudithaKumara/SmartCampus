import React, { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-gsi-client";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ clientId, onCredential, label = "Continue with Google", width = 360 }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!clientId) return;

      try {
        await loadGoogleScript();
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              onCredential(response.credential);
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width,
          logo_alignment: "left",
        });

        setReady(true);
      } catch {
        setReady(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, width]);

  if (!clientId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID to enable it.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={buttonRef} className="w-full flex justify-center" aria-label={label} />
      {!ready && <p className="text-xs text-slate-500 text-center">Loading Google sign-in...</p>}
    </div>
  );
}