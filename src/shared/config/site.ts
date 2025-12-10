export const siteConfig = {
  name: "Relume",
  description: "Professional App built with Next.js and FSD Architecture",
  url: "https://relume.io",
  ogImage: "https://relume.io/og.jpg",
  links: {
    github: "https://github.com/relume",
    twitter: "https://twitter.com/relume",
  },
  nav: {
    main: [
      { title: "Home", href: "/" },
      { title: "Dashboard", href: "/dashboard" },
      { title: "Profile", href: "/profile" },
      { title: "Settings", href: "/settings" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
