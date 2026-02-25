"use client";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  const cols = [
    {
      titleKey: "footer_col_trips",
      links: [
        { key: "footer_link_package", href: "/search" },
        { key: "footer_link_cruise", href: "/search" },
        { key: "footer_link_city", href: "/search" },
        { key: "footer_link_hiking", href: "/search" },
        { key: "footer_link_luxury", href: "/search" },
      ],
    },
    {
      titleKey: "footer_col_company",
      links: [
        { key: "nav_about", href: "#" },
        { key: "footer_link_career", href: "#" },
        { key: "footer_link_press", href: "#" },
        { key: "footer_link_partner", href: "#" },
        { key: "nav_contact", href: "#" },
      ],
    },
    {
      titleKey: "footer_col_legal",
      links: [
        { key: "footer_privacy", href: "#" },
        { key: "footer_terms", href: "#" },
        { key: "footer_imprint", href: "#" },
        { key: "footer_link_cookies", href: "#" },
        { key: "footer_link_sitemap", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white">Monotours<span className="text-blue-400">24</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">{t("footer_tagline")}</p>
            <div className="flex gap-3">
              {(["instagram", "facebook", "twitter"] as const).map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    {social === "instagram" && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    )}
                    {social === "facebook" && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social === "twitter" && (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.titleKey}>
              <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{t(col.titleKey)}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} Monotours24. {t("footer_rights")}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="#" className="hover:text-white transition-colors">{t("footer_privacy")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("footer_terms")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("footer_imprint")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
