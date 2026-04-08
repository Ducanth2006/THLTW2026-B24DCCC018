import { useState } from 'react';
import { Select, Button, Table, Input } from 'antd';

const dsCoSan = [
  { id: 1, ten: 'Vịnh Hạ Long', gia: 2000000, tgianDiChuyen: 4 },
  { id: 2, ten: 'Sapa', gia: 1500000, tgianDiChuyen: 6 },
  { id: 3, ten: 'Hà Nội', gia: 1000000, tgianDiChuyen: 2 },
];

export default function LichTrinh() {
  const [list, setList] = useState<any[]>([]);
  const [chonDiem, setChonDiem] = useState(1);
  const [ngay, setNgay] = useState('Ngày 1');

  const handleThem = () => {
    const item = dsCoSan.find(d => d.id === chonDiem);
    if (item) {
      setList([...list, { ...item, ngay, key: Date.now() }]);
    }
  };

  const xoa = (key: any) => {
    setList(list.filter(d => d.key !== key));
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'ngay' },
    { title: 'Điểm đến', dataIndex: 'ten' },
    { title: 'Ngân sách', dataIndex: 'gia' },
    { title: 'T/G di chuyển (h)', dataIndex: 'tgianDiChuyen' },
    { title: 'Hành động', render: (_: any, r: any) => <Button danger onClick={() => xoa(r.key)}>Xóa</Button> }
  ];

  const tongNganSach = list.reduce((a, b) => a + b.gia, 0);
  const tongThoiGian = list.reduce((a, b) => a + b.tgianDiChuyen, 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Input value={ngay} onChange={e => setNgay(e.target.value)} style={{ width: 120 }} />
        <Select value={chonDiem} onChange={setChonDiem} style={{ width: 200 }}>
          {dsCoSan.map(d => <Select.Option key={d.id} value={d.id}>{d.ten}</Select.Option>)}
        </Select>
        <Button type="primary" onClick={handleThem}>Thêm vào lịch</Button>
      </div>
      <Table dataSource={list} columns={columns} pagination={false} scroll={{ x: 500 }} />
      <div style={{ marginTop: 20 }}>
        <h2>Tổng ngân sách dự tính: {tongNganSach} VNĐ</h2>
        <h2>Tổng thời gian di chuyển: {tongThoiGian} giờ</h2>
      </div>
    </div>
  );
}