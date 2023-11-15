// 1.Create APP
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

// 2.Components
import { createHead } from "@vueuse/head";
const head = createHead();
app.use(head);

// 路由
import router from "./router/index";
app.use(router);

// 状态管理
import { createPinia } from "pinia";
app.use(createPinia());

// element-plus
import "@jx3box/jx3box-common/css/element-plus-override.scss";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

app.use(ElementPlus, {
    locale: zhCn,
});

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

import { install } from "@jx3box/jx3box-vue3-ui";
install(app);

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.installVue3(app);

// 3.Mount DOM
app.mount("#app");
