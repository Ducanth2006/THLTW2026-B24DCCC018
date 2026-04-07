import React from 'react';
import { Card, Alert, Row, Col, Statistic, Progress, Badge, Divider } from 'antd';

const NganSach = () => {
  const danhSachChiTieu = [
    { muc: 'Ăn uống', daChi: 1500000, phanTram: 30, mau: '#f5222d' },
    { muc: 'Di chuyển', daChi: 1200000, phanTram: 25, mau: '#1890ff' },
    { muc: 'Lưu trú', daChi: 2000000, phanTram: 35, mau: '#52c41a' },
    { muc: 'Khác', daChi: 800000, phanTram: 10, mau: '#faad14' },
  ];

  const tongChiPhi = 5500000;
  const hanMucChoPhep = 5000000;
  const soTienVuot = tongChiPhi - hanMucChoPhep;

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Cảnh báo nếu vượt ngân sách */}
      {tongChiPhi > hanMucChoPhep && (
        <Alert
          message="Cảnh báo vượt hạn mức!"
          description={`Bạn đã chi tiêu quá ${soTienVuot.toLocaleString()} VNĐ so với dự kiến ban đầu.`}
          type="error"
          showIcon
          style={{ marginBottom: '20px', borderRadius: '8px' }}
        />
      )}

      {/* Số liệu tổng quát */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="Tổng chi phí đã chi" 
              value={tongChiPhi} 
              suffix="VNĐ" 
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Statistic 
              title="Ngân sách dự kiến" 
              value={hanMucChoPhep} 
              suffix="VNĐ" 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tự chế bằng CSS và Progress */}
      <Card 
        title="Phân bổ ngân sách chi tiết" 
        bordered={false} 
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div style={{ padding: '10px 0' }}>
          {danhSachChiTieu.map((item, index) => (
            <div key={index} style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>
                  <Badge color={item.mau} />
                  <span style={{ marginLeft: '8px', fontWeight: 500 }}>{item.muc}</span>
                </span>
                <span style={{ color: '#8c8c8c' }}>
                  {item.daChi.toLocaleString()} VNĐ ({item.phanTram}%)
                </span>
              </div>
              <Progress 
                percent={item.phanTram} 
                strokeColor={item.mau} 
                status="active" 
                strokeWidth={12}
                showInfo={false}
              />
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: '13px' }}>
          Ghi chú: Số liệu được cập nhật dựa trên các hóa đơn đã nhập vào hệ thống.
        </div>
      </Card>
    </div>
  );
};

export default NganSach;