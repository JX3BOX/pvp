import { $node } from "@jx3box/jx3box-common/js/https_v2";

function getRecipe(params) {
    return $node().get("/bps/recipe", {
        params,
    });
}

export { getRecipe };
