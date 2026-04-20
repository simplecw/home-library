# System Design Document - 家庭书籍管理系统

## 1. 项目概述

- **项目名称**：家庭书籍管理系统（Family Books）
- **技术栈**：FastAPI + SQLAlchemy + PostgreSQL（后端），React + Vite + TailwindCSS（前端）
- **部署方式**：Docker Compose

---

## 2. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                     前端 (React)                         │
│              http://localhost:5101                       │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
┌─────────────────────▼───────────────────────────────────┐
│                     后端 (FastAPI)                       │
│              http://localhost:5201/api                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  书籍管理    │  │  分类管理    │  │  豆瓣API集成     │  │
│  │  CRUD       │  │  分类列表    │  │  ISBN查询        │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   MySQL (外部)                          │
│         192.168.1.108:3306                              │
│  ┌─────────────────────────────────────────────────┐     │
│  │                   books 表                       │     │
│  └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 数据库设计

### 3.1 数据库信息

- **数据库类型**：MySQL
- **数据库名**：family_books
- **字符集**：UTF-8mb4
- **连接信息**：
  - 服务器：192.168.1.108
  - 端口：3306
  - 用户名：chenwei
  - 密码：761211

### 3.2 表结构：books（书籍表）

```sql
-- ========================================
-- 家庭书籍管理系统 - 书籍表 (MySQL)
-- ========================================

CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 基础信息
    title VARCHAR(500) NOT NULL COMMENT '书名（必填）',
    isbn VARCHAR(20) COMMENT 'ISBN',
    location VARCHAR(100) COMMENT '位置',
    category VARCHAR(50) COMMENT '类型',
    author VARCHAR(200) COMMENT '作者',
    translator VARCHAR(200) COMMENT '译者',
    publisher VARCHAR(200) COMMENT '出版社',
    series VARCHAR(200) COMMENT '丛书',
    publish_year VARCHAR(20) COMMENT '出版年（支持YYYY/MM/DD格式）',
    
    -- 详细信息
    pages INT COMMENT '页数',
    price VARCHAR(50) COMMENT '定价',
    binding VARCHAR(50) COMMENT '装帧',
    remark TEXT COMMENT '备注',
    original_title VARCHAR(500) COMMENT '原作名',
    subtitle VARCHAR(500) COMMENT '副标题',
    unified_code VARCHAR(50) COMMENT '统一书号',
    language VARCHAR(50) COMMENT '语言类型',
    
    -- 系统字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除（0-否 1-是）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='书籍表';

-- ========================================
-- 索引
-- ========================================

-- 常用查询字段索引
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_is_deleted ON books(is_deleted);

-- 组合索引（常用查询组合）
CREATE INDEX idx_books_category_author ON books(category, author);
```

### 3.3 设计规范

1. 所有表必须包含：`created_at`、`updated_at`、`is_deleted`
2. 使用逻辑删除，不允许物理删除
3. 主键使用 `BIGSERIAL`（PostgreSQL自增）
4. 文本字段长度根据实际需求设置
5. 所有字段必须写 COMMENT

---

## 4. API 设计

### 4.1 基本信息

- **服务名称**：家庭书籍管理 API
- **Base URL**：`http://localhost:5201/api`
- **认证方式**：无（家庭内部使用）

### 4.2 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 4.3 错误码规范

| 错误码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1000 | 通用错误 |
| 1001 | 参数错误 |
| 1002 | 未找到资源 |
| 1003 | 权限不足 |
| 1004 | 豆瓣API查询失败 |

---

### 4.4 API 列表

#### 4.4.1 查询书籍列表

- **方法**：GET
- **路径**：`/books`
- **描述**：多条件分页查询书籍

**Query 参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 否 | 书名（模糊查询） |
| location | string | 否 | 位置（模糊查询） |
| category | string | 否 | 类型（精确查询） |
| author | string | 否 | 作者（模糊查询） |
| translator | string | 否 | 译者（模糊查询） |
| publisher | string | 否 | 出版社（模糊查询） |
| series | string | 否 | 丛书（模糊查询） |
| publish_year | string | 否 | 出版年（模糊查询） |
| page | int | 否 | 页码（默认1） |
| page_size | int | 否 | 每页数量（默认100，最大100） |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "书名",
        "location": "位置",
        "category": "类型",
        "author": "作者",
        "translator": "译者",
        "publisher": "出版社",
        "series": "丛书",
        "publish_year": "2020"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 100
  }
}
```

---

#### 4.4.2 获取书籍详情

- **方法**：GET
- **路径**：`/books/{id}`
- **描述**：获取单本书籍的完整信息

**路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 书籍ID |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "书名",
    "isbn": "978-7-5322-1234-5",
    "location": "位置",
    "category": "类型",
    "author": "作者",
    "translator": "译者",
    "publisher": "出版社",
    "series": "丛书",
    "publish_year": "2020",
    "pages": 300,
    "price": "59.00",
    "binding": "精装",
    "remark": "备注",
    "original_title": "原作名",
    "subtitle": "副标题",
    "unified_code": "统一书号",
    "language": "语言类型",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### 4.4.3 新增书籍

- **方法**：POST
- **路径**：`/books`
- **描述**：创建新书籍

**Body**：

```json
{
  "title": "书名（必填）",
  "isbn": "978-7-5322-1234-5",
  "location": "位置",
  "category": "类型",
  "author": "作者",
  "translator": "译者",
  "publisher": "出版社",
  "series": "丛书",
  "publish_year": "2020",
  "pages": 300,
  "price": "59.00",
  "binding": "精装",
  "remark": "备注",
  "original_title": "原作名",
  "subtitle": "副标题",
  "unified_code": "统一书号",
  "language": "语言类型"
}
```

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1
  }
}
```

---

#### 4.4.4 编辑书籍

- **方法**：PUT
- **路径**：`/books/{id}`
- **描述**：更新书籍信息

**路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 书籍ID |

**Body**：同新增

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1
  }
}
```

---

#### 4.4.5 删除书籍

- **方法**：DELETE
- **路径**：`/books/{id}`
- **描述**：软删除书籍

**路径参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | int | 是 | 书籍ID |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

#### 4.4.6 获取类型列表

- **方法**：GET
- **路径**：`/books/categories`
- **描述**：获取所有书籍类型（用于下拉选择）

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": ["文学", "科技", "历史", "儿童"]
}
```

---

#### 4.4.7 豆瓣ISBN查询

- **方法**：GET
- **路径**：`/books/douban`
- **描述**：通过ISBN从豆瓣获取书籍信息

**Query 参数**：

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| isbn | string | 是 | ISBN号 |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "title": "书名",
    "author": "作者",
    "publisher": "出版社",
    "publish_year": "2020",
    "pages": 300,
    "price": "59.00",
    "binding": "精装",
    "isbn": "978-7-5322-1234-5",
    "original_title": "原作名",
    "translator": "译者",
    "image": "封面图片URL"
  }
}
```

---

## 5. 项目结构

### 5.1 后端结构（backend/）

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 入口
│   ├── config.py            # 配置
│   ├── database.py          # 数据库连接
│   ├── models/
│   │   ├── __init__.py
│   │   └── book.py          # SQLAlchemy 模型
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── book.py          # Pydantic 模型
│   ├── routers/
│   │   ├── __init__.py
│   │   └── book.py          # 书籍路由
│   └── services/
│       ├── __init__.py
│       ├── book.py          # 书籍业务逻辑
│       └── douban.py        # 豆瓣API服务
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

### 5.2 前端结构（frontend/）

```
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── book.js           # API 调用
│   ├── components/
│   │   ├── BookList.jsx     # 书籍列表
│   │   ├── SearchForm.jsx   # 查询表单
│   │   ├── BookModal.jsx    # 详情弹窗
│   │   ├── BookFormModal.jsx # 新增/编辑弹窗
│   │   └── Pagination.jsx   # 分页组件
│   └── styles/
│       └── index.css        # 全局样式
├── package.json
├── vite.config.js
└── Dockerfile
```

---

## 6. 关键设计决策

1. **软删除**：所有删除操作均为软删除（`is_deleted=1`），数据不物理删除
2. **查询优化**：
   - 文本字段使用 LIKE 模糊查询
   - 类型字段使用 = 精确查询
   - 建立常用字段索引
3. **分页**：默认每页100条，最大100条
4. **豆瓣API**：使用第三方豆瓣API接口，注意错误处理和限流
5. **统一响应**：所有API返回统一格式 `{code, message, data}`

---

## 7. 外部依赖

### 7.1 豆瓣API

由于豆瓣官方API有限制，使用第三方封装接口：

- **接口**：`https://api.douban.com/v2/book/isbn/{isbn}`
- **备选**：`https://douban-api.uieee.com/v2/book/isbn/{isbn}`
- **注意**：需要处理CORS和限流问题