import { createRouter, createWebHistory } from "vue-router";

// 2.Routes
const routes = [
    { name: "root", path: "/", redirect: "/home" },
    { name: "home", path: "/home", component: () => import("@/views/jcl/Home.vue") },
    { name: "public", path: "/public", component: () => import("@/views/jcl/Public.vue") },
    { name: "analysis", path: "/analysis", component: () => import("@/views/jcl/Analysis.vue") },
    { name: "mine", path: "/mine", component: () => import("@/views/jcl/Mine.vue") },
    { name: "view", path: "/view", component: () => import("@/views/jcl/View.vue") },
    { name: "pve", path: "/pve", component: () => import("@/views/jcl/Pve.vue") },
    // { name: "pvp", path: "/pvp", component: () => import("@/views/jcl/Pvp.vue") },
    // { name: "activity", path: "/activity", component: () => import("@/views/jcl/Activity.vue") },
    // { name: "rank", path: "/rank", component: () => import("@/views/jcl/Rank.vue") },
];

// 3.Build An Instance
const router = createRouter({
    history: createWebHistory("jcl"), //history api
    routes,
});

export default router;
