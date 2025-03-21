import chardet from "chardet";
import iconv from "iconv-lite";

onmessage = function (e) {
    const { buffer } = e.data;
    const _buffer = Buffer.from(buffer);
    const _encoding = chardet.detect(_buffer);
    const encoding = _encoding.startsWith("UTF") ? "utf-8" : "gbk";
    console.log(`编码推测 --> ${encoding}`);
    const raw = iconv.decode(Buffer.from(buffer), encoding);
    postMessage({ raw });
    close();
};
