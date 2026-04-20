"""
书籍模型
"""
from sqlalchemy import Column, BigInteger, String, Integer, Text, DateTime, SmallInteger
from sqlalchemy.sql import func

from ..database import Base


class Book(Base):
    """书籍表"""
    __tablename__ = "books"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="主键")

    # 基础信息
    title = Column(String(500), nullable=False, comment="书名（必填）")
    isbn = Column(String(20), nullable=True, comment="ISBN")
    location = Column(String(100), nullable=True, comment="位置")
    category = Column(String(50), nullable=True, comment="类型")
    author = Column(String(200), nullable=True, comment="作者")
    translator = Column(String(200), nullable=True, comment="译者")
    publisher = Column(String(200), nullable=True, comment="出版社")
    series = Column(String(200), nullable=True, comment="丛书")
    publish_year = Column(String(20), nullable=True, comment="出版年")

    # 详细信息
    pages = Column(Integer, nullable=True, comment="页数")
    price = Column(String(50), nullable=True, comment="定价")
    binding = Column(String(50), nullable=True, comment="装帧")
    remark = Column(Text, nullable=True, comment="备注")
    original_title = Column(String(500), nullable=True, comment="原作名")
    subtitle = Column(String(500), nullable=True, comment="副标题")
    unified_code = Column(String(50), nullable=True, comment="统一书号")
    language = Column(String(50), nullable=True, comment="语言类型")

    # 系统字段
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间")
    is_deleted = Column(SmallInteger, default=0, comment="是否删除（0-否 1-是）")
