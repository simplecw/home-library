/**
 * 查询表单组件
 */
import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

export const SearchForm = ({ categories, onSearch, onReset, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <div className="mb-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="title" label="书名">
              <Input placeholder="请输入书名" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="location" label="位置">
              <Input placeholder="请输入位置" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="category" label="类型">
              <Select placeholder="请选择类型" allowClear>
                <Option value="">全部</Option>
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入作者" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="translator" label="译者">
              <Input placeholder="请输入译者" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="publisher" label="出版社">
              <Input placeholder="请输入出版社" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="series" label="丛书">
              <Input placeholder="请输入丛书" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="publish_year" label="出版年">
              <Input placeholder="如：2020 或 2020/05" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={handleReset}>重置</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={onAdd}>
              新增书籍
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};