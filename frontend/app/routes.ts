import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),
    route("programs", "./routes/programs.tsx"),
    route("staff", "./routes/staff.tsx"),
    route("join-us", "./routes/join-us.tsx"),
    route("contact", "./routes/contact.tsx"),
] satisfies RouteConfig;
