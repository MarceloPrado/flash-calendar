import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Flash Calendar",
  tagline: "The fastest calendar component for React Native",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://marceloprado.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/flash-calendar/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "marceloprado", // Usually your GitHub org/user name.
  projectName: "flash-calendar", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root.
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: ["@docusaurus/plugin-ideal-image"],

  themeConfig: {
    algolia: {
      appId: "XZ9MYUH844",
      apiKey: "f23abd1fe4bf9bf91c59d7ccd526269d",
      indexName: "marcelopradoio",
    },
    image: "img/social-card.png",
    navbar: {
      title: "Flash Calendar",
      logo: {
        alt: "Flash Calendar Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "defaultSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/marceloprado/flash-calendar",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "More",

          items: [
            {
              label: "GitHub",
              href: "https://github.com/MarceloPrado/flash-calendar",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/marceloterreiro",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marcelo Prado. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
