import { $cms } from "@jx3box/jx3box-common/js/https_v2.js";

export function getApi(){
    return $cms().get('/api/path/to')
}

