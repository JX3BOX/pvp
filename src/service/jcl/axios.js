import jx3box_url from "@jx3box/jx3box-common/data/jx3box.json";
const { __server, __imgPath, __helperUrl, __team } = jx3box_url;

import axios from "axios";

const $ = axios.create({
    baseURL: __server,
    withCredentials: true,
});

const $helper = axios.create({
    baseURL: __helperUrl,
});

const $img = axios.create({
    baseURL: __imgPath,
});

const $team = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? __team : "/",
    withCredentials: true,
    auth: {
        username: (localStorage && localStorage.getItem("token")) || "",
        password: "next common request",
    },
    headers: {},
});

export { $, axios, $img, $helper, $team };
