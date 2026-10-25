import config from "@maat-apps/config/prettier";

export default {
  ...config,
  // Tailwind v4 sorts classes against the app's own stylesheet.
  tailwindStylesheet: "./src/app/globals.css",
};
