import type { MetadataRoute } from "next";

const pages = ["signup", "login", "searchfriends", "friendrequests", "friends", "bots", "profile"];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.FRONTEND_API;

    const pagesUrl = pages.map(page => ({
        url: `${baseUrl}/${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            priority: 1,
        },
        ...pagesUrl,
    ];
}
