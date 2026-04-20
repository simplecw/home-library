"""
配置文件
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库配置（支持环境变量覆盖）
    DB_HOST: str = os.getenv("DB_HOST", "192.168.1.108")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "chenwei")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "761211")
    DB_NAME: str = os.getenv("DB_NAME", "family_books")

    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 5201

    # 豆瓣API配置
    DOUBAN_API_URL: str = "https://douban-api.uieee.com/v2/book/isbn/"

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    class Config:
        env_file = ".env"


settings = Settings()