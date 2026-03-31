import React, { useState } from 'react';
import { Table, Button, Modal, Input, Tag, Select, Space, Form } from 'antd';

export default function QuanLyDon({ dsDon, setDsDon, dsClb, isThanhVien }: any) {
  const [danhSachChon, setDanhSachChon] = useState<any[]>([]);
  const [moModalTuChoi, setMoModalTuChoi] = useState(false);
  const [moModalDoiClb, setMoModalDoiClb] = useState(false);
  const [moModalForm, setMoModalForm] = useState(false);
  const [moModalLichSu, setMoModalLichSu] = useState(false);
  
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [clbMoiId, setClbMoiId] = useState<any>(null);
  const [lichSuXem, setLichSuXem] = useState<string[]>([]);
  const [formDon] = Form.useForm();

  
  const duLieuHienThi = isThanhVien ? dsDon.filter((d: any) => d.trangThai === 'Approved') : dsDon;

  
  const handleDuyetHangLoat = () => {
    const time = new Date().toLocaleString();
    const moi = dsDon.map((d: any) => danhSachChon.includes(d.id) 
      ? { ...d, trangThai: 'Approved', lichSu: [...d.lichSu, `Admin đã Approved vào lúc ${time}`] } : d);
    setDsDon(moi); setDanhSachChon([]);
  };

  const handleTuChoiHangLoat = () => {
    if (!lyDoTuChoi.trim()) return alert("Bắt buộc phải nhập lý do từ chối!");
    const time = new Date().toLocaleString();
    const moi = dsDon.map((d: any) => danhSachChon.includes(d.id) 
      ? { ...d, trangThai: 'Rejected', ghiChu: lyDoTuChoi, lichSu: [...d.lichSu, `Admin đã Rejected vào lúc ${time} với lý do: ${lyDoTuChoi}`] } : d);
    setDsDon(moi); setMoModalTuChoi(false); setLyDoTuChoi(""); setDanhSachChon([]);
  };

 
  const handleDoiClb = () => {
    if (!clbMoiId) return alert("Chưa chọn CLB!");
    const time = new Date().toLocaleString();
    const moi = dsDon.map((d: any) => danhSachChon.includes(d.id) 
      ? { ...d, clbId: clbMoiId, lichSu: [...d.lichSu, `Admin đổi sang CLB ID ${clbMoiId} lúc ${time}`] } : d);
    setDsDon(moi); setMoModalDoiClb(false); setDanhSachChon([]);
  };

 
  const luuDon = (values: any) => {
    let mangMoi = [...dsDon];
    if (values.id) {
      const idx = mangMoi.findIndex((item: any) => item.id === values.id);
      mangMoi[idx] = { ...mangMoi[idx], ...values };
    } else {
      values.id = Date.now();
      values.trangThai = "Pending";
      values.lichSu = [`Tạo mới đơn lúc ${new Date().toLocaleString()}`];
      mangMoi.push(values);
    }
    setDsDon(mangMoi); setMoModalForm(false);
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'hoTen' },
    { title: 'SĐT', dataIndex: 'sdt' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'CLB', dataIndex: 'clbId', render: (id: any) => dsClb.find((c: any) => c.id === id)?.tenClb },
    { title: 'Trạng thái', dataIndex: 'trangThai', render: (s: string) => <Tag color={s === 'Approved' ? 'green' : (s === 'Rejected' ? 'red' : 'orange')}>{s}</Tag> },
    {
      title: 'Thao tác',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => { setMoModalForm(true); formDon.setFieldsValue(r); }}>Sửa/Xem</Button>
          <Button size="small" onClick={() => { setLichSuXem(r.lichSu); setMoModalLichSu(true); }}>Lịch sử</Button>
          <Button size="small" danger onClick={() => setDsDon(dsDon.filter((d: any) => d.id !== r.id))}>Xóa</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Space>
          {!isThanhVien && (
            <>
              <Button type="primary" disabled={!danhSachChon.length} onClick={handleDuyetHangLoat}>Duyệt ({danhSachChon.length})</Button>
              <Button danger disabled={!danhSachChon.length} onClick={() => setMoModalTuChoi(true)}>Từ chối ({danhSachChon.length})</Button>
            </>
          )}
          {isThanhVien && <Button onClick={() => setMoModalDoiClb(true)} disabled={!danhSachChon.length}>Đổi CLB ({danhSachChon.length})</Button>}
        </Space>
        {!isThanhVien && <Button type="dashed" onClick={() => { formDon.resetFields(); setMoModalForm(true); }}>+ Thêm Đơn</Button>}
      </div>

      <Table 
        rowSelection={{ selectedRowKeys: danhSachChon, onChange: (k) => setDanhSachChon(k) }}
        columns={columns} dataSource={duLieuHienThi} rowKey="id" size="small" scroll={{ x: 800 }}
      />

      {/* Modal Từ Chối */}
      <Modal title="Lý do từ chối" visible={moModalTuChoi} onOk={handleTuChoiHangLoat} onCancel={() => setMoModalTuChoi(false)}>
        <Input.TextArea placeholder="Bắt buộc nhập lý do..." value={lyDoTuChoi} onChange={e => setLyDoTuChoi(e.target.value)} rows={3} />
      </Modal>

      {/* Modal Chuyển CLB */}
      <Modal title="Chuyển Câu lạc bộ" visible={moModalDoiClb} onOk={handleDoiClb} onCancel={() => setMoModalDoiClb(false)}>
        <Select style={{ width: '100%' }} onChange={v => setClbMoiId(v)} placeholder="Chọn CLB...">
          {dsClb.map((c: any) => <Select.Option key={c.id} value={c.id}>{c.tenClb}</Select.Option>)}
        </Select>
      </Modal>

      {/* Modal Xem/Sửa/Thêm Đơn */}
      <Modal title="Thông tin Đơn/Thành viên" visible={moModalForm} onOk={() => formDon.submit()} onCancel={() => setMoModalForm(false)}>
        <Form form={formDon} onFinish={luuDon} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="hoTen" label="Họ Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="sdt" label="Số điện thoại"><Input /></Form.Item>
          <Form.Item name="gioiTinh" label="Giới tính"><Select><Select.Option value="Nam">Nam</Select.Option><Select.Option value="Nữ">Nữ</Select.Option></Select></Form.Item>
          <Form.Item name="clbId" label="Câu lạc bộ đăng ký">
            <Select>{dsClb.map((c: any) => <Select.Option key={c.id} value={c.id}>{c.tenClb}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="soTruong" label="Sở trường"><Input /></Form.Item>
          <Form.Item name="lyDo" label="Lý do đăng ký"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      {/* Modal Lịch Sử */}
      <Modal title="Lịch sử thao tác" visible={moModalLichSu} footer={null} onCancel={() => setMoModalLichSu(false)}>
        <ul className="list-disc pl-5">
          {lichSuXem.map((log, i) => <li key={i} className="mb-2 text-sm">{log}</li>)}
        </ul>
      </Modal>
    </div>
  );
}