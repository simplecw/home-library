"""
数据库初始化脚本
创建数据库和表结构
"""
from sqlalchemy import text
from pymysql import connect

from app.config import settings
from app.database import engine, Base
from app.models.book import Book


def init_database():
    """初始化数据库"""
    print("正在连接MySQL服务器...")

    # 连接MySQL服务器（不指定数据库）
    conn = connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD
    )

    try:
        with conn.cursor() as cursor:
            # 创建数据库（如果不存在）
            print(f"创建数据库 {settings.DB_NAME}...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            conn.commit()

        print("数据库创建成功！")
    finally:
        conn.close()

    # 创建表
    print("正在创建表结构...")
    Base.metadata.create_all(bind=engine)
    print("表结构创建成功！")


if __name__ == "__main__":
    init_database()
    print("数据库初始化完成！")
