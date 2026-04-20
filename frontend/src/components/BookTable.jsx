/**
 * 书籍列表表格组件
 */
import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';

export const BookTable = ({
  dataSource,
  total,
  loading,
  pagination,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      fixed: 'left',
      render: (text, record) => (
        <Button type="link" onClick={() => onViewDetail(record)} className="p-0">
          {text}
        </Button>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 150,
      ellipsis: true,
    },
    {
      title: '译者',
      dataIndex: 'translator',
      key: 'translator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '出版社',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 150,
      ellipsis: true,
    },
    {
      title: '丛书',
      dataIndex: 'series',
      key: 'series',
      width: 150,
      ellipsis: true,
    },
    {
      title: '出版年',
      dataIndex: 'publish_year',
      key: 'publish_year',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这本书吗？"
            onConfirm={() => onDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1300 }}
      pagination={{
        ...pagination,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  );
};