import React, { useState, useEffect } from 'react'
import { Tabs, Table, Modal, Form, Input, InputNumber, Button, message, Select, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface TruongDong {
  id: number
  tenTruong: string
  kieuDuLieu: string
}

interface VanBang {
  id: number
  soHieu: string
  soVaoSo: number
  maSV: string
  hoTen: string
  ngaySinh: string
  maQD_FK: string
}

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
}

const CauHinhVaNhapBang = () => {
  const [dsTruongDong, setDsTruongDong] = useState<TruongDong[]>([])
  const [dsVanBang, setDsVanBang] = useState<VanBang[]>([])
  const [dsSo, setDsSo] = useState<So[]>([])
  const [dsQD, setDsQD] = useState<QuyetDinh[]>([])
  const [moModalTruong, setMoModalTruong] = useState(false)
  const [moModalVB, setMoModalVB] = useState(false)
  const [dinhDangTruong, setDinhDangTruong] = useState<TruongDong | null>(null)
  const [formTruong] = Form.useForm()
  const [formVB] = Form.useForm()

  useEffect(() => {
    layDuLieu()
  }, [])

  const layDuLieu = () => {
    const truong = localStorage.getItem('dsTruongDong')
    const vb = localStorage.getItem('dsVanBang')
    const so = localStorage.getItem('dsSo')
    const qd = localStorage.getItem('dsQD')
    if (truong) setDsTruongDong(JSON.parse(truong))
    if (vb) setDsVanBang(JSON.parse(vb))
    if (so) setDsSo(JSON.parse(so))
    if (qd) setDsQD(JSON.parse(qd))
  }

  const luuDuLieu = (dsTruongMoi?: TruongDong[], dsVBMoi?: VanBang[], dsSoMoi?: So[]) => {
    if (dsTruongMoi) localStorage.setItem('dsTruongDong', JSON.stringify(dsTruongMoi))
    if (dsVBMoi) localStorage.setItem('dsVanBang', JSON.stringify(dsVBMoi))
    if (dsSoMoi) localStorage.setItem('dsSo', JSON.stringify(dsSoMoi))
  }

  const taoIdMoi = (arr: any[]) => {
    if (arr.length === 0) return 1
    let max = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id > max) max = arr[i].id
    }
    return max + 1
  }

  const themTruong = (values: any) => {
    const truongMoi: TruongDong = {
      id: taoIdMoi(dsTruongDong),
      tenTruong: values.tenTruong,
      kieuDuLieu: values.kieuDuLieu,
    }
    const dsMoiThem = [...dsTruongDong, truongMoi]
    setDsTruongDong(dsMoiThem)
    luuDuLieu(dsMoiThem)
    message.success('Thêm trường thành công')
    setMoModalTruong(false)
    formTruong.resetFields()
  }

  const suaTruong = (values: any) => {
    if (!dinhDangTruong) return
    const dsMoiSua = dsTruongDong.map((item) =>
      item.id === dinhDangTruong.id
        ? { ...item, tenTruong: values.tenTruong, kieuDuLieu: values.kieuDuLieu }
        : item,
    )
    setDsTruongDong(dsMoiSua)
    luuDuLieu(dsMoiSua)
    message.success('Cập nhật trường thành công')
    setMoModalTruong(false)
    formTruong.resetFields()
  }

  const xoaTruong = (id: number) => {
    const dsMoiXoa = dsTruongDong.filter((item) => item.id !== id)
    setDsTruongDong(dsMoiXoa)
    luuDuLieu(dsMoiXoa)
    message.success('Xóa trường thành công')
  }

  const themVanBang = (values: any) => {
    const qd = dsQD.find((q) => q.soQD === values.maQD_FK)
    if (!qd) {
      message.error('Quyết định không tồn tại')
      return
    }

    const so = dsSo.find((s) => s.maSo === qd.maSo_FK)
    if (!so) {
      message.error('Sổ không tồn tại')
      return
    }

    const soVaoSoMoi = so.soVaoSoHienTai
    const soHieuMoi = values.soHieu || `VB${soVaoSoMoi}`

    // Collect dynamic field values
    const truongDongData: any = {}
    dsTruongDong.forEach((truong) => {
      truongDongData[`truongDong_${truong.id}`] = values[`truongDong_${truong.id}`]
    })

    const vbMoi: any = {
      id: taoIdMoi(dsVanBang),
      soHieu: soHieuMoi,
      soVaoSo: soVaoSoMoi,
      maSV: values.maSV,
      hoTen: values.hoTen,
      ngaySinh: values.ngaySinh,
      maQD_FK: values.maQD_FK,
      ...truongDongData,
    }

    const dsVBMoiThem = [...dsVanBang, vbMoi]
    const dsSoCapNhat = dsSo.map((item) =>
      item.maSo === so.maSo ? { ...item, soVaoSoHienTai: soVaoSoMoi + 1 } : item,
    )

    setDsVanBang(dsVBMoiThem)
    setDsSo(dsSoCapNhat)
    luuDuLieu(dsTruongDong, dsVBMoiThem, dsSoCapNhat)
    message.success('Thêm văn bằng thành công')
    setMoModalVB(false)
    formVB.resetFields()
  }

  const cotsVB = [
    { title: 'Số Hiệu', dataIndex: 'soHieu', key: 'soHieu' },
    { title: 'Số Vào Sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày Sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Quyết Định',
      dataIndex: 'maQD_FK',
      key: 'maQD_FK',
      render: (soQD: string) => soQD,
    },
  ]

  const cotsTruong = [
    { title: 'Tên Trường', dataIndex: 'tenTruong', key: 'tenTruong' },
    { title: 'Kiểu Dữ Liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu' },
    {
      title: 'Hành Động',
      key: 'hanhDong',
      render: (text: any, record: TruongDong) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setDinhDangTruong(record)
              formTruong.setFieldsValue({
                tenTruong: record.tenTruong,
                kieuDuLieu: record.kieuDuLieu,
              })
              setMoModalTruong(true)
            }}
          />
          <Popconfirm
            title="Xóa trường này?"
            onConfirm={() => xoaTruong(record.id)}
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
      <Tabs.TabPane tab="Cấu Hình Biểu Mẫu" key="1">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setDinhDangTruong(null)
            formTruong.resetFields()
            setMoModalTruong(true)
          }}
          style={{ marginBottom: 16 }}
        >
          Thêm Trường
        </Button>
        <Table
          dataSource={dsTruongDong}
          columns={cotsTruong}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={dinhDangTruong ? 'Sửa Trường' : 'Thêm Trường'}
          visible={moModalTruong}
          onOk={() => formTruong.submit()}
          onCancel={() => setMoModalTruong(false)}
        >
          <Form
            form={formTruong}
            layout="vertical"
            onFinish={dinhDangTruong ? suaTruong : themTruong}
          >
            <Form.Item
              name="tenTruong"
              label="Tên Trường"
              rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="kieuDuLieu"
              label="Kiểu Dữ Liệu"
              rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
            >
              <Select placeholder="-- Chọn Kiểu --">
                <Select.Option value="String">String</Select.Option>
                <Select.Option value="Number">Number</Select.Option>
                <Select.Option value="Date">Date</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Nhập Văn Bằng" key="2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            formVB.resetFields()
            setMoModalVB(true)
          }}
          style={{ marginBottom: 16 }}
        >
          Nhập Văn Bằng
        </Button>
        <Table
          dataSource={dsVanBang}
          columns={cotsVB}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Nhập Văn Bằng"
          visible={moModalVB}
          onOk={() => formVB.submit()}
          onCancel={() => setMoModalVB(false)}
        >
          <Form form={formVB} layout="vertical" onFinish={themVanBang}>
            <Form.Item name="soVaoSo" label="Số Vào Sổ">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="soHieu"
              label="Số Hiệu"
              rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="maSV"
              label="Mã SV"
              rules={[{ required: true, message: 'Vui lòng nhập mã SV' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="hoTen"
              label="Họ Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ngaySinh"
              label="Ngày Sinh"
              rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="maQD_FK"
              label="Chọn Quyết Định"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
            >
              <Select placeholder="-- Chọn QĐ --">
                {dsQD.map((qd) => (
                  <Select.Option key={qd.soQD} value={qd.soQD}>
                    {qd.soQD}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {dsTruongDong.map((truong) => (
              <Form.Item key={truong.id} name={`truongDong_${truong.id}`} label={truong.tenTruong}>
                {truong.kieuDuLieu === 'Number' ? (
                  <InputNumber />
                ) : truong.kieuDuLieu === 'Date' ? (
                  <Input type="date" />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default CauHinhVaNhapBang