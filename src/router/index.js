// 1.Dependency
import { createRouter, createWebHistory } from "vue-router";

// 2.Components
const Index = () => import("@/views/Index.vue");
const Sandbox = () => import("@/views/Sandbox.vue");
const CJ = () => import("@/views/CJ.vue");

// 3.Routes
const routes = [
    { path: "/", name: "index", component: Index },
    { path: "/sandbox", name: "sandbox", component: Sandbox },
    { path: "/cj", name: "cj", component: CJ },
    { name: "post", path: "/:id(\\d+)", component: () => import("@/views/Single.vue") },
];

// 4.Build An Instance
const router = createRouter({
    history: createWebHistory("/pvp"),
    routes: routes,
});

export default router;
