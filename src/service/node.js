import { $node } from "@jx3box/jx3box-common/js/https_v2";

function getRecipe(params) {
    return $node().get("/bps/recipe", {
        params,
    });
}

function getSkill(query, params) {
    let condition = isNaN(query) ? "name" : "id";
    return $node()
        .get(`/skill/${condition}/${query}`, {
            params: params,
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
}

export { getRecipe, getSkill };
