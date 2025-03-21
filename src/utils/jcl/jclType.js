/**
 * 为了减少文件体积，解析的结果键值都只有一个字符
 * 维护的时候，如果需要看字段是什么意思请对照着这里面的解析函数里的注释看
 * 注意分辨小写l大写i（雾
 */

// 1 全局信息标签
const fightTimeInfo = (data) => {
    let [client, server, time] = data[2].split("::");
    return {
        start: data[1], // isStart 是否是开始战斗
        client, // zhcn_hd
        server, // 服务器
        time, // 时间
        during: data[3], // during， 持续时间
        map: data[4], // map， 地图
        raw: data[2], // 用于PVP解析
    };
};
// 2,3,6,7,10,11 用于log的详情只有一个单独的ID的情况，尽量复用
const singleIDInfo = (data) => {
    return {
        id: data[1], //id
    };
};
// 4 用于解析玩家的信息
const playerInfo = (data) => {
    let { 1: id, 2: name, 3: school, 4: mount, 5: equipScore, 6: _equips, 7: _talents, 8: guid } = data;
    // 单独处理装备
    let equips = [];
    for (let eIndex in _equips) {
        let equip = _equips[eIndex];
        if (!equip) continue;
        let embedding = [];
        for (let i = 1; i <= 3; i++) if (equip[5]?.[i]) embedding.push(`${equip[5][i][1]}_${equip[5][i][2]}`);
        let colorful = equip[5][0] ? `${equip[5][0][1]}_${equip[5][0][2]}` : "";
        let enhance = [equip[6], equip[7], equip[8]].filter((x) => x > 0);
        equips.push({
            position: equip[1], //position  装备位置
            id: `${equip[2]}_${equip[3]}`, //item      装备对应的物品ID
            strength: equip[4], //strength  精炼等级
            embedding: embedding, //embedding 镶嵌物品
            stone: colorful, //colorful  五彩石
            enhance: enhance, //enhance   附魔
        });
    }
    // 单独处理奇穴
    let talents = [];
    for (let tIndex in _talents) {
        let talent = _talents[tIndex];
        talents.push({
            order: parseInt(tIndex), //order     奇穴排序 1-12
            position: talent[1], //position  奇穴纵向位置 1-5
            skill: `${talent[2]}_${talent[3]}`, //奇穴对应的技能 id_level
        });
    }
    return {
        id, //id   本次战斗的id
        name, //name 玩家名称
        school, //school 门派
        mount, //mount 心法
        equipScore, //equipScore 装备评分
        equips, //equips 装备
        talents, //talents 奇穴
        guid, //guid 玩家guid
    };
};
// 5,9 用于NPC/玩家 进战脱战的细节解析
const fightHintInfo = (data) => {
    let { 1: id, 2: isFight, 3: curHP, 4: maxHP, 5: curMP, 6: maxMP } = data;
    return {
        id, //id 玩家的单位ID
        isFight, //isFight 进入战斗还是离开战斗，true是进入
        curHP, //curHP 当前血量
        maxHP, //maxHP 最大血量
        curMP, //curMP 当前蓝量
        maxMP, //maxMP 最大蓝量
    };
};
// 8 用于NPC出现的时候信息的解析
const npcInfo = (data) => {
    let { 1: id, 2: name, 3: templateID, 4: belongID, 5: x, 6: y, 8: z } = data;
    return {
        id, //id  ID
        name, //name 名称
        templateID, //模板ID
        belongID, //归属ID
        x,
        y,
        z, //出现的坐标
    };
};
// 12 交互物品信息
const doodadInfo = (data) => {
    let { 1: id, 2: name, 3: templateID, 4: belongID, 5: x, 6: y, 8: z } = data;
    return {
        id, //id  ID
        name, //name 名称
        templateID, //模板ID
        belongID, //归属ID
        x,
        y,
        z,
    };
};
// 13 BUFF更新信息
const buffUpdateInfo = (data) => {
    let {
        1: target,
        2: isDelete,
        3: index,
        4: canCancel,
        5: id,
        6: stackNum,
        7: endFrame,
        8: init,
        9: level,
        10: source,
        11: isValid,
        12: leftFrame,
    } = data;
    return {
        target, //targetID  目标ID
        isDelete, //isDelete  是否删除
        index,
        canCancel, //canCancel 是否可以取消
        id, //BUFF ID
        stackNum, //stackNum  叠加层数
        endFrame, //buff结束的逻辑帧
        init,
        level, //buff等级
        source, //来源ID
        isValid,
        leftFrame, //也不知道干嘛的
    };
};
// 14 NPC喊话的信息
const playerSayInfo = (data) => {
    let { 1: content, 2: id, 3: channel, 4: name } = data;
    return {
        content, //content 内容
        id, //id      ID
        channel, //channel 频道
        name, //name    名称
    };
};
// 15 系统警告框
const warningMessageInfo = (data) => {
    return {
        type: data[1], //type   类型
        content: data[2], //content 内容
    };
};
// 16 团队添加成员信息
const partyAddInfo = (data) => {
    let { 1: teamID, 2: memberID, 3: groupIndex } = data;
    return {
        teamID, //teamID 队伍ID
        memberID, //memberID 成员ID
        groupIndex, //groupIndex 组别
    };
};
// 17 团队在线成员状态改变
const partyMemberStateChangeInfo = (data) => {
    let { 1: teamID, 2: memberID, 3: online } = data;
    return {
        teamID, //团队ID
        memberID, //成员ID
        online, //在线情况
    };
};
// 18 系统消息
const sysSayInfo = (data) => {
    return {
        content: data[1].replace(/\\n/g, ""), //content 内容
        type: data[2], //type 类型
    };
};
// 19 技能释放
const skillCastInfo = (data) => {
    return {
        caster: data[1], //释放者的ID
        id: data[2], //技能ID
        level: data[3], //技能等级
    };
};
// 20 技能释放结果
const skillCastResultInfo = (data) => {
    return {
        caster: data[1], //释放者的ID
        id: data[2], //技能ID
        level: data[3], //技能等级
        result: data[4], //技能释放结果
    };
};
// 21 技能产生效果
const skillEffectInfo = (data) => {
    let {
        1: caster,
        2: target,
        3: isReact,
        4: eventType,
        5: id,
        6: level,
        7: isCritical,
        8: valuesLength,
        9: values,
    } = data;
    return {
        caster, //caster  技能释放者ID
        target, //target  技能目标ID
        isReact, //isReact 是否是反击，大多数表示为吸血
        eventType, //eventType 效果类型，1为技能，2为BUFF
        id, //效果id
        level, //效果等级
        isCritical, //isCritical 是否会心
        valuesLength,
        values, //values 详细数值
    };
};
// 22,23,24,25,26 技能被格挡/抵消/闪避等等
const skillInvalidInfo = (data) => {
    let { 1: caster, 2: target, 3: eventType, 4: id, 5: level, 6: damageType } = data;
    return {
        caster,
        target,
        eventType,
        id,
        level,
        damageType,
    };
};
// 27 治疗产生效果
const beHealInfo = (data) => {
    return {
        id: data[1], //承疗玩家id
        value: data[2], //生命值变化量
    };
};
// 28 击杀/死亡记录
const killInfo = (data) => {
    return {
        id: data[1], //被杀的id
        killer: data[2], //击杀者ID
    };
};

const entityPositionInfo = (data) => {
    return {
        type: data[1], //目标类型
        id: data[2], //目标ID
        x: data[3], //x坐标
        y: data[4], //y坐标
        z: data[5], //z坐标
    };
};

/**t
 * JCL日志文件信息的类型, 键值为Type, 值为一个数组，分别为Type的名称，描述，以及解析函数
 */
export const JCL_TYPE = {
    1: ["战斗时间", fightTimeInfo],
    2: ["玩家进入场景", singleIDInfo],
    3: ["玩家离开场景", singleIDInfo],
    4: ["玩家信息数据", playerInfo],
    5: ["玩家战斗状态改变", fightHintInfo],
    6: ["NPC 进入场景", singleIDInfo],
    7: ["NPC 离开场景", singleIDInfo],
    8: ["NPC 信息数据", npcInfo],
    9: ["NPC 战斗状态改变", fightHintInfo],
    10: ["交互物件进入场景", singleIDInfo],
    11: ["交互物件离开场景", singleIDInfo],
    12: ["交互物件信息数据", doodadInfo],
    13: ["BUFF 刷新", buffUpdateInfo],
    14: ["NPC喊话", playerSayInfo],
    15: ["显示警告框", warningMessageInfo],
    16: ["团队添加成员", partyAddInfo],
    17: ["团队成员在线状态改变", partyMemberStateChangeInfo],
    18: ["系统消息", sysSayInfo],
    19: ["技能施放", skillCastInfo],
    20: ["技能施放结果", skillCastResultInfo],
    21: ["技能产生效果", skillEffectInfo],
    22: ["格挡", skillInvalidInfo],
    23: ["屏蔽", skillInvalidInfo],
    24: ["未命中", skillInvalidInfo],
    25: ["命中", skillInvalidInfo],
    26: ["闪避", skillInvalidInfo],
    27: ["承受治疗", beHealInfo],
    28: ["死亡/击杀", killInfo],
    29: ["单位位置", entityPositionInfo],
};

//用于21号技能产生效果的，具体数值类型解析
export const SKILL_RESULT_TYPE = {
    0: "外功伤害",
    1: "阳性内功伤害",
    2: "混元内功伤害",
    3: "阴性内功伤害",
    4: "毒性内功伤害",
    5: "反弹伤害",
    6: "治疗",
    7: "生命偷取",
    8: "化解治疗",
    9: "化解伤害",
    10: "无效伤害",
    11: "拆招/招架",
    12: "识破",
    13: "有效伤害",
    14: "有效治疗",
    15: "吸取生命",
    16: "吸取内力",
};
