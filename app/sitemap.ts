import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours-data";

const BASE_URL = "https://monotours24.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const tourRoutes = tours.map((tour) => ({
    url: `${BASE_URL}/tours/${tour.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...tourRoutes,
  ];
}
