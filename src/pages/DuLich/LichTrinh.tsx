import React, { useState } from 'react';
import { List, Button, message, Input, Card, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const LichTrinh = () => {
  const [keHoach, setKeHoach] = useState<{id: number, ten: string, thoiGian: string}[]>([]);
  const [tenDiem, setTenDiem] = useState('');

  const themDiemDen = () => {
    if (!tenDiem.trim()) {
      message.warning('Vui lòng nhập tên điểm đến');
      return;
    }
    const diemMoi = { id: Date.now(), ten: tenDiem, thoiGian: '2 giờ' };
    setKeHoach([...keHoach, diemMoi]);
    setTenDiem('');
    message.success('Đã thêm vào lịch trình');
  };

  const xoaDiemDen = (id: number) => {
    setKeHoach(keHoach.filter(item => item.id !== id));
    message.info(' Đã xóa điểm đến');
  };

  return (
    <Card title="Lập Kế Hoạch Chuyến Đi">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Input 
          placeholder="Nhập tên điểm đến..." 
          value={tenDiem} 
          onChange={(e) => setTenDiem(e.target.value)} 
          onPressEnter={themDiemDen}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={themDiemDen}>Thêm</Button>
      </div>
      
      <List
        bordered
        dataSource={keHoach}
        renderItem={(item) => (
          <List.Item actions={[<Button danger icon={<DeleteOutlined />} onClick={() => xoaDiemDen(item.id)} />]}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.ten}</div>
              <small>Thời gian dự kiến tham quan: {item.thoiGian}</small>
            </div>
          </List.Item>
        )}
      />
      
      <Divider />
      <div style={{ textAlign: 'right' }}>
        <strong>Tổng số địa điểm: {keHoach.length}</strong>
      </div>
    </Card>
  );
};

export default LichTrinh;