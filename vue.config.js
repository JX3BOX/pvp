require("events").EventEmitter.defaultMaxListeners = 50;

const path = require("path");
// const setting = require("./setting.json");
const pkg = require("./package.json");
const { JX3BOX } = require("@jx3box/jx3box-common");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    //❤️ Multiple pages ~
    pages: {
        pvp: {
            title: "竞技专栏 - JX3BOX",
            entry: "src/pages/pvp/index.js",
            template: "public/index.html",
            filename: "pvp/index.html",
        },
        jcl: {
            title: "JCL战斗日志 - JX3BOX",
            entry: "src/pages/jcl/index.js",
            template: "public/index.html",
            filename: "jcl/index.html",
        },
    },

    //⚛️ Proxy ~
    devServer: {
        host: "localhost",
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
                target: process.env["DEV_SERVER"] == "true" ? "http://localhost:7100" : "https://cms.jx3box.com",
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
            "/battle/jcl/": {
                target: "https://cdn.jx3box.com/",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
    },

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        //BY relative path
        (process.env.BUILD_MODE === "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        process.env.STATIC_PATH + pkg.name,

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ Webpack configuration
    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap((args) => {
        //     args[0].meta = {
        //         //------设置SEO信息
        //         Keywords: setting.keys,
        //         Description: setting.desc,
        //     };
        //     args[0].title = setting.title; //------自动添加标题后缀
        //     return args;
        // });

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
        // webworker
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .options({ inline: "fallback" })
            .end();
        config.module.rule("js").exclude.add(/\.worker\.js$/);

        config.plugin("polyfills").use(NodePolyfillPlugin);

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
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({ __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false" }),
            require("unplugin-auto-import/webpack").default({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                ],
                imports: ["vue", "vue-router"],
                dts: "types/auto-imports.d.ts", // 自定义生成.d.ts位置
            }),
        ],
    },
};

function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/common.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
        path.resolve(__dirname, "./src/assets/css/var.less"),
        path.resolve(__dirname, "./src/assets/css/pvp/var.less"),
        path.resolve(__dirname, "./src/assets/css/jcl/var.less")
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}
