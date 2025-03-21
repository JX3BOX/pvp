import { Deflate, Inflate } from "pako";
import iconv from "iconv-lite";

const postProgress = (progress) =>
    postMessage({
        type: "progress",
        data: progress,
    });

const postResult = (result) =>
    postMessage({
        type: "result",
        data: result,
    });

onmessage = function (e) {
    const { cmd, raw } = e.data;
    postProgress(-1);
    const result = cmd == "deflate" ? deflate(raw) : inflate(raw);
    postResult(result);
    close();
};

/* GBK编码字符串 -> buffer */
const deflate = (raw) => {
    let uint8Array = new Uint8Array(iconv.encode(raw, "gbk"));
    let deflator = new Deflate({ gzip: true });
    let len = uint8Array.length;
    let end = 0;
    for (let i = 0; i < 100; i++) {
        let newEnd = Math.floor(((i + 1) * len) / 100);
        deflator.push(uint8Array.slice(end, newEnd), i === 99);
        postProgress(i + 1);
        end = newEnd;
    }
    let result = deflator.result.buffer;
    return result;
};

/* buffer -> GBK编码字符串 */
const inflate = (raw) => {
    let uint8Array = new Uint8Array(raw);
    let inflator = new Inflate({ gzip: true });
    let len = uint8Array.length;
    let end = 0;
    for (let i = 0; i < 100; i++) {
        let newEnd = Math.floor(((i + 1) * len) / 100);
        inflator.push(uint8Array.slice(end, newEnd));
        postProgress(i + 1);
        end = newEnd;
    }
    let result = iconv.decode(inflator.result, "gbk");
    return result;
};
