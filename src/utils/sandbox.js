import { chain, groupBy, uniq } from "lodash";
import sandboxData from "@/assets/data/sandboxMap.json";
const { castles, maps } = sandboxData;
const castleMap = groupBy(castles, "map");

// 阵营老家
const homeMap = {
    haoqi: "NanPingShan",
    eren: "KunLun",
};

const buildAdjMatrix = (maps, camp) => {
    const A = [];
    for (const from of maps) {
        const row = [];
        for (const to of maps) {
            if (from.key === to.key) {
                // 自己到自己必然可达
                row.push(1);
            } else if (from.neighbors.includes(to.key) && from.camp == to.camp && from.camp == camp) {
                // 地图相邻且阵营相同都等于camp
                row.push(1);
            } else {
                row.push(0);
            }
        }
        A.push(row);
    }
    return A;
};

const MatrixMultiply = (A, B) => {
    const C = [];
    for (let i = 0; i < A.length; i++) {
        const row = [];
        for (let j = 0; j < B[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < B.length; k++) {
                sum += A[i][k] * B[k][j];
            }
            row.push(sum);
        }
        C.push(row);
    }
    return C;
};

const buildAccessibilityMatrix = (A, k) => {
    const Ms = [A];
    for (let i = 1; i < k; i++) {
        Ms.push(MatrixMultiply(Ms[i - 1], A));
    }
    const R = [];
    for (let i = 0; i < A.length; i++) {
        const row = [];
        for (let j = 0; j < A[0].length; j++) {
            let flag = 0;
            for (let m of Ms) {
                if (m[i][j] > 0) {
                    row.push(1);
                    flag = 1;
                    break;
                }
            }
            if (!flag) {
                row.push(0);
            }
        }
        R.push(row);
    }
    return R;
};

export const calcAttackPath = (_castles, camp) => {
    const home = homeMap[camp];

    // 遍历所有地图，确定地图的阵营
    const castlesBelong = _castles.reduce((acc, cur) => {
        acc[cur.name_pinyin] = cur.camp;
        return acc;
    }, {});

    const allMaps = chain(maps)
        .map((map, index) => {
            const mapCastles = castleMap[map.key];
            const m = { ...map, i: index, camp: "" };
            if (uniq(mapCastles.map((castle) => castlesBelong[castle.key])).length === 1) {
                m.camp = castlesBelong[mapCastles[0].key];
            }
            return m;
        })
        .keyBy("key")
        .value();

    // 构建邻接矩阵
    const A = buildAdjMatrix(Object.values(allMaps), camp);
    // 计算可达矩阵
    const R = buildAccessibilityMatrix(A, A.length);

    const mapAttacks = [];
    const castleAttacks = [];
    // 地图间进攻方向
    for (const map of Object.values(allMaps)) {
        // 阵营是否符合需求
        if (map.camp != camp) continue;
        // 是否有回家路径
        if (R[map.i][allMaps[home].i] === 0) continue;
        // 判断地图之间的箭头
        for (const neighborKey of map.neighbors) {
            // 逐个判定相邻的地图
            const neighbor = allMaps[neighborKey];
            // 如果相邻地图有所有者且是敌对阵营
            if (neighbor.camp && neighbor.camp != camp) {
                mapAttacks.push([map.key, neighborKey]);
            }
        }
    }

    // 地图内据点间进攻方向
    for (const map of Object.values(allMaps)) {
        // 如果该地图有所属阵营，直接pass
        if (map.camp) continue;
        // 判断该地图内据点所属阵营数量是否大于1
        if (
            chain(castles)
                .filter((castle) => castle.map == map.key)
                .map((castle) => castlesBelong[castle.key])
                .uniq()
                .value().length <= 1
        ) {
            continue;
        }
        // 判断该地图邻居是否有 有回家路径的地图
        const hasGoHomeNeighbor = map.neighbors.some((neighborKey) => {
            const neighbor = allMaps[neighborKey];
            return neighbor.camp == camp && R[neighbor.i][allMaps[home].i] > 0;
        });

        if (hasGoHomeNeighbor) {
            // 地图内所有据点
            const mapCastles = castleMap[map.key];
            const ourCastle = mapCastles.find((castle) => castlesBelong[castle.key] == camp);
            const anotherCastle = mapCastles.find((castle) => castlesBelong[castle.key] != camp);
            // 从该地图内的我方阵营据点指向另一个据点
            if (!ourCastle || !anotherCastle) continue;
            castleAttacks.push([ourCastle.key, anotherCastle.key]);
        }
    }

    return {
        castle: castleAttacks,
        map: mapAttacks,
    };
};
