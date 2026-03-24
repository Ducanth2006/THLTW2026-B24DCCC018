import React, { useState } from 'react'
import { Tabs } from 'antd'
import QuanLyDanhMuc from './QuanLyDanhMuc'
import CauHinhVaNhapBang from './CauHinhVaNhapBang'
import TraCuu from './TraCuu'

const QuanLyVanBang = () => {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Quản Lý Danh Mục" key="1">
        <QuanLyDanhMuc />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Cấu Hình & Nhập Bằng" key="2">
        <CauHinhVaNhapBang />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tra Cứu" key="3">
        <TraCuu />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default QuanLyVanBang