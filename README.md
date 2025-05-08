# 初始化模板说明

## 主要结构

- `node_modules` -- *所有的项目依赖包都放在这个目录下*
- `public` -- *公共文件夹*
    - `aircity` --- *连接视频流及配置项的 js 文件(ac.min.js ac_conf.js userinfo.js)*
- `src` -- *源文件目录*
    - `assets` -- *放置静态文件的目录*
    - `components` -- *Vue 的组件文件，自定义的组件都会放到这*
        - `animation` -- *导览模块*
        - `header` -- *顶部导航栏*
        - `layerTree` -- *图层树*
        - `player` -- *视频流*
        - `weather` -- *时间天气*
        - `routerNav` -- *路由导航*
    - `router` -- *vue-router vue 路由的配置文件*
    - `store` -- *状态管理器*
    - `views` -- *页面文件*
    - `App.vue` -- *根组件*
    - `main.js` -- *入口文件*
- `.gitignore` -- *用来配置那些文件不归 git 管理*
- `package.json` -- *命令配置和包管理文件*

## 其他

**DTS官网地址：**[https://dtsdoc.g-bim.cn/](https://dtsdoc.g-bim.cn/)

**接口文档：**[http://sdk.g-bim.cn/doc/api/index.html](http://sdk.g-bim.cn/doc/api/index.html) -- 以安装的cloud软件版本里面的文档为准 


