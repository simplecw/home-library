"""
书籍服务层
"""
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session

from ..models.book import Book


class BookService:
    """书籍服务"""

    @staticmethod
    def get_list(
        db: Session,
        title: Optional[str] = None,
        location: Optional[str] = None,
        category: Optional[str] = None,
        author: Optional[str] = None,
        translator: Optional[str] = None,
        publisher: Optional[str] = None,
        series: Optional[str] = None,
        publish_year: Optional[str] = None,
        page: int = 1,
        page_size: int = 100
    ) -> Tuple[List[Book], int]:
        """获取书籍列表（支持多条件查询）"""
        query = db.query(Book).filter(Book.is_deleted == 0)

        if title:
            query = query.filter(Book.title.like(f"%{title}%"))
        if location:
            query = query.filter(Book.location.like(f"%{location}%"))
        if author:
            query = query.filter(Book.author.like(f"%{author}%"))
        if translator:
            query = query.filter(Book.translator.like(f"%{translator}%"))
        if publisher:
            query = query.filter(Book.publisher.like(f"%{publisher}%"))
        if series:
            query = query.filter(Book.series.like(f"%{series}%"))
        if publish_year:
            query = query.filter(Book.publish_year.like(f"%{publish_year}%"))
        if category:
            query = query.filter(Book.category == category)

        total = query.count()
        offset = (page - 1) * page_size
        books = query.order_by(Book.id.desc()).offset(offset).limit(page_size).all()
        return books, total

    @staticmethod
    def get_by_id(db: Session, book_id: int) -> Optional[Book]:
        """根据ID获取书籍"""
        return db.query(Book).filter(Book.id == book_id, Book.is_deleted == 0).first()

    @staticmethod
    def create(db: Session, book_data: dict) -> Book:
        """创建书籍"""
        book = Book(**book_data)
        db.add(book)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def update(db: Session, book_id: int, book_data: dict) -> Optional[Book]:
        """更新书籍"""
        book = db.query(Book).filter(Book.id == book_id, Book.is_deleted == 0).first()
        if not book:
            return None
        for key, value in book_data.items():
            if value is not None:
                setattr(book, key, value)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def delete(db: Session, book_id: int) -> bool:
        """删除书籍（软删除）"""
        book = db.query(Book).filter(Book.id == book_id, Book.is_deleted == 0).first()
        if not book:
            return False
        book.is_deleted = 1
        db.commit()
        return True

    @staticmethod
    def get_categories(db: Session) -> List[str]:
        """获取所有类型列表"""
        result = db.query(Book.category).filter(
            Book.is_deleted == 0, Book.category.isnot(None), Book.category != ""
        ).distinct().all()
        return [r[0] for r in result]
