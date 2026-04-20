"""
书籍 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ResponseModel(BaseModel):
    """统一响应模型"""
    code: int = Field(default=0, description="状态码")
    message: str = Field(default="success", description="消息")
    data: Optional[dict | list | None] = Field(default=None, description="数据")


class BookListItem(BaseModel):
    """书籍列表项（显示部分字段）"""
    id: int
    title: str
    location: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    translator: Optional[str] = None
    publisher: Optional[str] = None
    series: Optional[str] = None
    publish_year: Optional[str] = None

    class Config:
        from_attributes = True


class BookDetail(BaseModel):
    """书籍详情"""
    id: int
    title: str
    isbn: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    translator: Optional[str] = None
    publisher: Optional[str] = None
    series: Optional[str] = None
    publish_year: Optional[str] = None
    pages: Optional[int] = None
    price: Optional[str] = None
    binding: Optional[str] = None
    remark: Optional[str] = None
    original_title: Optional[str] = None
    subtitle: Optional[str] = None
    unified_code: Optional[str] = None
    language: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BookCreate(BaseModel):
    """新增书籍请求"""
    title: str = Field(..., description="书名（必填）")
    isbn: Optional[str] = Field(None, description="ISBN")
    location: Optional[str] = Field(None, description="位置")
    category: Optional[str] = Field(None, description="类型")
    author: Optional[str] = Field(None, description="作者")
    translator: Optional[str] = Field(None, description="译者")
    publisher: Optional[str] = Field(None, description="出版社")
    series: Optional[str] = Field(None, description="丛书")
    publish_year: Optional[str] = Field(None, description="出版年")
    pages: Optional[int] = Field(None, description="页数")
    price: Optional[str] = Field(None, description="定价")
    binding: Optional[str] = Field(None, description="装帧")
    remark: Optional[str] = Field(None, description="备注")
    original_title: Optional[str] = Field(None, description="原作名")
    subtitle: Optional[str] = Field(None, description="副标题")
    unified_code: Optional[str] = Field(None, description="统一书号")
    language: Optional[str] = Field(None, description="语言类型")


class BookUpdate(BaseModel):
    """编辑书籍请求"""
    title: Optional[str] = Field(None, description="书名")
    isbn: Optional[str] = Field(None, description="ISBN")
    location: Optional[str] = Field(None, description="位置")
    category: Optional[str] = Field(None, description="类型")
    author: Optional[str] = Field(None, description="作者")
    translator: Optional[str] = Field(None, description="译者")
    publisher: Optional[str] = Field(None, description="出版社")
    series: Optional[str] = Field(None, description="丛书")
    publish_year: Optional[str] = Field(None, description="出版年")
    pages: Optional[int] = Field(None, description="页数")
    price: Optional[str] = Field(None, description="定价")
    binding: Optional[str] = Field(None, description="装帧")
    remark: Optional[str] = Field(None, description="备注")
    original_title: Optional[str] = Field(None, description="原作名")
    subtitle: Optional[str] = Field(None, description="副标题")
    unified_code: Optional[str] = Field(None, description="统一书号")
    language: Optional[str] = Field(None, description="语言类型")
