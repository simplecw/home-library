# 家庭书籍管理系统 - 后端

## 技术栈

- FastAPI
- SQLAlchemy
- MySQL
- Pydantic

## 配置

数据库配置在 `app/config.py` 中：

```python
DB_HOST: str = "192.168.1.108"
DB_PORT: int = 3306
DB_USER: str = "chenwei"
DB_PASSWORD: str = "761211"
DB_NAME: str = "family_books"
```

## 安装

```bash
pip install -r requirements.txt
```

## 数据库初始化

### 方式一：Python脚本

```bash
python init_db.py
```

### 方式二：SQL脚本

```bash
mysql -h 192.168.1.108 -u chenwei -p < sql/init.sql
```

## 启动服务

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 5201 --reload
```

或直接运行：

```bash
python app/main.py
```

## API接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/books | 查询书籍列表 |
| GET | /api/books/{id} | 获取书籍详情 |
| POST | /api/books | 新增书籍 |
| PUT | /api/books/{id} | 编辑书籍 |
| DELETE | /api/books/{id} | 删除书籍（软删除） |
| GET | /api/books/categories | 获取类型列表 |
| GET | /api/books/douban/query | 豆瓣ISBN查询 |

## 端口

- 后端服务端口：**5201**
- API Base URL：`http://localhost:5201/api`