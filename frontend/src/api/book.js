/**
 * 书籍API服务
 */
import axios from 'axios';

// API基础地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 如果响应已经是 {code, message, data} 格式，直接返回
    if (response.data && typeof response.data === 'object' && 'code' in response.data) {
      return response.data;
    }
    // 否则返回包装后的格式
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 获取书籍列表
 * @param {Object} params - 查询参数
 */
export const getBooks = (params) => {
  return api.get('/books', { params });
};

/**
 * 获取书籍详情
 * @param {number} id - 书籍ID
 */
export const getBookById = (id) => {
  return api.get(`/books/${id}`);
};

/**
 * 新增书籍
 * @param {Object} data - 书籍数据
 */
export const createBook = (data) => {
  return api.post('/books', data);
};

/**
 * 编辑书籍
 * @param {number} id - 书籍ID
 * @param {Object} data - 书籍数据
 */
export const updateBook = (id, data) => {
  return api.put(`/books/${id}`, data);
};

/**
 * 删除书籍
 * @param {number} id - 书籍ID
 */
export const deleteBook = (id) => {
  return api.delete(`/books/${id}`);
};

/**
 * 获取类型列表
 */
export const getCategories = () => {
  return api.get('/books/categories');
};

/**
 * 豆瓣ISBN查询
 * @param {string} isbn - ISBN号
 */
export const queryDouban = (isbn) => {
  return api.get('/books/douban/query', { params: { isbn } });
};

export default api;