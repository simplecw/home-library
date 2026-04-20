# 家庭书籍管理系统

基于 FastAPI + React 的家庭书籍管理Web应用。

## 项目结构

```
.
├── backend/                 # 后端
│   ├── app/
│   │   ├── main.py         # FastAPI入口
│   │   ├── config.py       # 配置
│   │   ├── database.py     # 数据库连接
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # Pydantic模型
│   │   ├── routers/        # API路由
│   │   └── services/       # 业务逻辑
│   ├── sql/
│   │   ├── init.sql        # 数据库初始化SQL
│   │   └── import_books.py # CSV导入工具
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # 前端
│   ├── src/
│   │   ├── api/           # API调用
│   │   ├── components/    # 组件
│   │   └── App.jsx        # 主应用
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker部署配置
└── README.md
```

## 功能特性

- ✅ 多条件查询（书名、位置、类型、作者等）
- ✅ 类型下拉选择（动态从数据库获取）
- ✅ 分页显示（默认100条/页）
- ✅ 书籍详情弹窗 + 豆瓣查询
- ✅ 新增/编辑书籍（弹窗形式）
- ✅ 软删除
- ✅ 豆瓣ISBN自动填充
- ✅ RESTful API
- ✅ Docker Compose部署

## 快速部署

### 1. 初始化数据库

```bash
cd backend
pip install -r requirements.txt
python init_db.py
```

### 2. 导入书籍数据

```bash
cd backend/sql
python import_books.py
mysql -h 192.168.1.108 -u chenwei -p < import_books.sql
```

### 3. 启动服务

```bash
docker-compose up -d --build
```

### 4. 访问应用

- **前端**：http://localhost:5101
- **API**：http://localhost:5201/api

## API接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/books | 查询书籍列表 |
| GET | /api/books/{id} | 获取书籍详情 |
| POST | /api/books | 新增书籍 |
| PUT | /api/books/{id} | 编辑书籍 |
| DELETE | /api/books/{id} | 删除书籍（软删除） |
| GET | /api/books/categories | 获取类型列表 |
| GET | /api/books/douban/query?isbn=xxx | 豆瓣ISBN查询 |
