import { parse as parseJx3dat } from "luat2json";
import { raid_analysis_constant } from "@/assets/data/jcl/raid_constant";
import { JCL_TYPE } from "./jclType";
import { formatLine } from "./format";
import { cloneDeep, pick } from "lodash-es";

// 用于解析lua table
const parseLua = (type, lua) => {
    let table = parseJx3dat(`return ${lua}`);
    let parseFunc = JCL_TYPE[type]?.[1];
    return parseFunc ? parseFunc(table) : table;
};
// 用于解析单行日志
const parseLine = (line) => {
    if (!line) return;
    let [frame, sec, micro, type, detail] = line.split("\t").slice(1);
    [frame, sec, micro, type] = [frame, sec, micro, type].map(Number);
    detail = parseLua(type, detail);
    const typeDesc = JCL_TYPE[type]?.[0];
    return {
        frame,
        sec,
        micro,
        type,
        typeDesc,
        detail,
    };
};
// 用于过滤一些没有实际意义的日志
const logFilter = (log) => {
    const sysMsgBlackList = [
        "不经意间触发奇遇",
        "GM公告",
        "因为获得帮会天工树涅槃分支",
        "恭喜大侠，获得 [赞·群龙之首]",
        "身上的装备耐久度降低",
        /“.+”.+在.+对“.+”.+释放了传说中的烟花【.+】/,
        /“.+”.+在.+对“.+”.+使用了传说中的【.+】/,
        /“.+”.+在.+释放了传说中的烟花【.+】/,
        /触发奇遇【.+】/,
    ];

    if (log.type === 18) {
        let content = log.detail.content;
        for (let sb of sysMsgBlackList) {
            if (typeof sb === "string" && content.includes(sb)) return false;
            if (typeof sb === "object" && sb.test(content)) return false;
        }
    }
    if (log.type === 13) {
        if (log.detail.id === 0) return false;
    }
    return true;
};
// 获的一行日志的时间
const getRowTime = (row) => {
    const result = pick(row, ["frame", "sec", "micro"]);
    return result;
};
const defaultResult = {
    start: {},
    end: {},
    client: "std",
    map: null,
    server: null,

    rows: [],
    entities: {
        0: {
            id: 0,
            name: "天外来客",
            type: "npc",
            templateID: -1,
        },
    },
    stats: {
        damage: {},
        treat: {},
        beDamaged: {},
        beTreated: {},
    },
    buff: {},
    skill: {},
    say: {},
    scene: {},
    player_death: {},
    buff_blame: {},
    time_line_result: {
        skills: [],
        templates: [],
    },
    resources: {
        skill: null,
        buff: null,
    },
    player_list: [],
};
// 分析器
/**
 *
 * 分析器
 * @class Analyzer
 * @param {string} raw JCL文件内容
 * @param {object} options 选项
 * @property {string[]} raw JCL文件内容
 * @property {object} options 选项
 * @property {object} result 分析结果
 * @property {object} tmp 临时数据
 * @property {number} index 当前解析到的行数
 * @property {number} length JCL文件总行数
 * @property {object} prev 上一行解析结果
 * @property {object} current 当前行解析结果
 * @property {import('./adapter').Adapter} adapter 适配器
 */
export class Analyzer {
    /**
     *
     * @param {string} raw
     * @param {Record<string, any>} options
     */
    constructor(raw, options) {
        this.raw = raw.split("\n").filter((x) => x);
        this.options = options || {};
        this.reset();
    }

    /**
     * 绑定适配器
     * @param {import('./adapter').Adapter} adapter
     */
    bindAdapter(adapter) {
        this.adapter = adapter;
        this.adapter.bindAnalyzer(this);
    }

    /**
     * 将游标指向某一条记录
     * @param {number|"start"|"end"|"next"} index
     * @returns {number} 更换指向之后的游标位置
     */
    cursorTo(index) {
        if (index === "start") return (this.index = 0);
        if (index === "end") return (this.index = this.length - 1);
        if (index === "next") return (this.index += 1);
        return (this.index = index);
    }

    /**
     * 短遍历，找到开始时间
     * @returns
     */
    findStartTime() {
        let _index = 0;
        const line = parseLine(this.raw[_index]);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            _index++;
            const _line = parseLine(this.raw[_index]);
            // 如果是战斗全局信息并且是开始标记，就是战斗开始时间
            if (_line.type === 1 && _line.detail.start) {
                return getRowTime(_line);
            }
            // 如果遍历超过15秒钟没找到就认为是错误的jcl,为了兼容取第一条
            if (_line.micro - line.micro > 1000 * 15 || _index >= this.length) {
                return getRowTime(line);
            }
            continue;
        }
    }

    /**
     * 重置分析器
     */
    reset() {
        this.cursorTo("start");
        /**
         * @type {AnalyzeResult}
         */
        this.result = cloneDeep(defaultResult);
        this.length = this.raw.length;
        this.prev = undefined;
        this.current = undefined;
        this.adapter?.updateResult(this.result);
        this.tmp = {
            enterSceneCount: {},
            firstAppearTimeUpdated: {},
            globalSays: [],
            channelSkill: {},
            templateId: {},
        };
    }

    // 到下一个时间节点
    nextStep() {}

    // 直接解析到头，获取整个JCL文件的结果，返回一个生成器
    getAll() {
        const analyzer = this;
        return (function* () {
            analyzer.reset();
            analyzer.result.start = analyzer.findStartTime();
            while (true) {
                let result = analyzer.nextLine();
                if (result.done) return analyzer.result;
                yield result;
            }
        })();
    }

    // 解析JCL的下一行
    nextLine() {
        const result = (row, done = false, valid = true) => {
            this.cursorTo("next");
            return {
                row,
                done,
                valid,
                index: this.index,
                length: this.length,
            };
        };
        // 解析结束
        if (this.index === this.length) {
            this.endBuff();
            this.endStat();
            this.endTemplate();
            return result(null, true);
        }
        this.prev = this.current;
        let line = parseLine(this.raw[this.index]);
        // 无效日志直接跳过
        let valid = logFilter(line);
        if (!valid) return result(null, false, valid);
        // 格式化日志
        let row = formatLine(line);
        this.result.rows.push(row);
        this.current = row;
        this.updateResult();
        return result(row, false, valid);
    }
    // 更新分析结果，执行下述的updateXX方法
    updateResult() {
        if (this.updateMeta() === false) {
            this.cursorTo("end");
            return;
        }
        this.updateResources();
        this.updateEntities();
        this.updateScene();
        this.updateBuff();
        this.updateSkillCount();
        this.updateDeath();
        this.updateSay();
        this.updateTeam();
        this.updateStat();
        this.updateTimeLine();
    }
    // 更新JCL文件元信息
    updateMeta() {
        // frame=0，一般是JJC过完图了，直接截断，处理完毕
        if (this.current.frame === 0) {
            this.cursorTo("end");
            this.result.end = getRowTime(this.prev);
            return false;
        }
        // 更新日志时间
        if (this.current && this.result.start.micro) {
            this.current.micro -= this.result.start.micro;
            this.current.sec -= this.result.start.sec;
            this.current.frame -= this.result.start.frame;
        }
        // type=1,是战斗全局信息，可以用来更新各种
        if (this.current.type === 1) {
            let { start, client, map, server } = this.current.detail;
            // JCL文件所属的客户端
            if (["classic_yq", "classic_exp"].includes(client)) this.result.client = "origin";
            // 地图
            this.result.map = map;
            this.result.server = server.split("_")[1];
            // 战斗结束时间
            if (!start) {
                this.result.end = getRowTime(this.current);
            }
        }
        return true;
    }
    // 更新JCL文件涉及到的资源列表
    updateResources() {
        let row = this.current;
        let resources = this.result.resources;
        if (!resources.skill) resources.skill = new Set();
        if (!resources.buff) resources.buff = new Set();
        if (row.content.t == "skill") resources.skill.add(row.content.v);
        if (row.content.t == "buff") resources.buff.add(row.content.v);
    }
    // 更新单位信息
    updateEntities() {
        const { type, detail } = this.current;
        let entities = this.result.entities;
        // 玩家信息
        if (type === 4) {
            const { id, mount } = detail;
            // 无效的玩家信息,可能是焚影隐身导致的
            if (mount === -1) return;
            if (entities[id]) {
                // 已经记录的玩家不再记录，但是可以用于刷新原来没有的数据。比如奇穴啥的
                let oldEntity = entities[id];
                let newEntity = Object.assign({}, { type: "player" }, detail);
                if (Object.values(oldEntity.talents).length == 0) oldEntity.talents = newEntity.talents;
                if (!oldEntity.equips?.length) oldEntity.equips = newEntity.equips;
                return;
            }
            let firstAppear = getRowTime(this.current);
            // 记录玩家信息
            let entity = Object.assign({}, { type: "player", firstAppear }, detail);
            entities[id] = entity;
            this.result.player_list.push(id);
        }
        // NPC信息
        if (type === 8) {
            const { id, templateID } = detail;
            if (entities[id]) return;
            // 记录NPC的首次出现时间
            let firstAppear = this.tmp.firstAppearTimeUpdated[id] ?? getRowTime(this.current);
            // 记录同模板NPC的出现顺序
            if (this.tmp.enterSceneCount[templateID] === undefined) this.tmp.enterSceneCount[templateID] = 1;
            let appearOrder = this.tmp.enterSceneCount[templateID]++;
            // 记录NPC信息
            let entity = Object.assign({}, { type: "npc", firstAppear, appearOrder }, detail);
            entities[id] = entity;
        }
        if ([2, 6].includes(type)) {
            const { id } = detail;
            if (!this.tmp.firstAppearTimeUpdated[id]) {
                let time = getRowTime(this.current);
                this.tmp.firstAppearTimeUpdated[id] = time;
                if (entities[id]) entities[id].firstAppear = time;
            }
        }
    }
    // 更新单位进出场景
    updateScene() {
        const { micro, type: t, detail } = this.current;
        if (![2, 3, 6, 7].includes(t)) return;
        const { id } = detail;
        const type = [2, 6].includes(detail.type) ? "出现" : "消失";
        if (!this.result.scene[id]) this.result.scene[id] = [];
        this.result.scene[id].push({
            type,
            time: micro / 1000,
        });
    }
    // 更新单位buff
    updateBuff() {
        const { micro, type, detail } = this.current;
        if (type === 13) {
            const { source, target, isDelete, id, level, stackNum: stack, endFrame } = detail;
            const key = `${id}_${level}`;
            if (!this.result.buff[target]) this.result.buff[target] = {};
            // 结算一遍这个单位身上的buff
            for (let bi in this.result.buff[target]) {
                let buff = this.result.buff[target][bi];
                if (buff.cur && buff.cur.end < micro) {
                    buff.logs.push(buff.cur);
                    buff.cur = null;
                }
            }
            if (!this.result.buff[target][key]) this.result.buff[target][key] = { cur: null, logs: [] };
            const eb = this.result.buff[target][key];
            if (!isDelete) {
                // 添加BUFF
                let battleStartFrame = this.result.start.frame;
                let buffEndMicro = ((endFrame - battleStartFrame) / 16) * 1000;
                if (!eb.cur) {
                    // 如果身上没这个buff
                    eb.cur = {
                        source,
                        deleteBy: null,
                        start: micro,
                        end: buffEndMicro,
                        shouldEnd: buffEndMicro,
                        id: key,
                        stack,
                        stackLogs: {
                            [micro]: stack,
                        },
                    };
                } else {
                    // 如果身上已经有这个buff了
                    eb.cur.end = buffEndMicro;
                    eb.cur.shouldEnd = buffEndMicro;
                    if (stack != eb.cur.stack) {
                        eb.cur.stack = stack;
                        eb.cur.stackLogs[micro] = stack;
                    }
                }

                /**
                 * 赛季更新BUFF处理段：
                 * 维护一个哈希表，key是buffid，value是层数，满足该层数的buff将会被记录
                 * 记录玩家不应该获得的buff，获得代表玩家出现失误。
                 */
                const buffTable = raid_analysis_constant.buffTable;
                // 非查找地图或者为缘起，不做判断
                if (
                    this.result.client == "origin" ||
                    !raid_analysis_constant.blame_enable_mapId.includes(this.result.map)
                ) {
                    return;
                }
                let mapId = this.result.map;
                // 判断玩家获得的buff是否是否在需要监控的哈希表内，且层数是否达到要求
                if (
                    id in buffTable[mapId] &&
                    stack >= buffTable[mapId][id] &&
                    this.result.entities[target] &&
                    this.result.entities[target].type == "player"
                ) {
                    // 该玩家是否已经被记录过
                    if (target in this.result.buff_blame) {
                        // 该效果是否已经被记过
                        if (id in this.result.buff_blame[target]) {
                            this.result.buff_blame[target][id].push({
                                playerId: target,
                                source: source,
                                buff_id: id,
                                stack: stack,
                                time: micro / 1000,
                            });
                        } else {
                            // 新建一个该效果
                            this.result.buff_blame[target][id] = [
                                {
                                    playerId: target,
                                    source: source,
                                    buff_id: id,
                                    stack: stack,
                                    time: micro / 1000,
                                },
                            ];
                        }
                    } else {
                        // 新建一个该玩家
                        this.result.buff_blame[target] = {};
                        this.result.buff_blame[target][id] = [
                            {
                                playerId: target,
                                source: source,
                                buff_id: id,
                                stack: stack,
                                time: micro / 1000,
                            },
                        ];
                    }
                }
            } else {
                // 适配可能存在的第一个buff是删除的情况
                if (!eb.cur) {
                    const last_logs = eb.logs[eb.logs.length - 1];
                    if (last_logs) {
                        last_logs.end = micro;
                        last_logs.deleteBy = source;
                    } else {
                        eb.logs.push({
                            source,
                            deleteBy: source,
                            start: 0,
                            end: micro,
                            id: key,
                            stack,
                            stackLogs: {
                                0: stack,
                                [micro]: stack,
                            },
                        });
                    }

                    return;
                }
                // 删除BUFF
                let buff = eb.cur;
                buff.end = micro;
                buff.deleteBy = source;
                eb.logs.push(buff);
                eb.cur = null;
            }
        }
    }
    // 分析结束时将buff的cur丢进logs
    endBuff() {
        const { micro } = this.current;
        for (let eid in this.result.buff) {
            for (let bid in this.result.buff[eid]) {
                let buff = this.result.buff[eid][bid];
                if (buff.cur) {
                    buff.cur.end = micro;
                    buff.logs.push(buff.cur);
                    buff.cur = null;
                }
            }
        }
    }
    updateEntityBuff(entity) {
        const { micro } = this.current;
        if (!this.result.buff[entity]) return;
        for (let bid in this.result.buff[entity]) {
            let buff = this.result.buff[entity][bid];
            if (buff.cur && buff.cur.end < micro) {
                buff.logs.push(buff.cur);
                buff.cur = null;
            }
        }
    }
    // 获取单位的buff
    getBuff(entity) {
        if (!this.result.buff[entity]) return [];
        this.updateEntityBuff(entity);
        let result = [];
        for (let bid in this.result.buff[entity]) {
            let buff = this.result.buff[entity][bid];
            if (buff.cur) result.push(`${bid}*${buff.cur.stack}`);
        }
        return result;
    }
    // 技能数统计
    updateSkillCount() {
        const { micro, type, detail } = this.current;
        if (![19, 21, 22, 23, 24, 25, 26].includes(type)) return;
        if (type === 21 && detail.eventType === 2) return;
        let { caster, target, id, level } = detail;
        const key = `${id}_${level}`;

        /* 以下开始处理玩家的召唤物 */
        const casterDetail = this.result.entities[caster];
        if (casterDetail && casterDetail.type === "npc" && casterDetail.belongID != 0) {
            if (this.result.entities[casterDetail["belongID"]]) {
                if (this.result.entities[casterDetail["belongID"]].type === "player") {
                    // console.log("发现玩家召唤物",casterDetail)
                    caster = casterDetail.belongID;
                }
            } else {
                // TODO: 这里可以写个列表最后处理一下异常信息，待实现
                console.log("由于jcl错位问题发现异常召唤物");
            }
        }
        /* 处理完毕 */

        if (!this.result.skill[caster])
            this.result.skill[caster] = {
                skills: {},
                logs: [],
            };
        let data = this.result.skill[caster];
        const typeMap = { 19: "cast", 24: "miss" };
        const skillType = typeMap[type] ?? "hit";
        // 如果这个技能还没有记录过，就初始化一个
        if (!data.skills[key]) {
            data.skills[key] = {
                last: {
                    hit: null,
                    cast: null,
                    miss: null,
                },
            };
        }
        let skillData = data.skills[key];
        // 如果上一次同类型的事件发生在0.5s内，认为是同一次事件的AOE/闪避之类的触发的事件，不计数
        if (skillData.last[skillType] && Math.abs(skillData.last[skillType].time * 500 - micro) < 1000) {
            skillData.last[skillType].count += 1;
            skillData.last[skillType].targets.push(target);
            return;
        }
        // 如果不是同一次事件，就另起一个对象，并且技能计数+1；
        // 这个对象会同时放进logs里面以及作为skills里的last
        const log = {
            time: micro / 1000,
            skillType,
            id: key,
            targets: [target],
            count: 1,
        };
        skillData.last[skillType] = log;
        data.logs.push(log);
    }
    // 死亡统计
    updateDeath() {
        const { micro, type, detail } = this.current;
        if (type !== 28) return;
        const { id, killer } = detail;
        let entities = this.result.entities;
        let entity = entities[id];

        // 如果被击杀类型是玩家则代表玩家重伤，将内容更新至player_death
        if (entity && entity.type == "player") {
            // 该玩家不是第一次死亡
            if (id in this.result.player_death) {
                this.result.player_death[id].push({
                    playerId: id,
                    killerId: killer,
                    time: micro / 1000,
                    detail: this.updateDeathDetail(id, micro, 5000),
                    buff: this.getBuff(id),
                });
            }

            // 该玩家是第一次死亡
            else {
                this.result.player_death[id] = [
                    {
                        playerId: id,
                        killerId: killer,
                        time: micro / 1000,
                        detail: this.updateDeathDetail(id, micro, 5000),
                        buff: this.getBuff(id),
                    },
                ];
            }
        }
    }
    /**
     * 找到重伤玩家在前window毫秒内受到的伤害记录
     * @param {int} entityId 重伤玩家ID
     * @param {int} deathTime 重伤玩家死亡时间（战斗开始后的毫秒数）
     * @param {int} window 查找窗口（单位毫秒），默认为死亡前5000毫秒，即5秒
     * @returns {dictType} 玩家在死亡前window毫秒内受到的伤害的logs
     */
    updateDeathDetail(entityId, deathTime, window = 5000) {
        let detail = [];
        if (!this.result?.stats?.beDamaged?.[entityId]) return detail;
        let start_time = deathTime - window >= 0 ? deathTime - window : 0; // 防止向前追溯的时间越界
        let start_row_id = this.result.stats.beDamaged[entityId]["logs"].length - 1;
        while (start_row_id >= 0 && this.result.stats.beDamaged[entityId]["logs"][start_row_id].micro >= start_time) {
            detail.push(this.result.stats.beDamaged[entityId]["logs"][start_row_id]);
            start_row_id -= 1;
        }
        return detail;
    }

    // 喊话统计
    updateSay() {
        const { micro, type, detail } = this.current;
        if (![14, 15].includes(type)) return;
        let { content, id } = detail;
        if (!id) id = "_system";
        const typeMap = {
            14: "NPC喊话",
            15: "系统警告框",
        };

        if (!this.result.say[id]) {
            this.result.say[id] = [];
        }
        const log = {
            type: typeMap[type],
            time: micro / 1000,
            content,
        };
        this.result.say[id].push(log);
    }
    // 分队更新
    updateTeam() {
        const { type, detail } = this.current;
        if (type !== 21) return;
        let { caster, target, values } = detail;
        [caster, target] = [caster, target].map((id) => this.result.entities[id]);
        // 只有两个单位都拿到了，并且都是玩家，并且其中至少一个人的队伍还不确定才可以判断
        if (!caster || !target) return;
        if (caster.type != "player" || target.type != "player") return;
        if (caster.team != undefined && target.team != undefined) return;
        // 如果事件来源没有队伍
        if (caster.team != undefined) {
            // 如果事件目标没队伍，需要先给目标一个初始的队伍
            if (target.team === undefined) {
                target.team = true;
            }
            // 事件目标有队伍，可以根据伤害判断出来源的队伍
            if (values["治疗"] > 0) caster.team = target.team;
            if (values["有效伤害"] > 0) {
                caster.team = !target.team;
            }
        } else {
            // 事件来源有队伍，只需要判断目标的队伍
            if (values["治疗"] > 0) target.team = caster.team;
            if (values["有效伤害"] > 0) {
                target.team = !caster.team;
            }
        }
    }
    // 更新数据统计/DPS统计等
    updateStat() {
        const { type, detail } = this.current;
        if (type !== 21) return;
        let { caster, target, values } = detail;
        /* 处理玩家召唤物伤害 */
        const casterDetail = this.result.entities[caster];
        if (casterDetail && casterDetail.type === "npc" && casterDetail.belongID != 0) {
            if (this.result.entities[casterDetail["belongID"]]) {
                if (this.result.entities[casterDetail["belongID"]].type === "player") {
                    // console.log("发现玩家召唤物",casterDetail)
                    caster = casterDetail.belongID;
                }
            } else {
                // TODO: 这里可以写个列表最后处理一下异常信息，待实现
                console.log("由于jcl错位问题发现异常召唤物");
            }
        }
        /* 处理完毕 */
        if (values[13]) {
            this.updateStatItem("damage", caster);
            this.updateStatItem("beDamaged", target);
        }
        if (values[6]) {
            this.updateStatItem("treat", caster);
            if (values[14]) {
                this.updateStatItem("beTreated", target);
            }
        }
    }
    updateStatItem(type, entity) {
        const stat = this.result.stats[type];
        if (!stat[entity]) stat[entity] = { logs: [] };
        // 整理出log
        const {
            micro,
            detail: { caster, target, eventType, id, level, values, isCritical },
        } = this.current;
        let value = 0;
        let total = 0;
        if (["damage", "beDamaged"].includes(type)) {
            value = values[13];
        } else if (["treat", "beTreated"].includes(type)) {
            value = values[14];
            total = values[6];
        }
        // 技能效果id
        const effectID = `${eventType === 1 ? "skill" : "buff"}:${id}_${level}`;
        // 统计细节
        let log = {
            caster,
            target,
            value: value,
            buffs: this.getBuff(entity),
            micro,
            isCritical: isCritical,
            effect: effectID,
        };
        if (type == "treat") log.T = total;
        // 塞进统计里面
        stat[entity]["logs"].push(log);
    }

    // 更新副本技能轴（副本专用）
    updateTimeLine() {
        // 非特定副本地图或者缘起客户端，不做判断
        if (this.result.client == "origin" || !raid_analysis_constant.timeline_enable_mapId.includes(this.result.map)) {
            return;
        }
        // 喊话类全部需要记录，在updateSay()中已经全部记录，不需要额外处理
        const { micro, type, detail } = this.current;
        // 技能类，仅记录副本内与首领战斗中首领/小怪释放的技能
        if ([19, 21, 22, 23, 24, 25, 26].includes(type)) {
            const { caster, id, level } = detail;
            // 寂灭不做判断(明教bug技能)
            if (id == 6746) {
                return;
            }
            // 获取处理的目标列表
            const bossName = raid_analysis_constant.bossName[this.result.map];
            if (this.result.entities[caster] && bossName.includes(this.result.entities[caster].name)) {
                // 处理有读条的技能
                if (type == 19) {
                    const name = this.result.entities[caster].name;
                    const templateID = this.result.entities[caster].templateID;
                    const log = {
                        name: name,
                        templateID: templateID,
                        skill_id: id,
                        skill_level: level,
                        time: micro / 1000,
                    };
                    this.result.time_line_result["skills"].push(log);
                }
                // 处理没有读条的技能
                else {
                    // 无读条类直接作用技能
                    // 获取处理的无读条技能
                    const skillTable = raid_analysis_constant.noChannel_skillId[this.result.map];
                    if (skillTable == undefined) {
                        return;
                    }
                    // 非记录技能，直接返回
                    if (!skillTable.includes(id)) {
                        return;
                    }
                    let data = this.result.skill[caster];
                    const key = `${id}_${level}`;
                    // 未初始化过，先写入一次记录
                    if (!(key in this.tmp.channelSkill)) {
                        this.tmp.channelSkill[key] = micro / 1000;
                        const name = data.name == undefined ? "天外来客" : data.name;
                        const templateID = data.templateID == undefined ? 0 : data.templateID;
                        const log = {
                            name: name,
                            templateID: templateID,
                            skill_id: id,
                            skill_level: level,
                            time: micro / 1000,
                        };
                        this.result.time_line_result["skills"].push(log);
                        return;
                    } else {
                        // 初始化过，进行一次判断是否写入
                        // 如果上一次该技能的事件发生在0.5s以内，说明是技能命中了多个目标，所以不写入时间轴
                        if (Math.abs(this.tmp.channelSkill[key] - micro / 1000) < 0.5) {
                            // 更新最近一次时间
                            this.tmp.channelSkill[key] = micro / 1000;
                            return;
                        }
                        const name = data.name == undefined ? "天外来客" : data.name;
                        const templateID = data.templateID == undefined ? 0 : data.templateID;
                        const log = {
                            name: name,
                            templateID: templateID,
                            skill_id: id,
                            skill_level: level,
                            time: micro / 1000,
                        };
                        this.result.time_line_result["skills"].push(log);
                    }
                }
            }
            // 下面的代码在技能类里永远无法执行，直接结束
            return;
        }

        // 模板ID匹配部分
        // 该部分主要找出一些衍生物体加入场景的时间，以及部分由模板ID构成的技能
        // 该部分的逻辑在整个文档读取完毕后需要将结果写入到result中，并且必须在读取完毕后写入
        if ([6].includes(type)) {
            const { detail } = this.current;
            const templatesTable = raid_analysis_constant.templateTable[this.result.map];
            if (templatesTable == undefined) {
                return;
            }
            // 判断npc是否在检测的id中
            const id = this.result.entities[detail.id].templateID;
            if (id in templatesTable) {
                // 判断该实体是否为首次出现
                if (!(id in this.tmp.templateId)) {
                    // 首次出现，初始化一个新的实体
                    const log = {
                        id: id,
                        name: templatesTable[id],
                        time: micro / 1000,
                        count: 1,
                    };
                    this.tmp.templateId[id] = [log];
                } else {
                    // 已经出现过了
                    // 首先计算本次内出现的个数，规定1秒内连续出现的均为同一次出现
                    const lastId = this.tmp.templateId[id].length - 1;
                    if (Math.abs(this.tmp.templateId[id][lastId].time - micro / 1000) < 1.0) {
                        // 更新数量时间后直接返回
                        this.tmp.templateId[id][lastId].count += 1;
                        this.tmp.templateId[id][lastId].time = micro / 1000;
                        return;
                    }
                    // 写入新一次出现的实体
                    const log = {
                        id: id,
                        name: templatesTable[id],
                        time: micro / 1000,
                        count: 1,
                    };
                    this.tmp.templateId[id].push(log);
                }
            }
            return;
        }
    }

    // 副本时间轴衍生方法
    // 实体分析将在文件分析结束后调用该函数，将tmp.templateId中的结果保存
    endTemplate() {
        // 若为非使用地图，该变量值为空，直接返回不需要写入
        if (this.tmp.templateId == {}) {
            return;
        }
        // 写入结果后返回
        this.result.time_line_result.templates = this.tmp.templateId;
        console.log(this.result.time_line_result.templates);
        return;
    }

    // 分析结束的时候，将统计数据整理一下
    endStat() {
        for (let type in this.result.stats) {
            for (let entity in this.result.stats[type]) {
                const statItem = this.result.stats[type][entity];
                this.result.stats[type][entity] = {
                    ...statItem,
                    ...this.getLogsStat(statItem.logs, type),
                };
            }
        }
    }

    // 统计一段时间内的数据详情
    getLogsStat(logs, type) {
        const result = {
            count: 0,
            criticalCount: 0,
            value: 0,
            max: Number.MIN_SAFE_INTEGER,
            min: Number.MAX_SAFE_INTEGER,
            total: 0,
        };
        for (let log of logs) {
            result.count += 1;
            result.value += log.value;
            result.max = Math.max(result.max, log.value);
            result.min = Math.min(result.min, log.value);
            if (log.isCritical) result.criticalCount += 1;
            if (type === "treat") result.total += log.T;
        }
        if (result.max == Number.MIN_SAFE_INTEGER) result.max = 0;
        if (result.min == Number.MAX_SAFE_INTEGER) result.min = 0;

        return result;
    }
}
