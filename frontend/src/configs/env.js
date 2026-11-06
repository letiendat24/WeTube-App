/**
 * Centralized environment configuration.
 *
 * All env variables live in `.env`, `.env.development`, `.env.production`
 * at the project root. Anything exposed to the browser MUST be prefixed
 * with `VITE_` (Vite convention).
 *
 * Import this file instead of touching `import.meta.env` directly so we
 * have a single source of truth and a safe fallback when a variable is
 * missing.
 */

const fallbackBaseUrl = "http://localhost:3000/api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const ENV = {
    appEnv: import.meta.env.VITE_APP_ENV || "development",
    apiBaseUrl: rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : fallbackBaseUrl,
};

export default ENV;
