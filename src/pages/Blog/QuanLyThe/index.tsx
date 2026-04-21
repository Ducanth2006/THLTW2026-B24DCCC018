import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, Modal, Form, Input, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTags, addTag, updateTag, deleteTag } from '@/services/Blog';

const QuanLyThe = () => {
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res: any = await getTags();
    if (res?.success) {
      // Chuyển array string thành array object cho Table
      setData(res.data.map((t: string) => ({ id: t, name: t })));
    }
    setLoading(false);
  };

  const handleOpenForm = (record?: any) => {
    if (record) {
      setEditingTag(record.name);
      form.setFieldsValue({ name: record.name });
    } else {
      setEditingTag(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const handleCloseForm = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    try {
      if (editingTag) {
        await updateTag(editingTag, values.name);
        message.success('Cập nhật thành công');
      } else {
        await addTag(values.name);
        message.success('Thêm mới thành công');
      }
      handleCloseForm();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (name: string) => {
    await deleteTag(name);
    message.success('Xóa thành công');
    fetchData();
  };

  const columns = [
    {
      title: 'Tên thẻ (Tag)',
      dataIndex: 'name',
      key: 'name',
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenForm(record)} />
          <Popconfirm title="Xóa thẻ này?" onConfirm={() => handleDelete(record.name)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Thẻ (Tags)" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>Thêm mới</Button>}>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
        visible={visible}
        onCancel={handleCloseForm}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Tên thẻ" 
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="Ví dụ: React, Node.js..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyThe;
