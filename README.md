# 📚 EPUB 电子书阅读网站

一个现代化的网络电子书阅读平台，支持EPUB格式的电子书上传、存储和在线阅读。

## 主要功能

- ✅ **EPUB 上传与管理** - 支持拖拽上传，自动提取书籍元数据
- ✅ **在线阅读** - 使用 EPUB.js 渲染 EPUB 文件
- ✅ **目录导航** - 快速跳转到书籍的各个章节
- ✅ **阅读进度** - 显示阅读进度条和当前页码
- ✅ **字体调整** - 支持自定义字体大小
- ✅ **键盘导航** - 支持方向键翻页
- ✅ **响应式设计** - 适配各种屏幕尺寸

## 技术栈

### 前端
- **React** 18.2 - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 快速开发构建工具
- **EPUB.js** - EPUB 文件渲染
- **Axios** - HTTP 客户端
- **React Router** - 路由管理

### 后端
- **Node.js + Express** - Web 服务器
- **TypeScript** - 类型安全
- **SQLite** - 轻量级数据库
- **Multer** - 文件上传处理
- **EPUB** - EPUB 文件解析

## 项目结构

```
E-Book-Web/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   │   ├── FileUpload.tsx    # 文件上传组件
│   │   │   └── EpubReader.tsx    # EPUB 阅读器组件
│   │   ├── pages/           # 页面
│   │   │   ├── HomePage.tsx      # 主页
│   │   │   └── ReaderPage.tsx    # 阅读页面
│   │   ├── utils/           # 工具函数
│   │   │   └── api.ts            # API 调用封装
│   │   ├── App.tsx          # 应用主组件
│   │   ├── main.tsx         # 入口文件
│   │   └── index.css        # 全局样式
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
├── backend/                  # Node.js 后端服务
│   ├── src/
│   │   ├── controllers/      # 控制器
│   │   │   └── bookController.ts
│   │   ├── routes/          # 路由
│   │   │   └── books.ts
│   │   ├── config/          # 配置
│   │   │   └── database.ts
│   │   ├── utils/           # 工具函数
│   │   │   └── epubParser.ts
│   │   └── server.ts        # 服务器入口
│   ├── uploads/             # 上传的 EPUB 文件存储位置
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml       # Docker Compose 配置
└── README.md                # 本文件
```

## 快速开始

### 前置要求
- Node.js 16+
- npm 或 yarn

### 安装与运行

#### 1. 克隆仓库
```bash
git clone <repository-url>
cd E-Book-Web
```

#### 2. 安装依赖

**前端：**
```bash
cd frontend
npm install
```

**后端：**
```bash
cd ../backend
npm install
```

#### 3. 启动开发服务器

**前端（终端 1）：**
```bash
cd frontend
npm run dev
```
前端将在 `http://localhost:3000` 运行

**后端（终端 2）：**
```bash
cd backend
npm run dev
```
后端将在 `http://localhost:5000` 运行

#### 4. 打开浏览器
访问 `http://localhost:3000`

## API 文档

### 书籍相关 API

#### 获取书籍列表
```
GET /api/books
Response: Book[]
```

#### 上传书籍
```
POST /api/books/upload
Content-Type: multipart/form-data
Body: { file: epub file }
Response: { id, title, author, cover, uploadedAt }
```

#### 获取书籍详情
```
GET /api/books/:id
Response: Book
```

#### 获取书籍文件
```
GET /api/books/:id/file
Response: epub file binary
```

#### 删除书籍
```
DELETE /api/books/:id
Response: { message: "Book deleted successfully" }
```

## 使用说明

### 上传书籍
1. 在主页右侧点击上传区域
2. 选择或拖拽 EPUB 文件
3. 等待上传完成

### 阅读书籍
1. 在书籍卡片上点击"阅读"按钮
2. 使用工具栏导航：
   - **← 上一页** / **下一页 →** - 翻页
   - **目录** - 查看章节目录
   - **字体大小** - 调整阅读文字大小

### 键盘快捷键
- **→ / J / N / Space** - 下一页
- **← / H / P** - 上一页

## 生产部署

### 使用 Docker

```bash
docker-compose up -d
```

### 手动部署

**前端构建：**
```bash
cd frontend
npm run build
# dist 文件夹包含编译后的静态文件
```

**后端构建：**
```bash
cd backend
npm run build
npm start
```

## 环境变量配置

在 `backend` 目录创建 `.env` 文件：

```env
PORT=5000
NODE_ENV=production
```

## 常见问题

### 1. 上传 EPUB 文件失败
- 检查文件是否为有效的 EPUB 格式
- 确保文件大小不超过限制
- 检查后端服务是否正常运行

### 2. 书籍无法正常渲染
- 某些 EPUB 文件可能包含不标准的格式
- 尝试转换 EPUB 文件格式
- 检查浏览器控制台是否有错误信息

### 3. 读取速度较慢
- 清理浏览器缓存
- 检查网络连接
- 对于大型 EPUB 文件，第一次加载会较慢

## 后续改进方向

- [ ] 用户认证和权限管理
- [ ] 书籍搜索和收藏功能
- [ ] 阅读历史记录和书签
- [ ] 夜间模式和主题切换
- [ ] 离线阅读功能
- [ ] 导出为其他格式
- [ ] 社交分享功能
- [ ] 推荐算法
- [ ] S3 对象存储支持

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献指南

欢迎提交 PR 和 Issue！

## 联系方式

如有问题或建议，请提交 GitHub Issue。

---

**注意**：此项目仅供学习和个人使用。请遵守相应的EPUB版权法规。
