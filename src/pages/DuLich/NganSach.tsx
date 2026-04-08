import { useState } from 'react';
import { Progress, Alert, Card, InputNumber, Button, Form, Input, Row, Col } from 'antd';

export default function NganSach() {
  // Quản lý tổng ngân sách bằng state để có thể sửa đổi
  const [tongDuKien, setTongDuKien] = useState(6000000);
  
  // Quản lý danh sách chi tiêu thực tế
  const [chiTieu, setChiTieu] = useState([
    { muc: 'Ăn uống', daChi: 2500000, mau: '#ff4d4f' },
    { muc: 'Lưu trú', daChi: 2000000, mau: '#52c41a' },
    { muc: 'Di chuyển', daChi: 2000000, mau: '#1890ff' }
  ]);
  
  const [form] = Form.useForm();

  // Tính tổng tiền đã chi
  const tongThucTe = chiTieu.reduce((a, b) => a + b.daChi, 0);

  // Thêm mục chi tiêu mới
  const handleThemChiTieu = (values: any) => {
    // Tạo 1 màu ngẫu nhiên cho biểu đồ progress đỡ trùng
    const mauNgauNhien = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setChiTieu([...chiTieu, { muc: values.muc, daChi: values.daChi, mau: mauNgauNhien }]);
    form.resetFields(); // reset form sau khi thêm
  };

  // Xóa 1 mục chi tiêu
  const xoaChiTieu = (index: any) => {
    const listMoi = [...chiTieu];
    listMoi.splice(index, 1);
    setChiTieu(listMoi);
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <h3>Tổng ngân sách dự kiến (VNĐ): </h3>
        <InputNumber 
          value={tongDuKien} 
          onChange={(e) => setTongDuKien(e || 0)} 
          style={{ width: 250 }} 
          step={100000}
        />
      </Card>

      {/* Cảnh báo vượt ngân sách */}
      {tongThucTe > tongDuKien && (
        <Alert 
          message={`Cảnh báo: Bạn đã vượt ngân sách ${tongThucTe - tongDuKien} VNĐ!`} 
          type="error" 
          showIcon 
          style={{ marginBottom: 20 }} 
        />
      )}

      <Row gutter={[16, 16]}>
        {/* Cột Form thêm dữ liệu */}
        <Col xs={24} md={10}>
          <Card title="Thêm mục chi tiêu mới">
            <Form form={form} onFinish={handleThemChiTieu} layout="vertical">
              <Form.Item name="muc" label="Tên hạng mục (VD: Mua sắm, Vé...)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="daChi" label="Số tiền đã chi" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>
                Thêm vào thống kê
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Cột hiển thị biểu đồ Progress */}
        <Col xs={24} md={14}>
          <Card title={`Tiến độ chi tiêu (Đã chi: ${tongThucTe} / ${tongDuKien})`}>
            {chiTieu.map((d, index) => {
              // Tự động tính phần trăm dựa trên tổng dự kiến đang có
              const phanTram = tongDuKien > 0 ? Math.round((d.daChi / tongDuKien) * 100) : 0;
              
              return (
                <div key={index} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <b>{d.muc}: {d.daChi} VNĐ</b>
                    <Button type="text" danger size="small" onClick={() => xoaChiTieu(index)}>Xóa</Button>
                  </div>
                  <Progress percent={phanTram} strokeColor={d.mau} />
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
}