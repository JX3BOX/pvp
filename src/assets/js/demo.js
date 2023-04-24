const fs = require("fs");
const axios = require("axios");
const xfid = require("@jx3box/jx3box-data/data/xf/xfid.json");
const xfmap = require("@jx3box/jx3box-data/data/xf/xf.json");

function render() {
    //
    axios
        .get(
            "https://helper.jx3box.com/api/skill_groups?keys=jianshang,diyu,wudi,kongzhi,jiekong,qusan,jianliao,daduan,weiyi,jixing,jiansu,chaofeng,huifu&client=origin"
        )
        .then((data) => {
            const res = data.data.data.data;

            const arr = Object.keys(xfid).reduce((acc, cur) => {
                if (!acc.find((item) => item.mount == cur)) {
                    acc.push({
                        mount: cur,
                        content: [],
                    });
                }
                return acc;
            }, []);

            Object.values(res).forEach((item) => {
                console.log(item);
                const skills = item.items.filter((i) => i.key === "skill" && i.id);
                skills.forEach((i) => {
                    const obj = {
                        name: item.label,
                        skills: [],
                    };
                    const mount = xfmap[i.meta_2]?.id;
                    const index = arr.findIndex((i) => i.mount == mount);
                    if (index > -1) {
                        const skill = {
                            SkillID: i.id,
                            IconID: i.icon,
                            Name: i.label,
                            desc: i.meta_4,
                        };
                        obj.skills.push(skill);
                        // 如果有相同的name，就合并
                        const index2 = arr[index].content.findIndex((i) => i.name == obj.name);
                        if (index2 > -1) {
                            arr[index].content[index2].skills.push(...obj.skills);
                        } else {
                            arr[index].content.push(obj);
                        }
                    }
                });
            });

            arr.forEach((item) => {
                item.content = JSON.stringify(item.content);
            });

            fs.writeFileSync("./src/assets/js/demo.json", JSON.stringify(arr, null, 4));
        });
}

render();
