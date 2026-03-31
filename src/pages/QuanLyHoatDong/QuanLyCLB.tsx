import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, Tag } from 'antd';

export default function QuanLyCLB({ dsClb, setDsClb, setKey }: any) {
  const [moModalClb, setMoModalClb] = useState(false);
  const [tuKhoa, setTuKhoa] = useState("");
  const [formClb] = Form.useForm();

  const luuClb = (values: any) => {
    let mangMoi = [...dsClb];
    if (values.id) {
      const viTri = mangMoi.findIndex((item: any) => item.id === values.id);
      mangMoi[viTri] = { ...mangMoi[viTri], ...values };
    } else {
      values.id = Date.now();
      mangMoi.push(values);
    }
    setDsClb(mangMoi);
    setMoModalClb(false);
  };

  const xoaClb = (id: any) => {
    if(window.confirm("Chắc chắn xóa CLB này?")) setDsClb(dsClb.filter((i: any) => i.id !== id));
  }

  // YÊU CẦU 1: Sort và Cột đầy đủ
  const cotClb = [
    { title: 'Ảnh', dataIndex: 'anh', render: (url: string) => <img src={url} width={40} className="rounded-full" /> },
    { title: 'Tên CLB', dataIndex: 'tenClb', sorter: (a: any, b: any) => a.tenClb.localeCompare(b.tenClb) },
    { title: 'Ngày TL', dataIndex: 'ngayTL', sorter: (a: any, b: any) => a.ngayTL.localeCompare(b.ngayTL) },
    { title: 'Chủ nhiệm', dataIndex: 'chuNghiem' },
    { title: 'Hoạt động', dataIndex: 'dangHoatDong', render: (val: boolean) => val ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag> },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => { setMoModalClb(true); formClb.setFieldsValue(record); }}>Sửa</Button>
          <Button size="small" onClick={() => setKey('3')}>Xem Thành Viên</Button>
          <Button size="small" danger onClick={() => xoaClb(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  // YÊU CẦU 1: Tìm kiếm trực tiếp trên bảng
  const duLieuLoc = dsClb.filter((c: any) => c.tenClb.toLowerCase().includes(tuKhoa.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input.Search placeholder="Tìm CLB theo tên..." style={{ width: 300 }} onChange={e => setTuKhoa(e.target.value)} />
        <Button type="primary" onClick={() => { setMoModalClb(true); formClb.resetFields(); }}>+ Thêm CLB</Button>
      </div>
      <Table columns={cotClb} dataSource={duLieuLoc} rowKey="id" size="small" />

      <Modal title="Thông tin CLB" visible={moModalClb} onOk={() => formClb.submit()} onCancel={() => setMoModalClb(false)}>
        <Form form={formClb} onFinish={luuClb} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="anh" label="Link Ảnh"><Input /></Form.Item>
          <Form.Item name="tenClb" label="Tên CLB" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ngayTL" label="Ngày thành lập"><Input type="date" /></Form.Item>
          <Form.Item name="chuNghiem" label="Chủ nhiệm (Nhập text)"><Input /></Form.Item>
          <Form.Item name="moTa" label="Mô tả (HTML)"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="dangHoatDong" label="Hoạt động" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}