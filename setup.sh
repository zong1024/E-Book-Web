#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}欢迎使用 EPUB 电子书阅读器${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null
then
    echo -e "${RED}❌ 请先安装 Node.js (v16 或更高版本)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 已安装: $(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null
then
    echo -e "${RED}❌ 请先安装 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm 已安装: $(npm -v)${NC}"

# 安装前端依赖
echo -e "${YELLOW}\n📦 正在安装前端依赖...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端依赖安装失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 前端依赖安装完成${NC}"
cd ..

# 安装后端依赖
echo -e "${YELLOW}\n📦 正在安装后端依赖...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端依赖安装失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 后端依赖安装完成${NC}"
cd ..

echo -e "${BLUE}\n========================================${NC}"
echo -e "${GREEN}✓ 安装完成！${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}接下来请在两个不同的终端中运行:${NC}"
echo -e "${BLUE}终端 1 - 前端开发服务器:${NC}"
echo -e "  ${GREEN}cd frontend && npm run dev${NC}"
echo -e "\n${BLUE}终端 2 - 后端开发服务器:${NC}"
echo -e "  ${GREEN}cd backend && npm run dev${NC}"

echo -e "\n${BLUE}然后在浏览器中打开: ${GREEN}http://localhost:3000${NC}"
echo -e ""
