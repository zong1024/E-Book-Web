📚 E-Book-Web - EPUB 电子书阅读网站
=======================================

## 项目文件结构

```
E-Book-Web/
│
├── 📁 frontend/                    # React 前端应用
│   ├── 📁 src/
│   │   ├── 📁 components/          # 可复用组件
│   │   │   ├── 📄 EpubReader.tsx   # EPUB 阅读器核心组件
│   │   │   ├── 📄 EpubReader.css   # 阅读器样式
│   │   │   ├── 📄 FileUpload.tsx   # 文件上传组件
│   │   │   └── 📄 FileUpload.css   # 上传组件样式
│   │   │
│   │   ├── 📁 pages/               # 页面组件
│   │   │   ├── 📄 HomePage.tsx     # 主页（图书列表）
│   │   │   ├── 📄 HomePage.css     # 主页样式
│   │   │   ├── 📄 ReaderPage.tsx   # 阅读页面
│   │   │   └── 📄 ReaderPage.css   # 阅读页面样式
│   │   │
│   │   ├── 📁 utils/               # 工具函数
│   │   │   └── 📄 api.ts           # API 调用封装
│   │   │
│   │   ├── 📄 App.tsx              # 应用主组件
│   │   ├── 📄 App.css              # 应用全局样式
│   │   ├── 📄 main.tsx             # React 入口文件
│   │   └── 📄 index.css            # 全局样式
│   │
│   ├── 📄 index.html               # HTML 模板
│   ├── 📄 package.json             # 依赖管理
│   ├── 📄 tsconfig.json            # TypeScript 配置
│   ├── 📄 tsconfig.node.json       # TypeScript Node 配置
│   ├── 📄 vite.config.ts           # Vite 开发服务器配置
│   ├── 📄 Dockerfile               # Docker 镜像定义
│   └── 📄 .env.example             # 环境变量示例
│
├── 📁 backend/                     # Node.js + Express 后端
│   ├── 📁 src/
│   │   ├── 📁 config/              # 配置文件
│   │   │   └── 📄 database.ts      # SQLite 数据库配置
│   │   │
│   │   ├── 📁 controllers/         # 业务逻辑控制器
│   │   │   └── 📄 bookController.ts # 图书相关业务逻辑
│   │   │
│   │   ├── 📁 routes/              # API 路由定义
│   │   │   └── 📄 books.ts         # 书籍 API 路由
│   │   │
│   │   ├── 📁 utils/               # 工具函数
│   │   │   └── 📄 epubParser.ts    # EPUB 文件解析工具
│   │   │
│   │   └── 📄 server.ts            # Express 服务器入口
│   │
│   ├── 📁 uploads/                 # EPUB 文件存储目录
│   │   └── 📄 .gitkeep             # Git 保留文件
│   │
│   ├── 📄 package.json             # 依赖管理
│   ├── 📄 tsconfig.json            # TypeScript 配置
│   ├── 📄 Dockerfile               # Docker 镜像定义
│   └── 📄 .env.example             # 环境变量示例
│
├── 📁 data/                        # 数据库文件存储位置 (git 忽略)
│   └── 📄 data.db                  # SQLite 数据库 (自动创建)
│
├── 📄 README.md                    # 完整项目文档
├── 📄 QUICKSTART.md                # 快速开始指南
├── 📄 setup.sh                     # Linux/macOS 一键安装脚本
├── 📄 setup.bat                    # Windows 一键安装脚本
├── 📄 docker-compose.yml           # Docker Compose 配置
├── 📄 .gitignore                   # Git 忽略配置
└── 📄 PROJECT_STRUCTURE.md         # 本文件

```

---

## 核心模块说明

### 📋 前端模块 (React + TypeScript)

#### 1. **首页 (HomePage)**
   - 显示已上传的电子书列表
   - 支持拖拽上传 EPUB 文件
   - 删除电子书功能
   - 快速跳转到阅读页面

#### 2. **阅读器 (ReaderPage + EpubReader)**
   - 集成 EPUB.js 渲染 EPUB 文件
   - 分页显示内容
   - 实时阅读进度追踪
   - 目录导航
   - 字体大小调整
   - 键盘快捷键支持

#### 3. **文件上传 (FileUpload)**
   - 拖拽上传界面
   - 文件格式验证
   - 上传进度显示
   - 错误提示

---

### 🔧 后端模块 (Node.js + Express)

#### 1. **API 路由 (routes/books.ts)**
   - `GET /api/books` - 获取所有书籍
   - `POST /api/books/upload` - 上传新书
   - `GET /api/books/:id` - 获取书籍详情
   - `GET /api/books/:id/file` - 下载 EPUB 文件
   - `DELETE /api/books/:id` - 删除书籍

#### 2. **业务逻辑 (controllers/bookController.ts)**
   - 处理文件上传和存储
   - 提取 EPUB 元数据
   - 数据库操作
   - 文件管理

#### 3. **数据库 (config/database.ts)**
   - SQLite 数据库初始化
   - 数据库连接管理
   - 异步数据库操作封装

#### 4. **EPUB 解析 (utils/epubParser.ts)**
   - 提取书籍标题
   - 提取作者信息
   - 提取封面图片

---

## 数据流

```
用户浏览器
    ↓
[前端 React App] ← → [后端 Express Server]
    ↓                 ↓
  Vite Dev          Node Process
  (port 3000)       (port 5000)
    ↓                 ↓
  API 调用  ←────→   SQLite DB
  (axios)            & File Storage
```

---

## 关键技术要点

### 前端
- 使用 **React Router v6** 进行页面路由
- **EPUB.js** 库用于渲染 EPUB 内容
- **Axios** 进行 HTTP 通信
- **TypeScript** 确保类型安全
- **CSS** 实现响应式设计

### 后端
- **Express.js** 作为 Web 框架
- **Multer** 中间件处理文件上传
- **SQLite** 轻量级数据库存储元数据
- **EPUB** 库解析 EPUB 文件信息
- **CORS** 中间件允许跨域请求

---

## 配置文件说明

### Vite 配置 (frontend/vite.config.ts)
```typescript
- 开发服务器运行在 port 3000
- API 代理到后端 http://localhost:5000
```

### TypeScript 配置
```
- 严格模式启用
- ES2020 目标
- 支持 JSX 语法
```

### Docker 配置
- 前端运行在 Node 18 Alpine 镜像
- 后端同样基于 Node 18 Alpine
- 共享网络以便通信

---

## 如何添加新功能

### 1. 添加新的 API 端点

**步骤:**
1. 在 `backend/src/routes/books.ts` 中添加新的路由
2. 在 `backend/src/controllers/bookController.ts` 中实现业务逻辑
3. 在 `frontend/src/utils/api.ts` 中添加相应的 API 调用
4. 在前端组件中使用新的 API

### 2. 添加新的页面

**步骤:**
1. 在 `frontend/src/pages/` 中创建新组件 `NewPage.tsx`
2. 在 `frontend/src/App.tsx` 中添加路由
3. 创建对应的 CSS 文件

### 3. 添加新的数据库表

**步骤:**
1. 在 `backend/src/config/database.ts` 的 `initializeDatabase()` 中添加 CREATE TABLE 语句
2. 在 `backend/src/controllers/` 中创建对应的控制器
3. 在路由中添加相关接口

---

## 开发工作流

```
1. 启动后端服务
   → npm run dev (backend/)
   
2. 启动前端开发服务器
   → npm run dev (frontend/)
   
3. 打开浏览器
   → http://localhost:3000
   
4. 修改代码
   → 自动热重载 (HMR)
   
5. 查看更改
   → 浏览器自动刷新
```

---

## 故障排除

| 问题 | 原因 | 解决方案 |
|-----|------|--------|
| 端口被占用 | 进程仍在运行 | 关闭现有进程或使用不同端口 |
| 数据库错误 | 权限问题 | 检查 uploads/ 目录权限 |
| EPUB 无法渲染 | 文件损坏 | 尝试其他 EPUB 文件 |
| API 调用失败 | 后端未运行 | 确保后端服务已启动 |

---

**版本:** 1.0.0  
**最后更新:** 2026-03-18  
**开发者:** Your Team

🚀 Happy coding! 📚
