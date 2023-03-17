// 1.Dependency
import { createRouter, createWebHistory } from "vue-router";

// 2.Components
const Index = () => import("../views/Index.vue");

// 3.Routes
const routes = [
    { path: "/", name: "index", component: Index },
    { name: "sandbox", path: "/pvp/sandbox", component: () => import("../views/Sandbox.vue") },
];
// 4.Build An Instance
const router = createRouter({
    history: createWebHistory(), //history api
    // base : '/rewrite root',
    routes,
});

export default router;
