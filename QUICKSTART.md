# 快速开始指南

## 步骤 1: 安装依赖

### Windows 用户
双击运行 `setup.bat` 文件：
```
setup.bat
```

### macOS / Linux 用户
运行以下命令：
```bash
chmod +x setup.sh
./setup.sh
```

### 手动安装
如果上述脚本失败，请手动运行：

```bash
# 安装前端依赖
cd frontend
npm install
cd ..

# 安装后端依赖
cd backend
npm install
cd ..
```

## 步骤 2: 启动开发服务器

需要打开 **两个** 不同的终端窗口：

### 终端 1: 启动前端开发服务器
```bash
cd frontend
npm run dev
```
输出示例：
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

### 终端 2: 启动后端开发服务器
```bash
cd backend
npm run dev
```
输出示例：
```
Server is running on http://localhost:5000
Connected to SQLite database
Books table ready
```

## 步骤 3: 打开应用

在浏览器中访问：
```
http://localhost:3000
```

## 常见问题解决

### 问题 1: 端口已被占用

**前端（端口 3000）:**
```bash
cd frontend
npm run dev -- --port 3001
```

**后端（端口 5000）:**
在 `backend/.env` 中添加：
```
PORT=5001
```

### 问题 2: npm install 失败

清除缓存并重试：
```bash
npm cache clean --force
npm install
```

### 问题 3: ts-node: command not found

在项目目录中运行：
```bash
npm install -g ts-node TypeScript
```

或使用本地安装：
```bash
npx ts-node --version
```

### 问题 4: EPUB 上传失败

- 确保后端服务正在运行
- 检查文件是否为有效的 EPUB 格式
- 查看浏览器开发者工具（F12）中的错误信息

## 项目结构说明

```
E-Book-Web/
├── frontend/                 # React 应用
│   ├── src/
│   │   ├── App.tsx          # 主应用组件
│   │   ├── main.tsx         # 入口文件
│   │   ├── components/      # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   └── utils/           # 工具函数
│   ├── index.html           # HTML 模板
│   ├── package.json
│   ├── vite.config.ts       # Vite 配置
│   └── tsconfig.json        # TypeScript 配置
│
├── backend/                  # Node.js 服务
│   ├── src/
│   │   ├── server.ts        # 服务器入口
│   │   ├── routes/          # API 路由
│   │   ├── controllers/      # 业务逻辑
│   │   ├── config/          # 配置文件
│   │   └── utils/           # 工具函数
│   ├── uploads/             # 上传文件目录
│   ├── package.json
│   ├── tsconfig.json        # TypeScript 配置
│   └── .env.example         # 环境变量例子
│
├── README.md                # 完整文档
├── setup.sh / setup.bat     # 一键安装脚本
├── docker-compose.yml       # Docker 配置
└── .gitignore              # Git 忽略配置
```

## 功能使用说明

### 1. 上传 EPUB 书籍
- 在主页上找到上传区域
- 拖拽 EPUB 文件到指定区域，或点击选择文件
- 等待上传完成

### 2. 阅读书籍
- 在书籍列表中点击"阅读"按钮
- 使用工具栏控制：
  - **← 上一页** / **下一页 →** : 翻页
  - **📑 目录** : 查看章节
  - **字体大小** : 调整文字大小

### 3. 键盘快捷键
- **→** 或 **N** : 下一页
- **←** 或 **P** : 上一页
- **Space** : 下一页
- **J** : 下一页

## 开发提示

### 调试模式

**前端调试:**
- 打开浏览器开发者工具: F12
- 使用 React DevTools 浏览器扩展

**后端调试:**
```bash
cd backend
NODE_DEBUG=* npm run dev
```

### 修改 API 端口

如果要改变后端 API 端口，需要：

1. 在 `backend/.env` 中修改 PORT
2. 在 `frontend/vite.config.ts` 中更新代理地址：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5001',  // 改成你的端口
    changeOrigin: true,
  },
}
```

## 打包生产环境

### 构建前端
```bash
cd frontend
npm run build
# 输出在 dist/ 目录
```

### 构建后端
```bash
cd backend
npm run build
npm start
# 将 dist/ 目录放到服务器上
```

## 下一步

- ✅ 学习 React 和 TypeScript
- ✅ 了解 EPUB 格式
- ✅ 探索 EPUB.js 库的高级功能
- ✅ 添加数据库功能（登录、收藏等）

## 获取帮助

- 查看 [README.md](README.md) 获取完整文档
- 检查浏览器控制台错误信息
- 查看服务器日志输出

祝你使用愉快！📚
