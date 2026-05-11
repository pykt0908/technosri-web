import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    route("programs", "./routes/programs.tsx"),
    route("staff", "./routes/staff.tsx"),
    route("join-us", "./routes/join-us.tsx"),
    route("contact", "./routes/contact.tsx"),

    // Backoffice Routes
    route("admin/login", "./routes/admin/login.tsx"),
    route("admin", "./routes/admin/layout.tsx", [
        index("./routes/admin/dashboard.tsx"),
        route("users", "./routes/admin/users.tsx"),
    ]),
] satisfies RouteConfig;
