# 家庭书籍管理系统 - 前端 Dockerfile
# 构建多阶段构建

# 构建阶段
FROM node:18-alpine as build

WORKDIR /app

# 复制package.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置API地址（构建时注入）
# 注意：使用相对路径，通过Nginx代理转发到后端
ENV VITE_API_BASE_URL=/api

# 构建
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]