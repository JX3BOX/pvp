import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import { createHead } from "@vueuse/head";
const head = createHead();
app.use(head);

// router
import router from "./router.js";
app.use(router);

// element-plus 引入
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/assets/css/jcl/element-override.less";
import "@/assets/css/jcl/app.less";
app.use(ElementPlus);

// 全量导入element-plus的图标，因为公共库里的图标全都妹有import Orz
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// pinia
import { createPinia } from "pinia";
app.use(createPinia());

// echarts
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, CustomChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent, DataZoomComponent } from "echarts/components";
use([
    CanvasRenderer,
    LineChart,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    BarChart,
    CustomChart,
]);

import { install } from "@jx3box/jx3box-vue3-ui";
install(app);

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.installVue3(app);

app.mount("#app");
