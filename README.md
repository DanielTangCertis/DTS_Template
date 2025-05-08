# 初始化代码说明

## 目录说明

- `node_modules` -- *所有的项目依赖包都放在这个目录下*
- `public` -- *公共文件夹*
    - `aircity` --- *放的连接视频流及配置项的 js 文件(ac.min.js ac_conf.js userinfo.js)*
    - `favicon.ico` -- *网站的显示图标*
- `src` -- *源文件目录，编写的代码基本都在这个目录下*
    - `api` -- *根据不同的请求前缀封装好的axios请求,可当做参考及进行修改*
    - `assets` -- *放置静态文件的目录，比如 logo.png 就放在这里*
    - `layout` -- *布局组件* 
    - `components` -- *Vue 的组件文件，自定义的组件都会放到这*
    - `router` -- *vue-router vue 路由的配置文件*
    - `store` -- *状态管理器*
    - `App.vue` -- *根组件*
    - `main.ts` -- *入口文件，因为采用了 TypeScript 所以是 ts 结尾*
- `.browserslistrc` -- *在不同前端工具之间公用目标浏览器和 node 版本的配置文件，作用是设容性*
- `.env.development`  -- *开发环境变量*
- `.env.production`   -- *生产环境变量*
- `.eslintrc.js` -- *Eslint 的配置文件*
- `.gitignore` -- *用来配置那些文件不归 git 管理*
- `package.json` -- *命令配置和包管理文件*




## 说明
>**本初始化代码是我们在许多项目中都在使用的,里面有一些编写好的组件或方法,可以直接拿来使用,在项目成员开始开发前请负责人先确定要使用组件的样式及构成,接下来会介绍一些组件和方法如何去使用~**

### 屏幕适配方案
>Sass @mixin 与 @include<br> @mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。<br>@include 指令可以将混入（mixin）引入到文档中。<br>mixin指令存放在 src-->styles-->common.scss

- `public`  
    - *`customTag`* ***放的是二次开发中可能会用到的自定义标签的html页面,里面有写好的获取参数的方法,可以进行传参,根据参数来显示内容,可根据实际情况进行修改***
- `src` 
    - `api` ***根据不同的请求前缀封装好的axios请求,可当做参考及进行修改***
    - `components` 
        - *`player`* ***连接视频流组件(不要多次引用)***
        - *`aircityutils`* ***导出cloud云渲染的加载完成和交互事件的回调事件的方法***
         - `left_box.vue` ***页面左侧的内容-使用scss混入来定义样式-使用插槽的形式进行内容展示-请根据UI调整样式***
        - `right_box.vue` ***页面右侧的内容-使用scss混入来定义样式-使用插槽的形式进行内容展示-请根据UI调整样式***
        - *`Lease_title`* ***标题组件 根据UI进行调整***
        - *`Box`* ***是一个div元素块的组件,因为使用了scss的混入 **@mixin** 与 **@include**所以为了组件能够动态的接收定义的宽高等使用了这样的组件通过传参的形式来*** 
        - *`tools`* ***一些和视频流交互相关的组件比如图层树,导览列表,天气控制等,可做参考***
        ``` 
        示例:
        <Left_box>
            <Lease_title>菜单一</Lease_title>
            <Box class="box" :width="300" :height="900"> 内容 </Box>
        </Left_box>
        <Right_box>
            <Lease_title>菜单二</Lease_title>
            <Box class="box" :width="300" :height="900"> 内容</Box>
        </Right_box>

        效果可运行代码查看
        ```
        
## 其他

**DTS官网地址：**[https://dtsdoc.g-bim.cn/](https://dtsdoc.g-bim.cn/)

**接口文档：**[http://sdk.g-bim.cn/doc/api/index.html](http://sdk.g-bim.cn/doc/api/index.html) -- 以安装的cloud软件版本里面的文档为准 

