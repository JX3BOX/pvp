import {
    getResource,
    getResourceIcon,
    getResourceName,
    getRandomColor,
    getEntityName,
    getEntityColor,
    displayPercent,
    displayDigits,
    displayDuration,
} from "./commonNoStore";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { pick } from "lodash-es";
import { raid_analysis_constant } from "@/assets/data/jcl/raid_constant.js";

export class Adapter {
    constructor(result) {
        this.result = result;
    }

    bindAnalyzer(analyzer) {
        /**
         * @type {import('./analyzer').Analyzer}
         */
        this.analyzer = analyzer;
        this.result = analyzer.result;
    }

    updateResult(result) {
        this.result = result;
    }
    sum(array) {
        let total = 0;
        for (let count = 0; count < array.length; count++) {
            total = total + array[count];
        }
        return total;
    }

    getIndividualBuffCoverage(params) {
        const { query_buff_list } = params;
        const { player_list, buff, end } = this.result;
        let result = [];
        for (let [buffid, level] of Object.entries(query_buff_list)) {
            let query_key = buffid + "_" + level;
            let name = getResource("buff:" + query_key, this.result).name;
            let this_buff_result = {
                name: name,
                id: buffid,
                level: level,
                average_stack_per_player: [],
                average_stack: 0,
                average_coverage_per_player: [],
                average_coverage: 0,
                times_per_player: [],
                buffed_player: [],
                average_times_per_player: 0,
                min_stack: 0,
                max_stack: 0,
                query_key: "buff:" + query_key,
            };
            let tot_stack = 0;
            let min_stack = Number.MAX_SAFE_INTEGER;
            let max_stack = 0;
            let tot_duration = 0;
            for (let player of player_list) {
                tot_stack = 0;
                tot_duration = 0;
                if (buff[player]?.[query_key]) {
                    for (let res of buff[player][query_key]["logs"]) {
                        tot_stack += res.stack;
                        min_stack = Math.min(res.stack, min_stack);
                        max_stack = Math.max(res.stack, max_stack);
                        // 超过战斗结束时间的均不计算，早于战斗开始时间的也不计算
                        tot_duration =
                            tot_duration + Math.abs(Math.min(res.end, end.sec * 1000) - Math.max(0, res.start));
                    }
                    this_buff_result.average_stack_per_player.push(tot_stack / buff[player][query_key]["logs"].length);
                    this_buff_result.average_coverage_per_player.push(Math.min(1, tot_duration / 1000 / end.sec));
                    this_buff_result.times_per_player.push(buff[player][query_key]["logs"].length);
                    this_buff_result.buffed_player.push(player);
                }
            }
            if (max_stack != 0) {
                this_buff_result.average_stack = Math.floor(
                    this.sum(this_buff_result.average_stack_per_player) /
                        this_buff_result.average_stack_per_player.length
                );
                this_buff_result.average_coverage = (
                    this.sum(this_buff_result.average_coverage_per_player) /
                    this_buff_result.average_coverage_per_player.length
                ).toFixed(4);
                this_buff_result.average_times_per_player = (
                    this.sum(this_buff_result.times_per_player) / this_buff_result.times_per_player.length
                ).toFixed(1);
                this_buff_result.min_stack = min_stack;
                this_buff_result.max_stack = max_stack;
                result.push(this_buff_result);
            }
        }

        return result;
    }

    getTeamBuffCoverage(params) {
        const { query_buff_list } = params;
        const { player_list, buff, end } = this.result;
        let result = [];
        for (let [buffid, level] of Object.entries(query_buff_list)) {
            let query_key = buffid + "_" + level;
            let name = getResource("buff:" + query_key, this.result).name;
            let this_buff_result = {
                name: name,
                id: buffid,
                level: level,
                average_stack_per_player: [],
                average_stack: 0,
                average_coverage_per_player: [],
                average_coverage: 0,
                times_per_player: [],
                average_times_per_player: 0,
                min_stack: 0,
                max_stack: 0,
                query_key: "buff:" + query_key,
            };
            let tot_stack = 0;
            let min_stack = Number.MAX_SAFE_INTEGER;
            let max_stack = 0;
            let tot_duration = 0;
            for (let player of player_list) {
                tot_stack = 0;
                tot_duration = 0;
                if (buff[player]?.[query_key]) {
                    for (let res of buff[player][query_key]["logs"]) {
                        tot_stack += res.stack;
                        min_stack = Math.min(res.stack, min_stack);
                        max_stack = Math.max(res.stack, max_stack);
                        tot_duration =
                            tot_duration + Math.abs(Math.min(res.end, end.sec * 1000) - Math.max(0, res.start));
                    }
                    this_buff_result.average_stack_per_player.push(tot_stack / buff[player][query_key]["logs"].length);
                    // 超过战斗结束时间的均不计算，早于战斗开始时间的也不计算
                    this_buff_result.average_coverage_per_player.push(Math.min(1, tot_duration / 1000 / end.sec));
                    this_buff_result.times_per_player.push(buff[player][query_key]["logs"].length);
                }
            }
            if (max_stack != 0) {
                this_buff_result.average_stack = Math.floor(
                    this.sum(this_buff_result.average_stack_per_player) /
                        this_buff_result.average_stack_per_player.length
                );
                this_buff_result.average_coverage = (
                    this.sum(this_buff_result.average_coverage_per_player) /
                    this_buff_result.average_coverage_per_player.length
                ).toFixed(4);
                this_buff_result.average_times_per_player = (
                    this.sum(this_buff_result.times_per_player) / this_buff_result.times_per_player.length
                ).toFixed(1);
                this_buff_result.min_stack = min_stack;
                this_buff_result.max_stack = max_stack;
                result.push(this_buff_result);
            }
        }

        return result;
    }

    getPveOverviewList(params) {
        const { statType, timeRange } = params;
        const { entities, stats } = this.result;
        if (!stats) return [];
        const source = stats[statType];
        if (!source) return [];
        let result = [];
        let teamTotal = 0;
        let maxValue = 0;
        const rangeLength = timeRange[1] - timeRange[0];
        for (let entity in source) {
            const logs = source[entity].logs.filter((log) => log.micro > timeRange[0] && log.micro < timeRange[1]);
            const statData = this.analyzer.getLogsStat(logs);
            let entityData = {
                ...statData,
                ...pick(entities[entity], ["name", "id", "mount", "type"]),
            };
            entityData.vps = (entityData.value / rangeLength) * 1000;
            if (entityData.type == "player") {
                teamTotal += entityData.value;
                maxValue = Math.max(maxValue, entityData.value);
            }
            result.push(entityData);
        }
        for (let entity of result) {
            if (entity.mount) {
                entity["rate"] = (entity.value / teamTotal) * 100;
                entity["length"] = (entity.value / maxValue) * 100;
            } else {
                entity["rate"] = 0;
                entity["length"] = 0;
            }
        }
        return result;
    }
    getPveOverviewPie(params) {
        const { statType } = params;
        const { entities, stats } = this.result;
        let result = [];
        let total = 0;
        const source = stats[statType];
        for (let entity in source) {
            total += source[entity].value;
            let _data = {
                ...pick(entities[entity], ["id", "name", "color"]),
                value: source[entity].value,
            };
            if (!_data.name) _data.name = "#" + _data.id;
            result.push(_data);
        }
        result = result.filter((x) => x.value / total > 0.02);
        return { result, total };
    }
    getPveComparePie(params) {
        const { statType, compareEntity } = params;
        const compareEntitiesSet = new Set(compareEntity.split(","));
        const { entities, stats, end } = this.result;
        const duration = end.sec;

        let result = [];
        // 团队总数值
        let teamTotal = 0;
        // 对比实体的总数值
        let total = 0;
        let allCriticalCount = 0;
        let allCount = 0;

        const source = stats[statType];

        for (const entity in source) {
            const entityData = source[entity];

            if (entities[entity] && entities[entity].type != "player") continue;
            teamTotal += entityData.value;
            if (!compareEntitiesSet.has(entity)) continue;

            total += entityData.value;
            allCriticalCount += entityData.criticalCount;
            allCount += entityData.count;

            const entityInfo = entities[entity];
            let _data = {
                ...pick(entityInfo, ["id", "name", "color"]),
                value: entityData.value,
            };
            if (!_data.name) _data.name = "#" + _data.id;

            result.push(_data);
        }

        result = result.filter((x) => x.value / total > 0.02);

        const vps = total / duration;
        const critRate = allCriticalCount / allCount;
        return { result, total, vps, critRate, teamTotal };
    }

    getPveOverviewChart(params) {
        const { statType } = params;
        const { entities, stats, end } = this.result;
        const max = end.sec + 1;
        // xData: [1,2,3,4,...]
        const xData = Array.from({ length: max }, (v, k) => k + 1);

        // yData
        let yData = {};
        {
            const defaultSeries = {
                type: "line",
                smooth: false,
                showSymbol: false,
            };
            const source = stats?.[statType];
            // 已有数据的统计
            for (let id in source) {
                if (!entities[id]) continue;
                const { name, color } = entities[id];
                if (!name || id == 0) continue;
                const entityYData = Array.from({ length: max }, () => 0);
                for (let log of source[id].logs) {
                    const index = Math.floor(log.micro / 1000);
                    entityYData[index] += log.value;
                }

                if (yData[name]) {
                    // 同名单位，合并数据
                    for (let index in entityYData) yData[name][index] += entityYData[index];
                    yData[name].total += source[id].value;
                } else {
                    // 新单位，纳入统计
                    yData[name] = {
                        ...defaultSeries,
                        itemStyle: { color },
                        name,
                        data: entityYData,
                        total: source[id].value,
                    };
                }
            }
            yData = Object.values(yData).filter((item) => item.data.some((v) => v > 0));
            // 全局统计
            let r = {
                ...defaultSeries,
                name: "【全局】",
                data: [],
            };
            let datas = yData.map((item) => item.data);
            for (let i = 0; i < xData.length; i++) {
                let sum = 0;
                for (let d of datas) {
                    if (Number(d[i])) sum += d[i];
                }
                r.data.push(sum);
            }
            yData.unshift(r);
            yData.sort((a, b) => b.total - a.total);
        }
        return { xData, yData };
    }
    getPveOverviewFocus(params) {
        const { statType, entityID, timeRange } = params;
        const logs = this.result.stats?.[statType]?.[entityID]?.logs?.filter(
            (log) => log.micro > timeRange[0] && log.micro < timeRange[1]
        );
        if (!logs) return [];
        let result = {};
        let total = 0;
        for (let log of logs) {
            const key = log.effect;
            if (!result[key]) {
                const resource = getResource(key, this.result);
                const name = resource.name ?? resource.remark ?? key;
                result[key] = {
                    name,
                    value: 0,
                    count: 0,
                    criticalCount: 0,
                    rate: 0,
                };
            }
            total += log.value;
            result[key].count += 1;
            result[key].value += log.value;
            result[key].criticalCount += log.isCritical ? 1 : 0;
        }
        for (let key in result) {
            result[key].rate = (result[key].value / total) * 100;
        }
        return Object.values(result).sort((a, b) => b.value - a.value);
    }
    getPveEntityStatChart(params) {
        const defaultReturn = { overview: {}, xData: [], yData: [] };
        const { entityTab, entity } = params;
        const { entities, stats, end } = this.result;

        const entityObj = entities[entity];
        let overview = { ...pick(entityObj, ["name", "id"]) };

        const source = stats[entityTab]?.[entity];
        if (!source) return defaultReturn;
        const duration = end.sec;
        const vps = source.value / duration;
        const critRate = source.criticalCount / source.count;
        const displayValue = source.value ? source.value.toLocaleString() : "-";
        overview = {
            ...overview,
            ...pick(source, ["count"]),
            value: displayValue,
            duration,
            vps,
            critRate,
        };

        const max = end.sec + 1;
        // xData: [1,2,3,4,...]
        const xData = Array.from({ length: max }, (v, k) => k + 1);
        const _yData = Array.from({ length: max }, () => 0);
        for (let log of source.logs) {
            const index = Math.floor(log.micro / 1000);
            _yData[index] += log.value;
        }
        const yData = _yData;
        return { overview, xData, yData };
    }
    getPveEntityViewEffect(params) {
        const { entityTab, entity, timeRange = [0, 1e10] } = params;
        const { stats } = this.result;
        const source = stats[entityTab]?.[entity];
        if (!source) {
            return [];
        }
        let result = {};
        let total = 0;
        const logs = source.logs.filter((log) => log.micro > timeRange[0] && log.micro < timeRange[1]);
        for (let log of logs) {
            //这个target不一定是目标的ID，在承伤/承疗的时候表现为来源ID
            const effect = log.effect;
            if (!result[effect])
                result[effect] = {
                    count: 0, // 伤害次数
                    criticalCount: 0, //会心次数
                    value: 0, //总伤害量
                    min: 1e10, //最小伤害值
                    max: -1e10, //最大伤害值
                    logs: [], // 详细伤害日志
                };
            result[effect].count++;
            result[effect].value += log.value;
            total += log.value;
            result[effect].min = Math.min(result[effect].min, log.value);
            result[effect].max = Math.max(result[effect].max, log.value);
            if (log.isCritical) result[effect].criticalCount++;
            result[effect].logs.push(log);
        }
        for (let effect in result) {
            let r = result[effect];
            r.criticalRate = (r.criticalCount / r.count) * 100;
            r.valueRate = (r.value / total) * 100;
            r.avg = r.value / r.count;
            r.effect = effect;
        }
        return Object.values(result).sort((a, b) => b.value - a.value);
    }
    getPveEntityViewTarget(params) {
        const { entityTab, entity, timeRange = [0, 1e10], skipNoNameTarget = true } = params;
        const { stats, entities } = this.result;
        const source = stats[entityTab]?.[entity];
        if (!source) {
            return [];
        }
        let result = {};

        let total = 0;
        const logs = source.logs.filter((log) => log.micro > timeRange[0] && log.micro < timeRange[1]);
        for (let log of logs) {
            //这个target不一定是目标的ID，在承伤/承疗的时候表现为来源ID
            const target = ["damage", "treat"].includes(entityTab) ? log.target : log.caster;
            const entity = entities[target];
            if (skipNoNameTarget && !entity.name) continue;
            if (!result[target])
                result[target] = {
                    count: 0, // 伤害次数
                    criticalCount: 0, //会心次数
                    value: 0, //总伤害量
                    min: 1e10, //最小伤害值
                    max: -1e10, //最大伤害值
                    logs: [], // 详细伤害日志
                };
            result[target].count++;
            result[target].value += log.value;
            total += log.value;
            result[target].min = Math.min(result[target].min, log.value);
            result[target].max = Math.max(result[target].max, log.value);
            if (log.isCritical) result[target].criticalCount++;
            result[target].logs.push(log);
        }
        for (let k in result) {
            let r = result[k];
            r.criticalRate = (r.criticalCount / r.count) * 100;
            r.valueRate = (r.value / total) * 100;
            r.avg = r.value / r.count;
            r.target = Number(k);
        }
        return Object.values(result).sort((a, b) => b.value - a.value);
    }
    getBlameEntity(params) {
        let result = [];
        const { entityId } = params;
        const { buff_blame } = this.result;
        if (!entityId) {
            return result;
        }
        let this_entity_logs = buff_blame[entityId];
        if (!this_entity_logs) {
            return result;
        }
        for (let [key, values] of Object.entries(this_entity_logs)) {
            for (let value of values) {
                let name = getResource("buff:" + key, this.result).name;
                if (!name) {
                    name = raid_analysis_constant.buff2name[key];
                }
                let log = {
                    buffId: key,
                    buffName: name,
                    source: value.source,
                    stack: value.stack,
                    time: value.time,
                };
                result.push(log);
            }
        }
        return result;
    }

    getBlameDeathEntity(params) {
        let result = [];
        const { entityId } = params;
        const { player_death } = this.result;
        if (!entityId) {
            return result;
        }
        let this_entity_logs = player_death[entityId];
        if (!this_entity_logs) {
            return result;
        }
        for (let this_death of this_entity_logs) {
            result.push(this_death);
        }
        return result;
    }

    getPveEntityBuff(params) {
        const { entity } = params;
        const { buff, end } = this.result;
        const source = buff[entity];
        if (!source) return [];
        let result = [];
        for (let key in source) {
            const buff = source[key];
            let getCount = 0;
            let deleteCount = 0;
            let maxStack = 0;
            let maxDuration = Number.MIN_SAFE_INTEGER;
            let minDuration = Number.MAX_SAFE_INTEGER;
            let totalDuration = 0;
            for (let log of buff.logs) {
                const duration = (log.end - log.start) / 1000;
                getCount += 1;
                maxStack = Math.max(maxStack, log.stack, ...Object.values(log.stackLogs ?? {}));
                maxDuration = Math.max(maxDuration, duration);
                minDuration = Math.min(minDuration, duration);
                totalDuration += duration;
                if (log.end != log.shouldEnd) deleteCount += 1;
            }
            let aveDuration = totalDuration / getCount;
            let coverage = (totalDuration / (end.micro / 1000)) * 100;
            result.push({
                id: key,
                icon: getResourceIcon("buff:" + key, this.result, { url: false }),
                getCount,
                deleteCount,
                maxStack,
                maxDuration,
                minDuration,
                aveDuration,
                coverage,
            });
        }
        return result.sort((a, b) => b.coverage - a.coverage);
    }
    getPveEntityBuffChart(params) {
        const { entity, selectedBuffs } = params;
        const { end, buff } = this.result;
        // datas
        const data = [];
        {
            const colorGenerator = getRandomColor();
            const source = buff?.[entity] || {};
            for (let id of selectedBuffs) {
                let buffLogs = source[id]?.logs;
                if (!buffLogs) continue;
                data.push({
                    info: {
                        ...getResource("buff:" + id, this.result),
                        key: id,
                        color: colorGenerator.next().value,
                        name: getResourceName("buff:" + id, this.result),
                    },
                    times: buffLogs,
                });
            }
        }
        // iconStyles
        const iconStyles = {
            paddingRight: {
                padding: [0, 10, 0, 0],
            },
        };
        {
            for (let k in data) {
                const info = data[k].info;
                iconStyles["icon" + k] = {
                    backgroundColor: {
                        image: iconLink(info.icon),
                    },
                    height: 32,
                    width: 32,
                };
            }
        }
        // categories
        const categories = data.map((d) => d.info.name);
        // items
        const items = [];
        {
            let index = 0;
            for (let { info, times } of data) {
                for (let time of times) {
                    const isDelete = time.end != time.shouldEnd && time.end != end.micro;
                    items.push({
                        index,
                        name: info.name,
                        value: [info.key, time.start, time.end, index, JSON.stringify(time.stackLogs), isDelete],
                        detail: time,
                        itemStyle: {
                            color: info.color,
                        },
                    });
                }
                index++;
            }
        }
        return {
            data,
            iconStyles,
            categories,
            items,
        };
    }

    getPveEntityDetail(params) {
        const { effectName, entity } = params;
        const source = this.result.stats?.damage?.[entity];
        const logs = [];
        for (let i = 0; i < source.logs.length; i++) {
            const log = source.logs[i];
            const itemName = getResourceName(log.effect, this.result);
            if (effectName == itemName) {
                logs.push(log);
            }
        }

        return logs;
    }

    getPveEntitySkill(params) {
        const { entity } = params;
        const data = [];
        const selectedSkills = {};
        {
            const source = this.result.skill?.[entity]?.skills;

            if (!source) {
                return { data, selectedSkills };
            }
            const colorGenerator = getRandomColor();
            let result = {};
            for (let id in source) {
                const resource = getResource("skill:" + id, this.result);
                if (!resource || !resource.name) continue;
                const name = resource.name;
                if (result[name] === undefined) {
                    result[name] = {
                        name,
                        ids: [id],
                        color: colorGenerator.next().value,
                        icon: resource.icon,
                    };
                    selectedSkills[name] = {
                        name,
                        ...result[name],
                        stat: [],
                    };
                } else {
                    if (!result[name].icon) result[name].icon = resource.icon;
                    result[name].ids.push(id);
                    selectedSkills[name].ids.push(id);
                }
            }
            data.push(...Object.values(result));
        }
        return { data, selectedSkills };
    }

    timelineSelector(params) {
        const { filter } = params;
        const data = [];
        const selectedTimeline = {};
        const source = this.result.time_line_result;
        {
            if (!source) {
                return { data, selectedTimeline };
            }
            const colorGenerator = getRandomColor();

            // skills part
            let result = {};
            if (filter.skill == true) {
                for (let log of source.skills) {
                    // 构造skill查询
                    const key = `${log.skill_id}_${log.skill_level}`;
                    const resource = getResource("skill:" + key, this.result);
                    // 查询不到就跳过
                    if (!resource || !resource.name) continue;

                    const name = "skill:" + resource.name;
                    if (result[name] === undefined) {
                        result[name] = {
                            name,
                            ids: [key],
                            color: colorGenerator.next().value,
                        };
                        selectedTimeline[name] = {
                            name,
                            ...result[name],
                            stat: [],
                        };
                    } else {
                        result[name].ids.push(key);
                        selectedTimeline[name].ids.push(key);
                    }
                }
                data.push(...Object.values(result));
            }

            // template part
            if (filter.templates == true) {
                result = {};
                for (let [k, v] of Object.entries(source.templates)) {
                    for (let value of v) {
                        const name = "template:" + value.name;
                        if (result[name] === undefined) {
                            result[name] = {
                                name,
                                ids: [k],
                                color: colorGenerator.next().value,
                            };
                            selectedTimeline[name] = {
                                name,
                                ...result[name],
                                stat: [],
                            };
                        } else {
                            result[name].ids.push(k);
                            selectedTimeline[name].ids.push(k);
                        }
                    }
                }
                data.push(...Object.values(result));
            }

            // say part
            if (filter.say) {
                result = {};
                for (let [k, v] of Object.entries(this.result.say)) {
                    if (k != "_system") {
                        for (let value of v) {
                            const name = "say:" + value.content;
                            if (result[name] === undefined) {
                                result[name] = {
                                    name,
                                    ids: [value.content],
                                    color: colorGenerator.next().value,
                                };
                                selectedTimeline[name] = {
                                    name,
                                    ...result[name],
                                    stat: [],
                                };
                            } else {
                                result[name].ids.push(value.content);
                                selectedTimeline[name].ids.push(value.content);
                            }
                        }
                    }
                }
                data.push(...Object.values(result));
            }
        }
        return { data, selectedTimeline };
    }
    getPveCompare(params) {
        const { compareMode, entity, timeRange } = params;
        const { stats } = this.result;
        let source;
        if (compareMode == "skill") {
            source = stats?.damage?.[entity];
            source.logs = source.logs.filter((log) => log.effect.indexOf("skill:") >= 0);
        } else {
            source = stats?.[compareMode]?.[entity];
        }
        if (!source) return { overview: [], data: [] };
        const logs = source.logs;
        const statResult = this.analyzer.getLogsStat(logs);

        const displayStart = displayDuration(timeRange[0] / 1000);
        const displayEnd = displayDuration(timeRange[1] / 1000);

        const overview = [
            {
                title: "计算时间",
                value: `${displayStart} - ${displayEnd}`,
            },
            {
                title: "总次数",
                value: statResult.count,
            },
            {
                title: "总伤害",
                value: statResult.value ? statResult.value.toLocaleString() : 0,
            },
            {
                title: "每秒数值",
                value: displayDigits(statResult.value / (timeRange[1] - timeRange[0])),
            },
            {
                title: "会心率",
                value: displayPercent((statResult.criticalCount / statResult.count) * 100),
            },
        ];
        const data = [];
        {
            if (!source || !source.logs) return [];
            let result = {};

            for (let log of logs) {
                const effect = log.effect;
                if (!result[effect]) {
                    result[effect] = {
                        count: 0, // 伤害次数
                        criticalCount: 0, //会心次数
                        value: 0, //总伤害量
                        min: 1e10, //最小伤害值
                        max: 1e-10, //最大伤害值
                        logs: [], // 详细伤害日志
                        effect,
                    };
                }
                result[effect].count++;
                result[effect].value += log.value;
                result[effect].min = Math.min(result[effect].min, log.value);
                result[effect].max = Math.max(result[effect].max, log.value);
                result[effect].logs.push(log);
                if (log.isCritical) result[effect].criticalCount++;
            }
            result = Object.values(result).sort((a, b) => b.value - a.value);
            //计算结果->给表格展示的数据
            for (let res of result) {
                res.criticalRate = (res.criticalCount / res.count) * 100;
                res.valueRate = (res.value / source.value) * 100;
                res.avg = res.value / res.count;
            }
            data.push(...result);
        }
        return { overview, data };
    }
    getPveCompareChart(params) {
        const { compareEntity, compareMode } = params;
        const { stats, end } = this.result;

        const max = end.sec + 1;
        // xData: [1,2,3,4,...]
        const xData = Array.from({ length: max }, (v, k) => k + 1);
        // yData
        const yData = [];
        {
            const defaultSeries = {
                type: "line",
                smooth: false,
                showSymbol: false,
            };
            const source = stats[compareMode];
            for (let id of compareEntity) {
                if (!id) continue;
                const data = Array.from({ length: max }, () => 0);
                const logs = source[id]?.logs;
                if (!logs) continue;
                for (let log of logs) {
                    const index = Math.floor(log.micro / 1000);
                    data[index] += log.value;
                }
                const name = getEntityName(id, this.result);
                const color = getEntityColor(id, this.result);

                yData.push({
                    name,
                    data,
                    ...defaultSeries,
                    itemStyle: { color },
                });
            }
        }
        return { xData, yData };
    }
    getPveLogs(params) {
        const { logFilter } = params;
        const { rows } = this.result;
        if (!rows) return [];
        const { keyword: keywords, hideKeyword: hideKeywords, entities, showTypes } = logFilter;
        const timeRange = [logFilter.timeRange[0] * 1000, logFilter.timeRange[1] * 1000];

        const typeMap = {
            say: [14, 15, 18],
            scene: [2, 3, 6, 7, 10, 11],
            buff: [13],
            skill: [21],
            skillCast: [19, 20],
            skillResult: [22, 23, 24, 25, 26],
            kill: [28],
            status: [29],
        };
        const showEventValue = (row) => {
            if (row.type != 21) return false;
            if (Object.values(row.value).every((x) => !x)) return false;
            return true;
        };

        let index = 0;
        const result = rows.filter((row) => {
            // 妹什么用的东西直接过滤
            if ([4, 8, 10, 11, 12].includes(row.type)) return false;
            // 事件类型过滤
            for (let type in typeMap) {
                // 如果显示类型里不包含这个类型,并且当前事件处于这个类型，则不显示
                if (!showTypes.includes(type) && typeMap[type].includes(row.type)) {
                    return false;
                }
            }
            // 相关单位过滤
            if (entities.length) {
                if (row.source.t == "entity" || row.target.t == "entity") {
                    // 过滤雨我无瓜的单位
                    if (!entities.includes(row.source.v) && !entities.includes(row.target.v)) {
                        return false;
                    }
                    // 开启了只显示选择单位为来源单位后
                    if (logFilter.onlySource && row.source && row.source.t == "entity") {
                        if (!entities.includes(row.source.v)) return false;
                    }
                }
            }
            // 时间范围过滤
            if (row.micro < timeRange[0] || row.micro > timeRange[1]) return false;

            // 关键词过滤
            if (hideKeywords && row.content) {
                for (let keyword of hideKeywords) {
                    if (keyword.type == "str" && row.content.t === "str" && row.content.v.includes(keyword.text))
                        return false;
                    if (keyword.type == "skill" && row.content.t === "skill" && row.content.v.startsWith(keyword.id))
                        return false;
                    if (keyword.type == "buff" && row.content.t === "buff" && row.content.v.startsWith(keyword.id))
                        return false;
                }
            }
            // 事件内容搜索,逻辑有些复杂Orz
            if (keywords && row.content) {
                let conform = false;
                for (let keyword of keywords) {
                    if (conform) {
                        row.index = ++index;
                        return true;
                    }
                    if (keyword.type == "str" && row.content.t === "str") {
                        conform = row.content.v.includes(keyword.text);
                    }
                    if (keyword.type == "skill" && row.content.t === "skill")
                        conform = row.content.v.startsWith(keyword.id);
                    if (keyword.type == "buff" && row.content.t === "buff")
                        conform = row.content.v.startsWith(keyword.id);
                }
                if (!conform) return false;
            }
            // 隐藏反击
            if (logFilter.hideReact && row.type == 21) {
                if (row.detail.isReact) return false;
            }
            // 隐藏无数值事件
            if (logFilter.hideNoValue && row.type == 21 && !showEventValue(row)) return false;

            row.index = ++index;
            return true;
        });
        return result;
    }
}
