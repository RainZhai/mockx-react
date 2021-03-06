### mockx react应用
mockx的react控制台，通过调用mockx提供的数据接口，来进行模拟数据的管理。
### Usage
```
本地运行
yarn install || npm install
yarn start || npm start
```

![mockx react控制台](https://raw.githubusercontent.com/RainZhai/mockx-react/master/src/common/images/screen1.png)

### Tech Stack
- [x] 打包构建：Babel Webpack(3.x)
- [x] 热更新
- [x] 包管理：Yarn || Npm
- [x] UI库：React & React-Dom
- [x] UI组件：Antd(2.10x)
- [x] 路由：React-Router(4.x) & History
- [x] JS：ES6
- [x] 样式：Less
- [x] 框架：Redux
- [x] 与后台通信：Fetch
- [ ] 图片懒加载
- [ ] 测试用例
- [ ] 使用ts重构

### Features
* 接口模块
  * 实现对接口的增删改查,搜索等功能

### Third-party libraries
* css动画库：Animate.css
* 富文本编辑：react-draft-wysiwyg
* 全屏插件：screenfull
* 图片弹层查看插件：photoswipe
* 日期处理：Moment
* 可视化图表：echarts-for-react

### Project Structure
```
├── build.js                   项目打包后的文件
├── config                     webpack配置文件
│   ├──...
│   ├──webpack.config.dev.js   开发环境配置
│   ├──webpack.config.prod.js  生产环境配置
├── node_modules               node模块目录
├── public
│   └──index.html
├── scripts
│   ├── build.js               打包项目文件
│   ├── start.js               启动项目文件
│   └── test.js                测试项目文件
├── src
│   ├── client                 汇聚目录
│   ├── common                 核心目录
│   │   ├── actions            redux中的action
│   │   ├── components         通用功能组件
│   │   ├── container          通用样式组件
│   │   ├── images
│   │   ├── pages              页面模块
│   │   ├── reducers           redux中的reducer
│   │   ├── utils              工具类
│   │   │   ├── config.js      通用配置(全局变量待实现)
│   │   │   ├── menu.js        菜单配置
│   │   │   └── ajax.js        ajax模块(日后用到)
│   │   └── routes.js          前端路由
│   └── server                 服务端目录(日后用到)
│       └── controller
├── .gitignore
├── package.json
├── README.md
└── yarn.lock
```