import React, { useState } from 'react';
import { Layout, Menu, Card, Statistic, Row, Col } from 'antd';
import Chart from 'react-apexcharts';
import QuanLyCLB from './QuanLyCLB';
import QuanLyDon from './QuanLyDon';

const { Content, Sider } = Layout;

export default function QuanLyChung() {
  const [key, setKey] = useState('1');
  
  
  const [dsClb, setDsClb] = useState([
    { id: 1, anh: 'https://via.placeholder.com/40', tenClb: "CLB Lập trình PTIT", ngayTL: "2025-01-01", moTa: "<b>Code ngày đêm</b>", chuNghiem: "Anh Đức Hoài", dangHoatDong: true },
    { id: 2, anh: 'https://via.placeholder.com/40', tenClb: "CLB Music", ngayTL: "2025-05-15", moTa: "<b>Hát hò giải trí</b>", chuNghiem: "Văn Nam NHất", dangHoatDong: true }
  ]);
  
  const [dsDon, setDsDon] = useState([
    { id: 101, hoTen: "Nguyễn Văn Tuấn ANh", email: "x@gmail.com", sdt: "0912345678", gioiTinh: "Nam", diaChi: "Hà Nội", soTruong: "Code JavaScript", clbId: 1, lyDo: "Em đam mê", trangThai: "Pending", ghiChu: "", lichSu: ["Khởi tạo đơn lúc 08:00 01/01/2025"] }
  ]);

  
  const renderBieuDo = () => {
    const categories = dsClb.map(c => c.tenClb);
    const dataPending = dsClb.map(c => dsDon.filter(d => d.clbId === c.id && d.trangThai === 'Pending').length);
    const dataApproved = dsClb.map(c => dsDon.filter(d => d.clbId === c.id && d.trangThai === 'Approved').length);
    const dataRejected = dsClb.map(c => dsDon.filter(d => d.clbId === c.id && d.trangThai === 'Rejected').length);

    const options: any = {
      chart: { type: 'bar' },
      xaxis: { categories: categories },
      colors: ['#faad14', '#52c41a', '#f5222d'],
      plotOptions: { bar: { columnWidth: '50%' } },
      dataLabels: { enabled: false },
    };

    const series = [
      { name: 'Pending', data: dataPending },
      { name: 'Approved', data: dataApproved },
      { name: 'Rejected', data: dataRejected }
    ];

    return <Chart options={options} series={series} type="bar" height={350} />;
  };

  return (
    <Layout className="bg-white p-4" style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={220} className="border-r">
        <Menu mode="inline" selectedKeys={[key]} onClick={e => setKey(e.key)}>
          <Menu.Item key="1">Danh sách Câu lạc bộ</Menu.Item>
          <Menu.Item key="2">Đơn đăng ký</Menu.Item>
          <Menu.Item key="3">Thành viên CLB</Menu.Item>
          <Menu.Item key="4">Báo cáo & Thống kê</Menu.Item>
        </Menu>
      </Sider>
      <Content className="pl-6">
        <Card bordered={false} className="shadow-sm">
          {key === '1' && <QuanLyCLB dsClb={dsClb} setDsClb={setDsClb} setKey={setKey} />}
          {key === '2' && <QuanLyDon dsDon={dsDon} setDsDon={setDsDon} dsClb={dsClb} isThanhVien={false} />}
          {key === '3' && <QuanLyDon dsDon={dsDon} setDsDon={setDsDon} dsClb={dsClb} isThanhVien={true} />}
          {key === '4' && (
            <div>
               <h3 className="mb-4 font-bold uppercase">Thống kê số lượng chung</h3>
               <Row gutter={16} className="mb-8">
                  <Col span={6}><Statistic title="Tổng số CLB" value={dsClb.length} /></Col>
                  <Col span={6}><Statistic title="Đơn Pending" value={dsDon.filter(d => d.trangThai === 'Pending').length} valueStyle={{color: '#faad14'}} /></Col>
                  <Col span={6}><Statistic title="Đơn Approved" value={dsDon.filter(d => d.trangThai === 'Approved').length} valueStyle={{color: '#52c41a'}} /></Col>
                  <Col span={6}><Statistic title="Đơn Rejected" value={dsDon.filter(d => d.trangThai === 'Rejected').length} valueStyle={{color: '#f5222d'}} /></Col>
               </Row>
               <h3 className="mb-4 font-bold uppercase">Biểu đồ đơn đăng ký theo từng CLB</h3>
               {renderBieuDo()}
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}