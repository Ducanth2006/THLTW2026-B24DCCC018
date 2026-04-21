import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, Drawer, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPosts, createPost, updatePost, deletePost, getTags } from '@/services/Blog';
import TinyEditor from '@/components/TinyEditor';

type BlogTag = {
  name: string;
  count: number;
};

const QuanLyBaiViet = () => {
  const [data, setData] = useState<any[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search, status]);

  const fetchData = async () => {
    setLoading(true);
    const res: any = await getPosts({ limit: 100, search, status });
    if (res?.success) setData(res.data);
    setLoading(false);
  };

  const fetchTags = async () => {
    const res: any = await getTags();
    if (res?.success) setTags(res.data);
  };

  const handleOpenForm = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({ ...record });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ author: 'Nguyễn Văn A', status: 'draft' });
    }
    setVisible(true);
  };

  const handleCloseForm = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    try {
      if (editingId) {
        await updatePost(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await createPost(values);
        message.success('Thêm mới thành công');
      }
      handleCloseForm();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    message.success('Xóa thành công');
    fetchData();
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (value: string) => (
        <Tag color={value === 'published' ? 'green' : 'orange'}>
          {value === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (value: string[]) => value?.map((tag) => <Tag color="blue" key={tag}>{tag}</Tag>),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenForm(record)} />
          <Popconfirm title="Xóa bài viết này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý Bài viết"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>Thêm mới</Button>}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tiêu đề"
          style={{ width: 260 }}
          allowClear
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setStatus(value)}
        >
          <Select.Option value="draft">Nháp</Select.Option>
          <Select.Option value="published">Đã đăng</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={editingId ? 'Sửa bài viết' : 'Thêm bài viết'}
        width={800}
        visible={visible}
        onClose={handleCloseForm}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseForm} style={{ marginRight: 8 }}>Hủy</Button>
            <Button onClick={() => form.submit()} type="primary">Lưu</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Tóm tắt">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Tác giả" rules={[{ required: true, message: 'Vui lòng nhập tác giả' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ">
            <Select mode="tags" style={{ width: '100%' }}>
              {tags.map((tag) => (
                <Select.Option key={tag.name} value={tag.name}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="draft">
            <Select>
              <Select.Option value="draft">Nháp</Select.Option>
              <Select.Option value="published">Đã đăng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TinyEditor />
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  );
};

export default QuanLyBaiViet;
