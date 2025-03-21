import { ref } from "vue";
import { useStore } from "@/pages/jcl/store.js";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import PakoWorker from "@/utils/jcl/workers/pako.worker.js";
import jx3box_url from "@jx3box/jx3box-common/data/jx3box.json";
import axios from "axios";

const { __ossMirror, __down } = jx3box_url;
const store = useStore();

// 解析下载链接
const resolveDownLink = (url, fromOrigin = false) => {
    if (url.startsWith("http")) {
        return resolveImagePath(url);
    } else {
        // const downRoot = process.env.NODE_ENV === "production" ? __down : "/";
        // const cdnRoot = process.env.NODE_ENV === "production" ? __ossMirror : "/";
        const downRoot = __down;
        const cdnRoot = __ossMirror;
        return (fromOrigin ? cdnRoot : downRoot) + url?.slice(1);
    }
};

export function useDownload() {
    const downProgress = ref(0);
    const inflateProgress = ref(0);
    const downloadError = ref(false);
    // 下载
    const download = (fromOrigin = false) => {
        const raw = store.info.raw;
        const url = resolveDownLink(raw, fromOrigin);
        return axios({
            url,
            method: "GET",
            responseType: "blob",
            onDownloadProgress: (e) => {
                const downloadProgress = e.loaded / e.total;
                downProgress.value = downloadProgress * 100;
            },
        });
    };

    // 解压
    const inflate = async (data) => {
        const arrayBuffer = await data.arrayBuffer();
        await new Promise((resolve) => {
            const worker = new PakoWorker();
            worker.onmessage = (e) => {
                e = e.data;
                if (e.type == "progress") {
                    inflateProgress.value = e.data;
                } else if (e.type == "result") {
                    store.raw = e.data;
                    worker.terminate();
                    resolve(true);
                }
            };
            worker.postMessage({ type: "inflate", raw: arrayBuffer });
        });
    };

    const startDownload = async () => {
        store.raw = "";
        return download(true)
            .catch(() => download(true))
            .catch(() => {
                downloadError.value = true;
                throw new Error("下载失败");
            })
            .then((res) => {
                const { data } = res;
                return inflate(data);
            });
    };

    return { downProgress, inflateProgress, downloadError, startDownload };
}
