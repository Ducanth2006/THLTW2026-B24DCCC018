import React, { useState } from 'react';
import { Card, Row, Col, Select, Rate, Tag } from 'antd';

const DanhSachDiemDen = [
  { id: 1, ten: 'Vịnh Hạ Long', loai: 'biển', gia: 2000000, sao: 5, anh: 'https://bit.ly/3Z8n1' },
  { id: 2, ten: 'Sapa', loai: 'núi', gia: 1500000, sao: 4, anh: 'https://bit.ly/4G9m2' },
  { id: 3, ten: 'Hà Nội', loai: 'thành phố', gia: 1000000, sao: 4, anh: 'https://bit.ly/5H0n3' },
];

const KhamPha = () => {
  const [loaiHinh, setLoaiHinh] = useState('tat-ca');

  const locDiemDen = DanhSachDiemDen.filter((item) => 
    loaiHinh === 'tat-ca' || item.loai === loaiHinh
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Select defaultValue="tat-ca" style={{ width: 200 }} onChange={(giaTri) => setLoaiHinh(giaTri)}>
          <Select.Option value="tat-ca">Tất cả loại hình</Select.Option>
          <Select.Option value="biển">Vùng Biển</Select.Option>
          <Select.Option value="núi">Vùng Núi</Select.Option>
          <Select.Option value="thành phố">Thành Phố</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {locDiemDen.map((diem) => (
          <Col xs={24} sm={12} md={8} key={diem.id}>
            <Card 
              hoverable 
              cover={<img alt={diem.ten} src={diem.anh} style={{ height: 200, objectFit: 'cover' }} />}
            >
              <Card.Meta title={diem.ten} description={<Tag color="blue">{diem.loai.toUpperCase()}</Tag>} />
              <div style={{ marginTop: '10px' }}>
                <div style={{ color: '#f5222d', fontWeight: 'bold' }}>{diem.gia.toLocaleString()} VNĐ</div>
                <Rate disabled defaultValue={diem.sao} style={{ fontSize: 14 }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KhamPha;