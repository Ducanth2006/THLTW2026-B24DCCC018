import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Button, Modal, notification } from 'antd'

interface VanBang {
  id: number
  soHieu: string
  soVaoSo: number
  maSV: string
  hoTen: string
  ngaySinh: string
  maQD_FK: string
  [key: string]: any // Cho phép chứa các trường động
}

interface QuyetDinh {
  soQD: string
  ngayQD: string
  trichYeu: string
  maSo_FK: number
  tongLuotTraCuu: number
}

const TraCuu = () => {
  const [dsVanBang, setDsVanBang] = useState<VanBang[]>([])
  const [dsQD, setDsQD] = useState<QuyetDinh[]>([])
  const [dsTruongDong, setDsTruongDong] = useState<any[]>([]) // Thêm state để kéo cấu hình về
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState<VanBang[]>([])
  const [moModalChiTiet, setMoModalChiTiet] = useState(false)
  const [chiTietVB, setChiTietVB] = useState<VanBang | null>(null)
  
  const [soHieu, setSoHieu] = useState('')
  const [soVaoSo, setSoVaoSo] = useState('')
  const [maSV, setMaSV] = useState('')
  const [hoTen, setHoTen] = useState('')
  const [ngaySinh, setNgaySinh] = useState('')

  useEffect(() => {
    layDuLieu()
  }, [])

  const layDuLieu = () => {
    const vb = localStorage.getItem('dsVanBang')
    const qd = localStorage.getItem('dsQD')
    const truong = localStorage.getItem('dsTruongDong') // Kéo cấu hình trường động lên
    
    if (vb) setDsVanBang(JSON.parse(vb))
    if (qd) setDsQD(JSON.parse(qd))
    if (truong) setDsTruongDong(JSON.parse(truong))
  }

  const kiemTraDieuKien = () => {
    let soTruongDaInput = 0
    if (soHieu) soTruongDaInput++
    if (soVaoSo) soTruongDaInput++
    if (maSV) soTruongDaInput++
    if (hoTen) soTruongDaInput++
    if (ngaySinh) soTruongDaInput++

    if (soTruongDaInput < 2) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập ít nhất 2 trường để tìm kiếm',
      })
      return false
    }
    return true
  }

  const timKiem = () => {
    if (!kiemTraDieuKien()) return

    const ketQua = []
    for (let i = 0; i < dsVanBang.length; i++) {
      const vb = dsVanBang[i]
      let thoaMan = true // Đổi thành logic AND (Phải đúng tất cả các trường đã nhập)

      if (soHieu && !vb.soHieu.includes(soHieu)) thoaMan = false
      if (soVaoSo && vb.soVaoSo.toString() !== soVaoSo) thoaMan = false
      if (maSV && !vb.maSV.includes(maSV)) thoaMan = false
      if (hoTen && !vb.hoTen.includes(hoTen)) thoaMan = false
      if (ngaySinh && vb.ngaySinh !== ngaySinh) thoaMan = false

      if (thoaMan) {
        ketQua.push(vb)
      }
    }
    setKetQuaTraCuu(ketQua)
  }

  const xemChiTiet = (vb: VanBang) => {
    setChiTietVB(vb)
    setMoModalChiTiet(true)

    const qdIndex = dsQD.findIndex((q) => q.soQD === vb.maQD_FK)
    if (qdIndex >= 0) {
      const dsQDCapNhat = [...dsQD]
      dsQDCapNhat[qdIndex].tongLuotTraCuu += 1
      setDsQD(dsQDCapNhat)
      localStorage.setItem('dsQD', JSON.stringify(dsQDCapNhat))
    }
  }

  const cots = [
    { title: 'Số Hiệu', dataIndex: 'soHieu', key: 'soHieu' },
    { title: 'Số Vào Sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày Sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Hành Động',
      key: 'hanhDong',
      render: (text: any, record: VanBang) => (
        <Button size="small" type="primary" onClick={() => xemChiTiet(record)}>
          Xem Chi Tiết
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ background: '#f5f5f5', padding: 16, marginBottom: 16, borderRadius: 4 }}>
        <Form layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Số Hiệu">
              <Input value={soHieu} onChange={(e) => setSoHieu(e.target.value)} />
            </Form.Item>
            <Form.Item label="Số Vào Sổ">
              <Input value={soVaoSo} onChange={(e) => setSoVaoSo(e.target.value)} />
            </Form.Item>
            <Form.Item label="Mã SV">
              <Input value={maSV} onChange={(e) => setMaSV(e.target.value)} />
            </Form.Item>
            <Form.Item label="Họ Tên">
              <Input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
            </Form.Item>
            <Form.Item label="Ngày Sinh">
              <Input type="date" value={ngaySinh} onChange={(e) => setNgaySinh(e.target.value)} />
            </Form.Item>
          </div>
          <Button type="primary" onClick={timKiem}>
            Tìm Kiếm
          </Button>
        </Form>
      </div>

      <Table
        dataSource={ketQuaTraCuu}
        columns={cots}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chi Tiết Văn Bằng"
        visible={moModalChiTiet}
        onCancel={() => setMoModalChiTiet(false)}
        footer={null}
      >
        {chiTietVB && (
          <div>
            <p><strong>Số Hiệu:</strong> {chiTietVB.soHieu}</p>
            <p><strong>Số Vào Sổ:</strong> {chiTietVB.soVaoSo}</p>
            <p><strong>Mã SV:</strong> {chiTietVB.maSV}</p>
            <p><strong>Họ Tên:</strong> {chiTietVB.hoTen}</p>
            <p><strong>Ngày Sinh:</strong> {chiTietVB.ngaySinh}</p>
            <p><strong>Quyết Định:</strong> {chiTietVB.maQD_FK}</p>
            
            
            {dsTruongDong.map((truong) => (
              <p key={truong.id}>
                <strong>{truong.tenTruong}:</strong> {chiTietVB[`truongDong_${truong.id}`] || 'Không có dữ liệu'}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TraCuu