import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("news", "routes/news-all.tsx"),
    route("news/:slug", "routes/news-detail.tsx"),
    route("about", "routes/about.tsx"),
    route("about/emblem", "routes/college-emblem.tsx"),
    route("about/songs", "routes/college-songs.tsx"),
    route("about/statistics", "routes/about-statistics.tsx"),
    route("programs", "routes/programs.tsx"),
    route("programs/:slug", "routes/program-detail.tsx"),
    route("personnel", "routes/personnel.tsx"),
    route("join-us", "routes/join-us.tsx"),
    route("contact", "routes/contact.tsx"),
    route("downloads/:slug?", "routes/downloads.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
    route("terms-of-service", "routes/terms-of-service.tsx"),
    route("sitemap", "routes/sitemap.tsx"),

    // Backoffice Routes
    route("admin/login", "routes/admin/login.tsx"),
    route("admin", "routes/admin/layout.tsx", [
        index("routes/admin/dashboard.tsx"),
        route("users", "routes/admin/users.tsx"),
        route("news", "routes/admin/news.tsx"),
        route("news/create", "routes/admin/news-create.tsx"),
        route("news/edit/:id", "routes/admin/news-edit.tsx"),
        route("carousel", "routes/admin/carousel.tsx"),
        route("popups", "routes/admin/popups.tsx"),
        route("calendar", "routes/admin/calendar.tsx"),
        route("curricula", "routes/admin/curricula.tsx"),
        route("curricula-create", "routes/admin/curricula-create.tsx"),
        route("curricula-edit/:id", "routes/admin/curricula-edit.tsx"),
        route("personnel", "routes/admin/personnel.tsx"),
        route("jobs", "routes/admin/recruit-test.tsx"),
        route("settings", "routes/admin/site-config.tsx"),
        route("downloads", "routes/admin/downloads.tsx"),
        route("statistics", "routes/admin/statistics.tsx"),
    ]),
] satisfies RouteConfig;

