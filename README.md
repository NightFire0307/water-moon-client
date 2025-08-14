# 📸 Water Moon Client - 在线选片端

# 在线选片客户端（water-moon-client）

> 🎯 高端、现代风格的在线选片系统客户端，支持原片筛选、产品标记、结果预览等功能。
> 搭配 [water-moon-server](https://github.com/NightFire0307/water-moon-server) 和 [water-moon-admin](https://github.com/NightFire0307/water-moon-admin) 使用。

## 📌 项目简介
本项目是为影楼、摄影工作室等场景打造的在线选片客户端，主要供客户在线浏览并选择照片。
支持多阶段选片、产品标记、实时进度保存和安全访问，旨在提供高端、高效、易用的选片体验。

## ✨ 核心功能
- **在线浏览原片**
  支持懒加载与缩略图加载优化，提升浏览速度与流畅度。
- **分阶段选片**
  预选阶段与产品选片阶段分离，可灵活控制客户流程。
- **照片标记**
  支持标记制作产品类型（如大框、摆台、相册等）。
- **进度自动保存**
  通过定时同步与本地缓存保证数据安全。
- **选片结果预览**
  客户可查看已选照片及备注，支持导出 PDF。
- **安全访问**
  每个订单生成专属链接与动态密码，确保隐私。

## 🛠 技术栈
- **前端框架**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI 组件**: [Ant Design](https://ant.design/) + [TailWindCss](https://tailwindcss.com/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **图片存储**: [MINIO](https://www.min.io/)
- **虚拟列表**: react-window（提升大图列表渲染性能）

## 📂 目录结构
```
├── src
│ ├── components # 公共组件
│ ├── pages # 页面组件
│ ├── stores # Zustand 状态管理
│ ├── services # 接口请求封装
│ ├── hooks # 自定义 Hooks
│ ├── utils # 工具函数
│ ├── types # TypeScript 类型定义
│ └── App.tsx # 应用入口
├── public # 静态资源
└── package.json
```

## 功能截图
![界面登陆](/screenshots/login.png)

## 项目启动
```bash
git clone -b feature/ui-redesign https://github.com/NightFire0307/water-moon-client.git
cd water-moon-client
```

## 🤝 参与贡献（Contributing）

项目目前还不完善，欢迎任何形式的贡献！无论是大佬指点，提交 bug、提建议、添加功能，还是改进文档，都是对项目的重要支持

[license-src]: https://img.shields.io/github/license/productdevbook/unemail.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/NightFire0307/water-moon-client/blob/main/LICENSE
