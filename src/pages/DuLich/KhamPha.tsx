import { useState } from 'react';
import { Card, Row, Col, Select, Rate } from 'antd';

const dsDiemDen = [
  { id: 1, ten: 'Vịnh Hạ Long', loai: 'biển', gia: 2000000, sao: 5, anh: 'https://placehold.co/400x200' },
  { id: 2, ten: 'Sapa', loai: 'núi', gia: 1500000, sao: 4, anh: 'https://placehold.co/400x200' },
  { id: 3, ten: 'Hà Nội', loai: 'thành phố', gia: 1000000, sao: 4, anh: 'https://placehold.co/400x200' },
];

export default function KhamPha() {
  const [loai, setLoai] = useState('tat-ca');
  const [gia, setGia] = useState(0);
  const [sao, setSao] = useState(0);

  const dataLoc = dsDiemDen.filter(item => {
    if (loai !== 'tat-ca' && item.loai !== loai) return false;
    if (gia > 0 && item.gia > gia) return false;
    if (sao > 0 && item.sao < sao) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <Select value={loai} onChange={setLoai} style={{ width: 150 }}>
          <Select.Option value="tat-ca">Tất cả loại hình</Select.Option>
          <Select.Option value="biển">Biển</Select.Option>
          <Select.Option value="núi">Núi</Select.Option>
          <Select.Option value="thành phố">Thành phố</Select.Option>
        </Select>
        <Select value={gia} onChange={setGia} style={{ width: 150 }}>
          <Select.Option value={0}>Mọi mức giá</Select.Option>
          <Select.Option value={1500000}>Dưới 1.500.000</Select.Option>
          <Select.Option value={2500000}>Dưới 2.500.000</Select.Option>
        </Select>
        <Select value={sao} onChange={setSao} style={{ width: 150 }}>
          <Select.Option value={0}>Mọi đánh giá</Select.Option>
          <Select.Option value={4}>Từ 4 sao</Select.Option>
          <Select.Option value={5}>Từ 5 sao</Select.Option>
        </Select>
      </div>
      <Row gutter={[16, 16]}>
        {dataLoc.map(d => (
          <Col xs={24} sm={12} md={8} key={d.id}>
            <Card cover={<img alt={d.ten} src={d.anh} />}>
              <Card.Meta title={d.ten} description={`Giá: ${d.gia} VNĐ`} />
              <Rate value={d.sao} disabled style={{ marginTop: 10 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}