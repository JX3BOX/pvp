// 1.Dependency
import { createRouter, createWebHistory } from "vue-router";

// 2.Components
const Index = () => import("@/views/Index.vue");
const Sandbox = () => import("@/views/Sandbox.vue");
// 3.Routes
const routes = [
    { path: "/", name: "index", component: Index },
    { path: "/sandbox", name: "sandbox", component: Sandbox },
];

// 4.Build An Instance
const router = createRouter({
    history: createWebHistory(),
    base: "/pvp",
    routes,
});

export default router;
