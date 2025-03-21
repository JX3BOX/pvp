import { ref, markRaw } from "vue";
import { useStore } from "@/pages/jcl/store.js";
import { usePve } from "@/pages/jcl/store_pve.js";
import { getRandomColor } from "@/utils/jcl/commonNoStore";
import AnalyzerWorker from "@/utils/jcl/workers/analysis.worker.js";

export function useAnalysis() {
    const store = useStore();
    const progress = ref(0);
    const ready = ref(false);

    const startAnalysis = () => {
        const raw = store.raw;
        // 创建一个worker并初始化
        if (store.worker) store.worker.terminate();
        store.worker = new AnalyzerWorker();
        const worker = store.worker;
        return new Promise((resolve) => {
            worker.onmessage = ({ data: { msg } }) => {
                if (msg == "init") resolve(worker);
            };
            worker.postMessage({ action: "init", data: { raw } });
        }).then((worker) => {
            // 开始分析
            worker.onmessage = ({ data: { msg, data } }) => {
                if (msg == "progress") {
                    // 进度更新
                    progress.value = data * 100;
                } else if (msg == "all") {
                    // 进行一些轻量化的处理
                    let { entities } = data;
                    const colors = getRandomColor();
                    for (let id in entities) {
                        const { value } = colors.next();
                        entities[id].color = value;
                    }
                    // 重置global
                    const global = usePve();
                    global.$reset();
                    // 返回结果
                    if (process?.env?.NODE_ENV === "development") {
                        window.$store = data;
                    }
                    store.result = markRaw(data);
                    ready.value = true;
                }
            };
            worker.postMessage({ action: "get_all" });
        });
    };

    return { progress, ready, startAnalysis };
}
