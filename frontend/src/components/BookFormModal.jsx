/**
 * 书籍新增/编辑弹窗组件
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Row, Col, Space, Select } from 'antd';
import { queryDouban, createBook, updateBook } from '../api/book';

export const BookFormModal = ({ visible, book, isEditing, categories, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doubanLoading, setDoubanLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (book) {
        form.setFieldsValue(book);
      } else {
        form.resetFields();
      }
    }
  }, [visible, book, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let res;
      if (isEditing) {
        res = await updateBook(book.id, values);
      } else {
        res = await createBook(values);
      }

      if (res.code === 0) {
        message.success(isEditing ? '编辑成功' : '新增成功');
        onSuccess();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      console.error('表单提交失败:', error);
      if (error.errorFields) {
        message.error('请填写必填项');
      }
    } finally {
      setLoading(false);
    }
  };

  // 豆瓣ISBN查询
  const handleDoubanQuery = async () => {
    const isbn = form.getFieldValue('isbn');
    if (!isbn) {
      message.warning('请先输入ISBN');
      return;
    }

    setDoubanLoading(true);
    try {
      const res = await queryDouban(isbn);
      if (res.code === 0 && res.data) {
        const data = res.data;
        // 自动填充表单字段
        form.setFieldsValue({
          title: data.title || form.getFieldValue('title'),
          author: data.author || form.getFieldValue('author'),
          publisher: data.publisher || form.getFieldValue('publisher'),
          publish_year: data.publish_year || form.getFieldValue('publish_year'),
          pages: data.pages || form.getFieldValue('pages'),
          price: data.price || form.getFieldValue('price'),
          binding: data.binding || form.getFieldValue('binding'),
          original_title: data.original_title || form.getFieldValue('original_title'),
          subtitle: data.subtitle || form.getFieldValue('subtitle'),
        });
        message.success('已从豆瓣获取书籍信息');
      } else {
        message.warning(res.message || '未找到该ISBN对应的书籍');
      }
    } catch (error) {
      console.error('豆瓣查询失败:', error);
      message.error('豆瓣查询失败，请稍后重试');
    } finally {
      setDoubanLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? '编辑书籍' : '新增书籍'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          保存
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="书名"
              rules={[{ required: true, message: '请输入书名' }]}
            >
              <Input placeholder="请输入书名（必填）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isbn" label="ISBN">
              <Input
                placeholder="请输入ISBN"
                addonAfter={
                  <Button
                    type="link"
                    size="small"
                    loading={doubanLoading}
                    onClick={handleDoubanQuery}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    豆瓣查询
                  </Button>
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="category" label="类型">
              <Select
                placeholder="请选择类型"
                allowClear
                showSearch
                mode="default"
                options={categories.map(cat => ({ label: cat, value: cat }))}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="位置">
              <Input placeholder="请输入存放位置" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入作者" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="translator" label="译者">
              <Input placeholder="请输入译者" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="publisher" label="出版社">
              <Input placeholder="请输入出版社" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="series" label="丛书">
              <Input placeholder="请输入丛书名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="publish_year" label="出版年">
              <Input placeholder="如：2020 或 2020/05/01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pages" label="页数">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入页数" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="price" label="定价">
              <Input placeholder="如：59.00元" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="binding" label="装帧">
              <Input placeholder="如：精装、平装" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="original_title" label="原作名">
              <Input placeholder="请输入原作名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle" label="副标题">
              <Input placeholder="请输入副标题" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="unified_code" label="统一书号">
              <Input placeholder="请输入统一书号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
