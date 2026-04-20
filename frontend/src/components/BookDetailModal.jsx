/**
 * 书籍详情弹窗组件
 */
import React, { useState } from 'react';
import { Modal, Descriptions, Divider, Input, Button, Card, message, Space, Spin } from 'antd';
import { queryDouban } from '../api/book';

export const BookDetailModal = ({ visible, book, onClose }) => {
  const [isbn, setIsbn] = useState('');
  const [doubanLoading, setDoubanLoading] = useState(false);
  const [doubanInfo, setDoubanInfo] = useState(null);

  if (!book) return null;

  // 初始化ISBN
  const handleOpen = () => {
    setIsbn(book.isbn || '');
    setDoubanInfo(null);
  };

  // 查询豆瓣
  const handleDoubanQuery = async () => {
    if (!isbn) {
      message.warning('请输入ISBN');
      return;
    }

    setDoubanLoading(true);
    try {
      const res = await queryDouban(isbn);
      if (res.code === 0 && res.data) {
        setDoubanInfo(res.data);
        message.success('获取成功');
      } else {
        message.error(res.message || '查询失败，请检查ISBN是否正确');
        setDoubanInfo(null);
      }
    } catch (error) {
      console.error('豆瓣查询失败:', error);
      message.error('豆瓣查询失败');
      setDoubanInfo(null);
    } finally {
      setDoubanLoading(false);
    }
  };

  const fields = [
    { label: '书名', value: book.title, span: 2 },
    { label: 'ISBN', value: book.isbn },
    { label: '统一书号', value: book.unified_code },
    { label: '位置', value: book.location },
    { label: '类型', value: book.category },
    { label: '作者', value: book.author },
    { label: '译者', value: book.translator },
    { label: '出版社', value: book.publisher },
    { label: '丛书', value: book.series },
    { label: '出版年', value: book.publish_year },
    { label: '页数', value: book.pages },
    { label: '定价', value: book.price },
    { label: '装帧', value: book.binding },
    { label: '语言', value: book.language },
    { label: '原作名', value: book.original_title, span: 2 },
    { label: '副标题', value: book.subtitle, span: 2 },
    { label: '备注', value: book.remark, span: 2 },
  ];

  return (
    <Modal
      title="书籍详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions column={2} bordered size="small">
        {fields.map((field, index) => (
          <Descriptions.Item key={index} label={field.label} span={field.span || 1}>
            {field.value || '-'}
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Divider>豆瓣查询</Divider>

      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="请输入ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onPressEnter={handleDoubanQuery}
        />
        <Button type="primary" onClick={handleDoubanQuery} loading={doubanLoading}>
          查询豆瓣
        </Button>
      </Space.Compact>

      {doubanLoading && (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin tip="正在查询豆瓣..." />
        </div>
      )}

      {doubanInfo && !doubanLoading && (
        <Card title="豆瓣返回信息" size="small">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="书名">{doubanInfo.title || '-'}</Descriptions.Item>
            <Descriptions.Item label="作者">{doubanInfo.author || '-'}</Descriptions.Item>
            <Descriptions.Item label="出版社">{doubanInfo.publisher || '-'}</Descriptions.Item>
            <Descriptions.Item label="出版年">{doubanInfo.publish_year || '-'}</Descriptions.Item>
            <Descriptions.Item label="页数">{doubanInfo.pages || '-'}</Descriptions.Item>
            <Descriptions.Item label="定价">{doubanInfo.price || '-'}</Descriptions.Item>
            <Descriptions.Item label="装帧">{doubanInfo.binding || '-'}</Descriptions.Item>
            <Descriptions.Item label="ISBN">{doubanInfo.isbn || '-'}</Descriptions.Item>
            <Descriptions.Item label="原作名" span={2}>{doubanInfo.original_title || '-'}</Descriptions.Item>
            <Descriptions.Item label="译者" span={2}>{doubanInfo.translator || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Modal>
  );
};