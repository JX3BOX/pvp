/*
 * @Author: X3ZvaWQ x3zvawq@gmail.com
 * @Date: 2023-02-27 20:19:49
 * @LastEditors: X3ZvaWQ x3zvawq@gmail.com
 * @LastEditTime: 2023-04-16 10:50:07
 * @FilePath: /jcl/src/utils/workers/analysis.worker.js
 * @Description:
 */
import { Analyzer } from "@/utils/jcl/analyzer";
import { Adapter } from "@/utils/jcl/adapter";
import { getResource as _getResourceFromApi } from "@/service/jcl/resource.js";
import { isArray, omit } from "lodash-es";
// export 要用的
import { unparse } from "papaparse";
import iconv from "iconv-lite";
import { header, writeRowsToSheet } from "@/utils/jcl/export.js";

const updateResult = (msg, data) => {
    postMessage({ msg, data });
};

// 传递导出进度用的，其他地方用不着
const updateStatus = function (desc, status, processing) {
    postMessage({
        type: "statusUpdated",
        data: { desc, status, processing },
    });
};

async function getResourceFromApi(resourceList, client = "std") {
    let result = {};
    let buff_res = await _getResourceFromApi({
        client,
        type: "buff",
        ids: [...resourceList.buff],
        fields: ["BuffID", "Level", "IconID", "Name", "BuffName", "Desc"],
    });
    let skill_res = await _getResourceFromApi({
        client,
        type: "skill",
        ids: [...resourceList.skill],
        fields: ["SkillID", "Level", "MaxLevel", "IconID", "Name", "SkillName", "Desc"],
    });
    if (buff_res.data) {
        buff_res.data = isArray(buff_res.data) ? buff_res.data : [buff_res.data];
        for (let buff of buff_res.data) {
            if (buff.BuffID == 0) continue;
            const key = `buff:${buff.BuffID}_${buff.Level ?? ""}`;
            const value = {
                id: buff.BuffID,
                level: buff.Level || 0,
                icon: buff.IconID,
                name: buff.Name,
                remark: buff.BuffName,
                desc: buff.Desc,
            };
            result[key] = value;
        }
    }
    if (skill_res.data) {
        skill_res.data = isArray(skill_res.data) ? skill_res.data : [skill_res.data];
        for (let skill of skill_res.data) {
            if (skill.SkillID == 0) continue;
            const key = `skill:${skill.SkillID}_${skill.Level ?? skill.MaxLevel}`;
            const value = {
                id: skill.SkillID,
                level: skill.Level ?? skill.MaxLevel,
                icon: skill.IconID,
                name: skill.Name,
                remark: skill.SkillName,
                desc: skill.Desc,
            };
            result[key] = value;
        }
    }
    return result;
}

/**
 * @type {Analyzer}
 */
let analyzer;
/**
 * @type {Adapter}
 */
let adapter;
onmessage = async ({ data: { action, data } }) => {
    if (action == "init") {
        const { raw, params } = data;
        adapter = new Adapter({});
        analyzer = new Analyzer(raw, params);
        analyzer.bindAdapter(adapter);

        updateResult("init", true);
    } else if (action == "get_all") {
        const counter = analyzer.getAll();
        let finished = false;
        while (!finished) {
            let { done, value } = counter.next();
            if (!done) {
                const { index, length } = value;
                if (index % 100 == 0) updateResult("progress", index / length);
            } else {
                finished = true;
                updateResult("progress", 1);
                let { resources, client } = value;
                value.resources = await getResourceFromApi(resources, client);
                updateResult("all", omit(value, "rows"));
            }
        }
    } else if (action == "export") {
        const logs = analyzer.adapter.getPveLogs(data);
        const window = { $store: analyzer.result };
        updateStatus("整理原始数据", 1, 25);
        const headerValues = header.map((item) => item.value);
        // 从window中取出所有的资源
        updateStatus("构建CSV表格", 0);
        let exporter = writeRowsToSheet(logs, window.$store);
        let result;
        while (!(result = exporter.next()).done) {
            updateStatus("构建CSV表格", 0, 25 + result.value * 0.65);
        }
        // 将数据转换为csv格式
        let csv = unparse(result.value, { columns: headerValues });
        updateStatus("构建CSV表格", 1, 90);
        // 结果写入到u8数组
        updateStatus("构建完成，下载马上开始", 0);
        const u8 = iconv.encode(csv, "gbk");
        csv = null;
        updateResult("exportResult", u8);
    } else {
        // get_aa_bb -> getAaBb
        const methodName = action.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
        const result = analyzer.adapter[methodName](data);
        postMessage(result);
    }
};
