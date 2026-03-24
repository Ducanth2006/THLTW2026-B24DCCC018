import React, { useState, useEffect } from 'react'
import { Tabs, Table, Modal, Form, Input, InputNumber, Button, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface So {
  maSo: number
  tenSo: string
  nam: number
  soVaoSoHienTai: number
}

interface QuyetDinh {
  soQD: string
  ngayQD: string
  trichYeu: string
  maSo_FK: number
  tongLuotTraCuu: number
}

const QuanLyDanhMuc = () => {
  const [dsSo, setDsSo] = useState<So[]>([])
  const [dsQD, setDsQD] = useState<QuyetDinh[]>([])
  const [moModalSo, setMoModalSo] = useState(false)
  const [moModalQD, setMoModalQD] = useState(false)
  const [dinhDangSo, setDinhDangSo] = useState<So | null>(null)
  const [dinhDangQD, setDinhDangQD] = useState<QuyetDinh | null>(null)
  const [formSo] = Form.useForm()
  const [formQD] = Form.useForm()

  useEffect(() => {
    layDuLieu()
  }, [])

  const layDuLieu = () => {
    const so = localStorage.getItem('dsSo')
    const qd = localStorage.getItem('dsQD')
    if (so) setDsSo(JSON.parse(so))
    if (qd) setDsQD(JSON.parse(qd))
  }

  const luuDuLieu = (dsMoi: So[], dsQDMoi: QuyetDinh[]) => {
    localStorage.setItem('dsSo', JSON.stringify(dsMoi))
    localStorage.setItem('dsQD', JSON.stringify(dsQDMoi))
  }

  const xoaModalSo = () => {
    setMoModalSo(false)
    setDinhDangSo(null)
    formSo.resetFields()
  }

  const xoaModalQD = () => {
    setMoModalQD(false)
    setDinhDangQD(null)
    formQD.resetFields()
  }

  const taoMaSoMoi = () => {
    if (dsSo.length === 0) return 1
    let max = 0
    for (let i = 0; i < dsSo.length; i++) {
      if (dsSo[i].maSo > max) max = dsSo[i].maSo
    }
    return max + 1
  }

  const themSo = (values: any) => {
    const soMoi: So = {
      maSo: taoMaSoMoi(),
      tenSo: values.tenSo,
      nam: values.nam,
      soVaoSoHienTai: 1,
    }
    const dsMoiThem = [...dsSo, soMoi]
    setDsSo(dsMoiThem)
    luuDuLieu(dsMoiThem, dsQD)
    message.success('Thêm sổ thành công')
    xoaModalSo()
  }

  const suaSo = (values: any) => {
    if (!dinhDangSo) return
    const dsMoiSua = dsSo.map((item) =>
      item.maSo === dinhDangSo.maSo
        ? { ...item, tenSo: values.tenSo, nam: values.nam }
        : item,
    )
    setDsSo(dsMoiSua)
    luuDuLieu(dsMoiSua, dsQD)
    message.success('Cập nhật sổ thành công')
    xoaModalSo()
  }

  const xoaSo = (maSo: number) => {
    const dsMoiXoa = dsSo.filter((item) => item.maSo !== maSo)
    setDsSo(dsMoiXoa)
    luuDuLieu(dsMoiXoa, dsQD)
    message.success('Xóa sổ thành công')
  }

  const moThemSo = () => {
    setDinhDangSo(null)
    setMoModalSo(true)
  }

  const moSuaSo = (so: So) => {
    setDinhDangSo(so)
    formSo.setFieldsValue({ tenSo: so.tenSo, nam: so.nam })
    setMoModalSo(true)
  }

  const themQD = (values: any) => {
    const qdMoi: QuyetDinh = {
      soQD: values.soQD,
      ngayQD: values.ngayQD,
      trichYeu: values.trichYeu,
      maSo_FK: values.maSo_FK,
      tongLuotTraCuu: 0,
    }
    const dsQDMoiThem = [...dsQD, qdMoi]
    setDsQD(dsQDMoiThem)
    luuDuLieu(dsSo, dsQDMoiThem)
    message.success('Thêm quyết định thành công')
    xoaModalQD()
  }

  const suaQD = (values: any) => {
    if (!dinhDangQD) return
    const dsQDMoiSua = dsQD.map((item) =>
      item.soQD === dinhDangQD.soQD
        ? {
            ...item,
            ngayQD: values.ngayQD,
            trichYeu: values.trichYeu,
            maSo_FK: values.maSo_FK,
          }
        : item,
    )
    setDsQD(dsQDMoiSua)
    luuDuLieu(dsSo, dsQDMoiSua)
    message.success('Cập nhật quyết định thành công')
    xoaModalQD()
  }

  const xoaQD = (soQD: string) => {
    const dsQDMoiXoa = dsQD.filter((item) => item.soQD !== soQD)
    setDsQD(dsQDMoiXoa)
    luuDuLieu(dsSo, dsQDMoiXoa)
    message.success('Xóa quyết định thành công')
  }

  const moThemQD = () => {
    setDinhDangQD(null)
    setMoModalQD(true)
  }

  const moSuaQD = (qd: QuyetDinh) => {
    setDinhDangQD(qd)
    formQD.setFieldsValue({
      soQD: qd.soQD,
      ngayQD: qd.ngayQD,
      trichYeu: qd.trichYeu,
      maSo_FK: qd.maSo_FK,
    })
    setMoModalQD(true)
  }

  const cotsso = [
    { title: 'Mã Sổ', dataIndex: 'maSo', key: 'maSo' },
    { title: 'Tên Sổ', dataIndex: 'tenSo', key: 'tenSo' },
    { title: 'Năm', dataIndex: 'nam', key: 'nam' },
    { title: 'Số Vào Sổ Hiện Tại', dataIndex: 'soVaoSoHienTai', key: 'soVaoSoHienTai' },
    {
      title: 'Hành Động',
      key: 'hanhDong',
      render: (text: any, record: So) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => moSuaSo(record)}
          />
    
            <Button size="small" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ]

  const cotsqd = [
    { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
    { title: 'Ngày QĐ', dataIndex: 'ngayQD', key: 'ngayQD' },
    { title: 'Trích Yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
    {
      title: 'Mã Sổ',
      dataIndex: 'maSo_FK',
      key: 'maSo_FK',
      render: (maSo: number) => {
        const so = dsSo.find((s) => s.maSo === maSo)
        return so ? so.tenSo : 'N/A'
      },
    },
    { title: 'Lượt Tra Cứu', dataIndex: 'tongLuotTraCuu', key: 'tongLuotTraCuu' },
    {
      title: 'Hành Động',
      key: 'hanhDong',
      render: (text: any, record: QuyetDinh) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => moSuaQD(record)}
          />
          <Popconfirm
            title="Xóa quyết định này?"
            onConfirm={() => xoaQD(record.soQD)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Quản Lý Sổ" key="1">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={moThemSo}
          style={{ marginBottom: 16 }}
        >
          Thêm Sổ
        </Button>
        <Table
          dataSource={dsSo}
          columns={cotsso}
          rowKey="maSo"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={dinhDangSo ? 'Sửa Sổ' : 'Thêm Sổ'}
          visible={moModalSo}
          onOk={() => {
            if (dinhDangSo) {
              formSo.submit()
            } else {
              formSo.submit()
            }
          }}
          onCancel={xoaModalSo}
        >
          <Form
            form={formSo}
            layout="vertical"
            onFinish={dinhDangSo ? suaSo : themSo}
          >
            <Form.Item
              name="tenSo"
              label="Tên Sổ"
              rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nam"
              label="Năm"
              rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
            >
              <InputNumber />
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Quản Lý Quyết Định" key="2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={moThemQD}
          style={{ marginBottom: 16 }}
        >
          Thêm Quyết Định
        </Button>
        <Table
          dataSource={dsQD}
          columns={cotsqd}
          rowKey="soQD"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={dinhDangQD ? 'Sửa Quyết Định' : 'Thêm Quyết Định'}
          visible={moModalQD}
          onOk={() => formQD.submit()}
          onCancel={xoaModalQD}
        >
          <Form
            form={formQD}
            layout="vertical"
            onFinish={dinhDangQD ? suaQD : themQD}
          >
            <Form.Item
              name="soQD"
              label="Số QĐ"
              rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
            >
              <Input disabled={!!dinhDangQD} />
            </Form.Item>
            <Form.Item
              name="ngayQD"
              label="Ngày QĐ"
              rules={[{ required: true, message: 'Vui lòng nhập ngày QĐ' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="trichYeu"
              label="Trích Yếu"
              rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="maSo_FK"
              label="Chọn Sổ"
              rules={[{ required: true, message: 'Vui lòng chọn sổ' }]}
            >
              <select>
                <option value="">-- Chọn Sổ --</option>
                {dsSo.map((so) => (
                  <option key={so.maSo} value={so.maSo}>
                    {so.tenSo}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default QuanLyDanhMuc