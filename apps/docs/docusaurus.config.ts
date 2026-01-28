import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Legend Calendar",
  tagline: "An incredibly fast and flexible calendar component for React Native",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://leviwilliams.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/legend-calendar/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "LeviWilliams", // Usually your GitHub org/user name.
  projectName: "legend-calendar", // Usually your repo name.
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
      title: "Legend Calendar",
      logo: {
        alt: "Legend Calendar Logo",
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
          href: "https://github.com/LeviWilliams/legend-calendar",
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
              href: "https://github.com/LeviWilliams/legend-calendar",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Levi Williams. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
