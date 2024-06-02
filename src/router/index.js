// 1.Dependency
import { createRouter, createWebHistory } from "vue-router";

// 2.Components
const Index = () => import("@/views/Index.vue");
const Sandbox = () => import("@/views/Sandbox.vue");
const CJ = () => import("@/views/CJ.vue");
const ChangeLog = () => import("@/views/ChangeLog.vue");
const Post = () => import("@/views/Post.vue");

// 3.Routes
const routes = [
    { path: "/", name: "post", component: Post },
    { path: "/index", name: "index", component: Index },
    { path: "/sandbox", name: "sandbox", component: Sandbox },
    { path: "/desert", name: "desert", component: CJ },
    { path: "/changelog", name: "changelog", component: ChangeLog },
    { path: "/:id(\\d+)", name: "single", component: () => import("@/views/Single.vue") },
];

// 4.Build An Instance
const router = createRouter({
    history: createWebHistory("/pvp"),
    routes: routes,
});

export default router;
