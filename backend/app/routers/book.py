"""
书籍路由
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.book import ResponseModel, BookListItem, BookDetail, BookCreate, BookUpdate
from ..services.book import BookService
from ..services.douban import DoubanService

router = APIRouter(prefix="/books", tags=["书籍管理"])


@router.get("", response_model=ResponseModel)
async def get_books(
    title: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    author: Optional[str] = Query(None),
    translator: Optional[str] = Query(None),
    publisher: Optional[str] = Query(None),
    series: Optional[str] = Query(None),
    publish_year: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """查询书籍列表"""
    books, total = BookService.get_list(
        db=db, title=title, location=location, category=category,
        author=author, translator=translator, publisher=publisher,
        series=series, publish_year=publish_year, page=page, page_size=page_size
    )
    return ResponseModel(data={
        "list": [BookListItem.model_validate(b).model_dump() for b in books],
        "total": total, "page": page, "page_size": page_size
    })


@router.get("/categories", response_model=ResponseModel)
async def get_categories(db: Session = Depends(get_db)):
    """获取书籍类型列表"""
    return ResponseModel(data=BookService.get_categories(db))


@router.get("/{book_id}", response_model=ResponseModel)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    """获取书籍详情"""
    book = BookService.get_by_id(db, book_id)
    if not book:
        return ResponseModel(code=1002, message="书籍不存在")
    return ResponseModel(data=BookDetail.model_validate(book).model_dump())


@router.post("", response_model=ResponseModel)
async def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    """新增书籍"""
    book = BookService.create(db, book_data.model_dump(exclude_none=True))
    return ResponseModel(data={"id": book.id})


@router.put("/{book_id}", response_model=ResponseModel)
async def update_book(book_id: int, book_data: BookUpdate, db: Session = Depends(get_db)):
    """编辑书籍"""
    book = BookService.update(db, book_id, book_data.model_dump(exclude_none=True))
    if not book:
        return ResponseModel(code=1002, message="书籍不存在")
    return ResponseModel(data={"id": book.id})


@router.delete("/{book_id}", response_model=ResponseModel)
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    """删除书籍（软删除）"""
    if not BookService.delete(db, book_id):
        return ResponseModel(code=1002, message="书籍不存在")
    return ResponseModel(message="删除成功")


@router.get("/douban/query", response_model=ResponseModel)
async def query_douban(isbn: str = Query(...)):
    """通过ISBN从豆瓣获取书籍信息"""
    book_info = await DoubanService.get_book_by_isbn(isbn)
    if not book_info:
        return ResponseModel(code=1004, message="豆瓣API查询失败")
    return ResponseModel(data=book_info)
