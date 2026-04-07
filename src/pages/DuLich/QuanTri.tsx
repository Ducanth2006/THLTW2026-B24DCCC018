import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from 'antd';

const QuanTri = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duLieu, setDuLieu] = useState([
    { key: '1', ten: 'Vịnh Hạ Long', gia: 2000000, danhGia: 5 },
    { key: '2', ten: 'Đảo Phú Quốc', gia: 3500000, danhGia: 4 },
  ]);

  const xoaDong = (key: string) => {
    setDuLieu(duLieu.filter(item => item.key !== key));
    message.success('Đã xóa thành công');
  };

  const cotBang = [
    { title: 'Tên điểm đến', dataIndex: 'ten', key: 'ten' },
    { title: 'Giá tham khảo', dataIndex: 'gia', key: 'gia', render: (gia: number) => gia.toLocaleString() + ' VNĐ' },
    { title: 'Đánh giá', dataIndex: 'danhGia', key: 'danhGia' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link">Sửa</Button>
          <Button type="link" danger onClick={() => xoaDong(record.key)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm điểm đến mới</Button>
      </div>

      <Table columns={cotBang} dataSource={duLieu} />

      <Modal
        title="Quản lý điểm đến"
        visible={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical">
          <Form.Item label="Tên địa điểm mới">
            <Input placeholder="Nhập tên..." />
          </Form.Item>
          <Form.Item label="Mô tả ngắn">
            <Input.TextArea placeholder="Nhập mô tả..." />
          </Form.Item>
          <Form.Item label="Chi phí ăn uống/người">
            <InputNumber style={{ width: '100%' }} defaultValue={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanTri;