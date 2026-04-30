"use client";

export default function CookieSettingsButton({ className = "", children = "Cookie settings" }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("apexcoach:open-cookie-settings"));
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
