/**
 * 家庭书籍管理系统 - 主应用
 */
import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Typography, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { SearchForm } from './components/SearchForm';
import { BookTable } from './components/BookTable';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { getBooks, getCategories, getBookById } from './api/book';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  // 状态
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 100 });

  // 弹窗状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 查询参数
  const [searchParams, setSearchParams] = useState({});

  // 加载类型列表
  useEffect(() => {
    loadCategories();
  }, []);

  // 加载书籍列表
  useEffect(() => {
    loadBooks();
  }, [pagination, searchParams]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      if (res.code === 0) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error('加载类型列表失败:', error);
    }
  };

  const loadBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...searchParams,
      };
      const res = await getBooks(params);
      if (res.code === 0) {
        setBooks(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (error) {
      console.error('加载书籍列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination({ ...pagination, page: 1 });
  };

  const handleReset = () => {
    setSearchParams({});
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, pageSize });
  };

  const handleAdd = () => {
    setCurrentBook(null);
    setIsEditing(false);
    setFormModalVisible(true);
  };

  const handleViewDetail = async (record) => {
    try {
      const res = await getBookById(record.id);
      if (res.code === 0) {
        setCurrentBook(res.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      message.error('获取书籍详情失败');
    }
  };

  const handleEdit = async (record) => {
    try {
      const res = await getBookById(record.id);
      if (res.code === 0) {
        setCurrentBook(res.data);
        setIsEditing(true);
        setFormModalVisible(true);
      }
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      message.error('获取书籍详情失败');
    }
  };

  const handleDelete = async (record) => {
    try {
      const res = await updateBook(record.id, {});
      if (res.code === 0) {
        message.success('删除成功');
        loadBooks();
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (error) {
      console.error('删除书籍失败:', error);
      message.error('删除失败');
    }
  };

  const handleSaveSuccess = () => {
    setFormModalVisible(false);
    loadBooks();
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="min-h-screen">
        <Header className="flex items-center">
          <Title level={4} className="text-white m-0">📚 家庭书籍管理系统</Title>
        </Header>

        <Content className="p-6 bg-gray-50">
          <div className="bg-white p-6 rounded shadow">
            <SearchForm
              categories={categories}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={handleAdd}
            />

            <BookTable
              dataSource={books}
              total={total}
              loading={loading}
              pagination={{
                current: pagination.page,
                pageSize: pagination.pageSize,
                total,
                onChange: handlePageChange,
              }}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </Content>

        <Footer className="text-center bg-white">
          家庭书籍管理系统 ©{new Date().getFullYear()}
        </Footer>
      </Layout>

      {/* 详情弹窗 */}
      <BookDetailModal
        visible={detailModalVisible}
        book={currentBook}
        onClose={() => setDetailModalVisible(false)}
      />

      {/* 新增/编辑弹窗 */}
      <BookFormModal
        visible={formModalVisible}
        book={currentBook}
        isEditing={isEditing}
        categories={categories}
        onClose={() => setFormModalVisible(false)}
        onSuccess={handleSaveSuccess}
      />
    </ConfigProvider>
  );
}

export default App;