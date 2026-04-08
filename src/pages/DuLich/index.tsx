import { Tabs } from 'antd';
import KhamPha from './KhamPha';
import LichTrinh from './LichTrinh';
import NganSach from './NganSach';
import QuanTri from './QuanTri';

export default function DuLich() {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Khám Phá" key="1">
          <KhamPha />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lập Lịch Trình" key="2">
          <LichTrinh />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Ngân Sách" key="3">
          <NganSach />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản Trị" key="4">
          <QuanTri />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}