import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Row, Col, Card } from 'antd';

export default function QuanTri() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duLieu, setDuLieu] = useState([
    { key: 1, ten: 'Vịnh Hạ Long', moTa: 'Kỳ quan TG', tgian: '2 ngày', an: 500000, luuTru: 1000000, diChuyen: 500000, sao: 5 }
  ]);

  const luuDiemDen = (values: any) => {
    setDuLieu([...duLieu, { key: Date.now(), ...values }]);
    setIsModalOpen(false);
  };

  const xoaDong = (key: any) => {
    setDuLieu(duLieu.filter(d => d.key !== key));
  };

  const cotBang = [
    { title: 'Tên', dataIndex: 'ten' },
    { title: 'Mô tả', dataIndex: 'moTa' },
    { title: 'Ăn uống', dataIndex: 'an' },
    { title: 'Lưu trú', dataIndex: 'luuTru' },
    { title: 'Di chuyển', dataIndex: 'diChuyen' },
    { title: 'Đánh giá', dataIndex: 'sao' },
    { title: '', render: (_: any, r: any) => <Button danger onClick={() => xoaDong(r.key)}>Xóa</Button> }
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}><Card style={{ background: '#e6f7ff' }}>Lịch trình tạo tháng này: 125</Card></Col>
        <Col xs={24} sm={8}><Card style={{ background: '#f6ffed' }}>Địa điểm phổ biến nhất: Vịnh Hạ Long</Card></Col>
        <Col xs={24} sm={8}><Card style={{ background: '#fff1f0' }}>Tổng doanh thu: 55.000.000đ</Card></Col>
      </Row>

      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 }}>Thêm điểm đến mới</Button>
      <Table columns={cotBang} dataSource={duLieu} scroll={{ x: 800 }} />

      <Modal title="Thêm/Sửa Địa Điểm" visible={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
        <Form onFinish={luuDiemDen} layout="vertical">
          <Form.Item name="ten" label="Tên điểm đến"><Input /></Form.Item>
          <Form.Item name="moTa" label="Mô tả"><Input.TextArea /></Form.Item>
          <Form.Item name="tgian" label="Thời gian tham quan"><Input /></Form.Item>
          <Form.Item name="an" label="Mức chi ăn uống"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="luuTru" label="Mức chi lưu trú"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="diChuyen" label="Mức chi di chuyển"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="sao" label="Rating (1-5)"><InputNumber max={5} min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Upload ảnh"><input type="file" /></Form.Item>
          <Button htmlType="submit" type="primary" block>Lưu lại</Button>
        </Form>
      </Modal>
    </div>
  );
}