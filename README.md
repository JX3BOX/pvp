# Vue3 Boilerplate

## 初始化

-   `package.json`修改 name 字段为项目标识名，如果为 npm 包请添加@jx3box/前缀。
-   `.github/workflows`修改 $project 为上方项目名，如果为 npm 包请使用 pkg actions 方案[workflows](https://github.com/JX3BOX/jx3box-workflows)。
-   `.env`指定静态资源模式，`setting.json`指定静态资源路径

## 私有库

-   配置 secrets：`ACCESS_TOKEN`，仓库写+包读取权限
-   配置 secrets：`ACCESSKEY_ID`和`ACCESS_KEY_SECRET`，oss 读写权限

## 其它

-   如果为单页，项目 SEO 信息请编写在`setting.json`中

## 开发

-   `npm install` 安装依赖
-   `npm run serve` 启动本地服务
-   `npm run build` 构建

## json 维护

`assets/data/martial`内的 `kungfu_origin.json` 和 `kungfu_std.json` 来自于 [bps](https://github.com/JX3BOX/bps)。需要使用 tools 脚本来更新。
`kungfuid.json`, `pasv.json`, `zhenfa.json` 需要人工维护
