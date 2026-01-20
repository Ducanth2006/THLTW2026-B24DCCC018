import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, message, Popconfirm, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const duLieuMau = [
  { id: 1, tenSanPham: 'Laptop Dell XPS 13', gia: 25000000, soLuong: 10 },
  { id: 2, tenSanPham: 'iPhone 15 Pro Max', gia: 34000000, soLuong: 5 },
  { id: 3, tenSanPham: 'Chuột Logitech MX Master 3', gia: 2500000, soLuong: 20 },
  { id: 4, tenSanPham: 'Bàn phím cơ Keychron K2', gia: 1800000, soLuong: 15 },
  { id: 5, tenSanPham: 'Màn hình LG UltraGear', gia: 9500000, soLuong: 8 },
];

const QuanLySanPham = () => {
  const [danhSachSanPham, setDanhSachSanPham] = useState(duLieuMau);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [hienThiModal, setHienThiModal] = useState(false);
  const [formTaoMoi] = Form.useForm();

  const xuLyThemSanPham = (giaTriForm: any) => {
    const sanPhamMoi = {
      id: Date.now(),
      ...giaTriForm,
    };
    setDanhSachSanPham([...danhSachSanPham, sanPhamMoi]);
    message.success('Thêm sản phẩm thành công');
    setHienThiModal(false);
    formTaoMoi.resetFields();
  };

  const xuLyXoaSanPham = (idSanPham: any) => {
    const danhSachMoi = danhSachSanPham.filter((item) => item.id !== idSanPham);
    setDanhSachSanPham(danhSachMoi);
    message.success('Xóa sản phẩm thành công');
  };

  const duLieuHienThi = danhSachSanPham.filter((item) =>
    item.tenSanPham.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

  const cacCotCuaBang = [
    {
      title: 'STT',
      key: 'stt',
    //   align:'center',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Giá',
      dataIndex: 'gia',
      key: 'gia',
      render: (gia: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia),
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      render: (_: any, banGhi: any) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onConfirm={() => xuLyXoaSanPham(banGhi.id)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="Quản lý danh sách sản phẩm">
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm..."
          allowClear
          onChange={(e) => setTuKhoaTimKiem(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModal(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={cacCotCuaBang}
        dataSource={duLieuHienThi}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Thêm sản phẩm mới"
        visible={hienThiModal}
        onCancel={() => setHienThiModal(false)}
        footer={null}
      >
        <Form
          form={formTaoMoi}
          layout="vertical"
          onFinish={xuLyThemSanPham}
        >
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="gia"
            label="Giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải là số dương' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập giá sản phẩm"
              formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setHienThiModal(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLySanPham;