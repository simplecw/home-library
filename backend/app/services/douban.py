"""
豆瓣API服务
"""
import httpx
from typing import Optional

from ..config import settings


class DoubanService:
    """豆瓣API服务"""

    @staticmethod
    async def get_book_by_isbn(isbn: str) -> Optional[dict]:
        """通过ISBN从豆瓣获取书籍信息"""
        url = f"{settings.DOUBAN_API_URL}{isbn}"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)

                if response.status_code == 200:
                    data = response.json()

                    book_info = {
                        "title": data.get("title"),
                        "author": ", ".join(data.get("author", [])) if data.get("author") else None,
                        "publisher": data.get("publisher"),
                        "publish_year": data.get("pubdate", "")[:4] if data.get("pubdate") else None,
                        "pages": int(data.get("pages")) if data.get("pages") and str(data.get("pages")).isdigit() else None,
                        "price": data.get("price"),
                        "binding": data.get("binding"),
                        "isbn": data.get("isbn13") or data.get("isbn10"),
                        "original_title": data.get("original_title"),
                        "translator": ", ".join(data.get("translator", [])) if data.get("translator") else None,
                        "image": data.get("image"),
                    }
                    return book_info
                return None

        except Exception as e:
            print(f"豆瓣API查询失败: {e}")
            return None
