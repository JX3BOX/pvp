const path = require("path");
const setting = require("./setting.json");
const pkg = require("./package.json");
module.exports = {
    //❤️ Multiple pages ~
    // pages: {
    //     index: {
    //         title: "Home",
    //         entry: "src/main.js",
    //         template: "public/index.html",
    //         filename: "index.html",
    //     },
    //     $project: {
    //         title: "Project",
    //         entry: "src/core/$project/index.js",
    //         template: "public/$project/index.html",
    //         filename: "$project/index.html",
    //     },
    // },

    //⚛️ Proxy ~
    devServer: {
        proxy: {
            "/api/vip": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/inspire": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/team": {
                target: "https://team.api.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cms": {
                target: process.env["DEV_SERVER"] == "true" ? "http://localhost:5120" : "https://cms.jx3box.com",
            },
            "/api/article": {
                target: "https://next2.jx3box.com",
            },
            "/api/messages": {
                target: "https://helper.jx3box.com",
            },
            "/api/post/favorite": {
                target: "https://helper.jx3box.com",
            },
            "/api/wiki": {
                target: "https://helper.jx3box.com",
            },
            "/api/personal": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cny": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
    },

    //❤️ define path for static files ~
    publicPath: process.env.NODE_ENV === "development" ? "/" : process.env.STATIC_PATH + pkg.name,

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ Webpack configuration
    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        config.plugin("html").tap((args) => {
            args[0].meta = {
                //------设置SEO信息
                Keywords: setting.keys,
                Description: setting.desc,
            };
            args[0].title = setting.title; //------自动添加标题后缀
            return args;
        });

        //💝 in-line small imgs ~
        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4KiB
            },
        });

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

        // 注册 sass-resources-loader
        config.module
            .rule("scss")
            .oneOf("vue")
            .use("sass-resources-loader")
            .loader("sass-resources-loader")
            .options({
                // 这里也是你的自定义变量和样式文件的路径
                resources: path.resolve(__dirname, "./src/assets/css/element-plus-override.scss"),
            });
    },
};

function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/common.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
        path.resolve(__dirname, "./src/assets/css/var.less")
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}
