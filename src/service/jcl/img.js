import { $img as $ } from "./axios";

export function getMaps() {
    return $.get("/map/data/map_index.json");
}

export function getBannerIndex() {
    return $.get("/pve/index.json");
}
