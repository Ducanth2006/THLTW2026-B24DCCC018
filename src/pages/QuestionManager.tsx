import { useState, useEffect } from 'react'
import {
  Tabs,
  Table,
  Select,
  Button,
  InputNumber,
  message,
  Form,
  Modal,
  Input,
  Popconfirm,
} from 'antd'
import { subjects as initialSubjects, blocks as initialBlocks, questions as initialQuestions, Subject, Question, KnowledgeBlock } from './ExamData'

const { TabPane } = Tabs
const { Option } = Select

export default function QuestionManager() {
  const [dsCauHoi, setDsCauHoi] = useState<Question[]>([])
  const [locMon, setLocMon] = useState<string | undefined>()
  const [locMuc, setLocMuc] = useState<string | undefined>()
  const [locBlock, setLocBlock] = useState<string | undefined>()
  const [monHocDaChon, setMonHocDaChon] = useState<string | undefined>()
  const [soDe, setSoDe] = useState<{ [blockId: string]: { [level: string]: number } }>({})
  const [dsDeThiDaLuu, setDsDeThiDaLuu] = useState<
    { id: string; subjectId: string; structure: { [blockId: string]: { [level: string]: number } }; items: Question[] }[]
  >([])

  const [dsCauTrucDaLuu, setDsCauTrucDaLuu] = useState<
    { id: string; name: string; structure: { [blockId: string]: { [level: string]: number } } }[]
  >([])

  const [isLuuCauTrucVisible, setIsLuuCauTrucVisible] = useState(false)
  const [tenCauTruc, setTenCauTruc] = useState('')

  const [isChinhSuaDeThiVisible, setIsChinhSuaDeThiVisible] = useState(false)
  const [deThiDangChinhSua, setDeThiDangChinhSua] = useState<{ id: string; subjectId: string; structure: { [blockId: string]: { [level: string]: number } }; items: Question[] } | null>(null)
  const [soDeDangChinhSua, setEditSoDe] = useState<{ [blockId: string]: { [level: string]: number } }>({})


  const [dsBlocks, setDsBlocks] = useState<KnowledgeBlock[]>(initialBlocks)
  const [dsSubjects, setDsSubjects] = useState<Subject[]>(initialSubjects)
  const [dsQuestions, setDsQuestions] = useState<Question[]>(initialQuestions)

  const [isKhoiModalVisible, setIsKhoiModalVisible] = useState(false)
  const [khoiDangChinhSua, setKhoiDangChinhSua] = useState<KnowledgeBlock | null>(null)
  const [khoi, setKhoi] = useState({ id: '', name: '' })

  const [isMonModalVisible, setIsMonModalVisible] = useState(false)
  const [monDangChinhSua, setMonDangChinhSua] = useState<Subject | null>(null)
  const [mon, setMon] = useState({ id: '', code: '', name: '', credit: 0 })

  const [isCauHoiModalVisible, setIsCauHoiModalVisible] = useState(false)
  const [cauHoiDangChinhSua, setCauHoiDangChinhSua] = useState<Question | null>(null)
  const [cauHoi, setCauHoi] = useState({ id: '', subjectId: '', blockId: '', level: 'De' as 'De' | 'TB' | 'Kho' | 'Rat kho', text: '' })

  useEffect(() => {
    setDsCauHoi(dsQuestions)
  }, [dsQuestions])

  useEffect(() => {
    const newSoDe: { [blockId: string]: { [level: string]: number } } = {}
    dsBlocks.forEach((b) => {
      newSoDe[b.id] = { Dễ: 0, TB: 0, Khó: 0, 'Rất khó': 0 }
    })
    setSoDe(newSoDe)
  }, [dsBlocks])

  const handleLoc = () => {
    let ds = dsQuestions
    if (locMon) ds = ds.filter((q) => q.subjectId === locMon)
    if (locMuc) ds = ds.filter((q) => q.level === locMuc)
    if (locBlock) ds = ds.filter((q) => q.blockId === locBlock)
    setDsCauHoi(ds)
  }

  useEffect(() => {
    handleLoc()
  }, [locMon, locMuc, locBlock, dsQuestions])

  const moKhoiModal = (k?: KnowledgeBlock) => {
    if (k) {
      setKhoiDangChinhSua(k)
      setKhoi({ id: k.id, name: k.name })
    } else {
      setKhoiDangChinhSua(null)
      setKhoi({ id: '', name: '' })
    }
    setIsKhoiModalVisible(true)
  }

  const luuKhoi = () => {
    if (!khoi.id || !khoi.name) {
      message.error('Điền đầy đủ thông tin')
      return
    }
    if (khoiDangChinhSua) {
      setDsBlocks(dsBlocks.map(b => b.id === khoiDangChinhSua.id ? { ...b, ...khoi } : b))
      message.success('Cập nhật thành công')
    } else {
      if (dsBlocks.some(b => b.id === khoi.id)) {
        message.error('Mã khối đã tồn tại')
        return
      }
      setDsBlocks([...dsBlocks, khoi])
      message.success('Thêm thành công')
    }
    setIsKhoiModalVisible(false)
  }

  const xoaKhoi = (id: string) => {
    setDsBlocks(dsBlocks.filter(b => b.id !== id))
    message.success('Xóa thành công')
  }

  const moMonModal = (m?: Subject) => {
    if (m) {
      setMonDangChinhSua(m)
      setMon({ id: m.id, code: m.code, name: m.name, credit: m.credit })
    } else {
      setMonDangChinhSua(null)
      setMon({ id: '', code: '', name: '', credit: 0 })
    }
    setIsMonModalVisible(true)
  }

  const luuMon = () => {
    if (!mon.id || !mon.code || !mon.name || mon.credit <= 0) {
      message.error('Điền đầy đủ thông tin')
      return
    }
    if (monDangChinhSua) {
      setDsSubjects(dsSubjects.map(s => s.id === monDangChinhSua.id ? { ...s, ...mon } : s))
      message.success('Cập nhật thành công')
    } else {
      if (dsSubjects.some(s => s.id === mon.id)) {
        message.error('Mã môn đã tồn tại')
        return
      }
      setDsSubjects([...dsSubjects, mon])
      message.success('Thêm thành công')
    }
    setIsMonModalVisible(false)
  }

  const xoaMon = (id: string) => {
    setDsSubjects(dsSubjects.filter(s => s.id !== id))
    message.success('Xóa thành công')
  }

  const moCauHoiModal = (question?: Question) => {
    if (question) {
      setCauHoiDangChinhSua(question)
      setCauHoi({ id: question.id, subjectId: question.subjectId, blockId: question.blockId, level: question.level, text: question.text })
    } else {
      setCauHoiDangChinhSua(null)
      setCauHoi({ id: '', subjectId: '', blockId: '', level: 'Dễ', text: '' })
    }
    setIsCauHoiModalVisible(true)
  }

  const luuCauHoi = () => {
    if (!cauHoi.id || !cauHoi.subjectId || !cauHoi.blockId || !cauHoi.text) {
      message.error('Điền đầy đủ thông tin')
      return
    }
    if (cauHoiDangChinhSua) {
      setDsQuestions(dsQuestions.map(q => q.id === cauHoiDangChinhSua?.id ? { ...q, ...cauHoi } : q))
      message.success('Cập nhật thành công')
    } else {
      if (dsQuestions.some(q => q.id === cauHoi.id)) {
        message.error('Mã câu hỏi đã tồn tại')
        return
      }
      setDsQuestions([...dsQuestions, cauHoi])
      message.success('Thêm thành công')
    }
    setIsCauHoiModalVisible(false)
  }

  const xoaCauHoi = (id: string) => {
    setDsQuestions(dsQuestions.filter(q => q.id !== id))
    message.success('Xóa thành công')
  }

  const taoDeThi = () => {
    if (!monHocDaChon) {
      message.error('Chọn môn học')
      return
    }
    const dsTheoMon = dsQuestions.filter(
      (q) => q.subjectId === monHocDaChon,
    )
    const sinhNgauNhien = (arr: Question[], n: number) => {
      const copy = [...arr]
      const k: Question[] = []
      for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length)
        k.push(copy.splice(idx, 1)[0])
      }
      return k
    }
    const tapChon: Question[] = []
    for (const block of dsBlocks) {
      for (const level of ['Dễ', 'TB', 'Khó', 'Rất khó'] as const) {
        const so = soDe[block.id]?.[level] || 0
        const dsLevel = dsTheoMon.filter(
          (q) => q.level === level && q.blockId === block.id,
        )
        if (dsLevel.length < so) {
          message.error(`Không đủ câu ${level} ở khối ${block.name}`)
          return
        }
        tapChon.push(...sinhNgauNhien(dsLevel, so))
      }
    }
    setDsDeThiDaLuu((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        subjectId: monHocDaChon,
        structure: soDe,
        items: tapChon,
      },
    ])
    message.success('Tạo đề thành công')
  }

  const luuCauTruc = () => {
    if (!tenCauTruc) {
      message.error('Nhập tên cấu trúc')
      return
    }
    setDsCauTrucDaLuu((prev) => [
      ...prev,
      { id: Date.now().toString(), name: tenCauTruc, structure: soDe },
    ])
    setIsLuuCauTrucVisible(false)
    setTenCauTruc('')
    message.success('Lưu cấu trúc thành công')
  }

  const taiCauTruc = (structure: { [blockId: string]: { [level: string]: number } }) => {
    setSoDe(structure)
    message.success('Đã tải cấu trúc')
  }

  const moChinhSua = (exam: { id: string; subjectId: string; structure: { [blockId: string]: { [level: string]: number } }; items: Question[] }) => {
    setDeThiDangChinhSua(exam)
    setEditSoDe(exam.structure)
    setIsChinhSuaDeThiVisible(true)
  }

  const luuDeThiChinhSua = () => {
    if (!deThiDangChinhSua) return
    const dsTheoMon = dsQuestions.filter((q) => q.subjectId === deThiDangChinhSua.subjectId)
    const sinhNgauNhien = (arr: Question[], n: number) => {
      const copy = [...arr]
      const k: Question[] = []
      for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length)
        k.push(copy.splice(idx, 1)[0])
      }
      return k
    }
    const tapChon: Question[] = []
    for (const block of dsBlocks) {
      for (const level of ['Dễ', 'TB', 'Khó', 'Rất khó'] as const) {
        const so = soDeDangChinhSua[block.id]?.[level] || 0
        const dsLevel = dsTheoMon.filter((q) => q.level === level && q.blockId === block.id)
        if (dsLevel.length < so) {
          message.error(`Không đủ câu ${level} ở khối ${block.name}`)
          return
        }
        tapChon.push(...sinhNgauNhien(dsLevel, so))
      }
    }
    setDsDeThiDaLuu((prev) =>
      prev.map((e) =>
        e.id === deThiDangChinhSua.id ? { ...e, structure: soDeDangChinhSua, items: tapChon } : e
      )
    )
    setIsChinhSuaDeThiVisible(false)
    setDeThiDangChinhSua(null)
    message.success('Cập nhật đề thi thành công')
  }

  const columnsCauHoi = [
    { title: 'Mã', dataIndex: 'id' },
    {
      title: 'Môn',
      dataIndex: 'subjectId',
      render: (id: string) => dsSubjects.find((s) => s.id === id)?.name,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'blockId',
      render: (id: string) => dsBlocks.find((b) => b.id === id)?.name,
    },
    { title: 'Mức độ', dataIndex: 'level' },
    { title: 'Nội dung', dataIndex: 'text' },
    {
      title: 'Hành động',
      render: (record: Question) => (
        <>
          <Button type="link" onClick={() => moCauHoiModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => xoaCauHoi(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const columnsDeThi = [
    { title: 'Mã đề', dataIndex: 'id' },
    {
      title: 'Môn',
      dataIndex: 'subjectId',
      render: (id: string) => dsSubjects.find((s) => s.id === id)?.name,
    },
    {
      title: 'Cấu trúc',
      dataIndex: 'structure',
      render: (str: any) => {
        if (!str) return ''
        return Object.entries(str)
          .map(
            ([blk, lv]) =>
              `${dsBlocks.find((b) => b.id === blk)?.name || blk}: ` +
              Object.entries(lv as { [level: string]: number })
                .map(([l, n]) => `${l}=${n}`)
                .join(', '),
          )
          .join(' | ')
      },
    },
    {
      title: 'Số câu',
      dataIndex: 'items',
      render: (items: Question[]) => items.length,
    },
  ]

  return (
    <>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Danh mục &amp; Môn học" key="1">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => moKhoiModal()}>Thêm khối</Button>
        </div>
        <Table
          dataSource={dsBlocks.map((b) => ({ key: b.id, ...b }))}
          columns={[
            { title: 'Mã', dataIndex: 'id' },
            { title: 'Tên khối', dataIndex: 'name' },
            {
              title: 'Hành động',
              render: (record: KnowledgeBlock) => (
                <>
                  <Button type="link" onClick={() => moKhoiModal(record)}>Sửa</Button>
                  <Popconfirm title="Xóa khối này?" onConfirm={() => xoaKhoi(record.id)}>
                    <Button type="link" danger>Xóa</Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          pagination={false}
          style={{ marginBottom: 24 }}
        />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => moMonModal()}>Thêm môn</Button>
        </div>
        <Table
          dataSource={dsSubjects.map((s) => ({ key: s.id, ...s }))}
          columns={[
            { title: 'Mã', dataIndex: 'id' },
            { title: 'Mã môn', dataIndex: 'code' },
            { title: 'Tên môn', dataIndex: 'name' },
            { title: 'TC', dataIndex: 'credit' },
            {
              title: 'Hành động',
              render: (record: Subject) => (
                <>
                  <Button type="link" onClick={() => moMonModal(record)}>Sửa</Button>
                  <Popconfirm title="Xóa môn này?" onConfirm={() => xoaMon(record.id)}>
                    <Button type="link" danger>Xóa</Button>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          pagination={false}
        />
      </TabPane>
      <TabPane tab="Ngân hàng câu hỏi" key="2">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => moCauHoiModal()}>Thêm câu hỏi</Button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="Chọn môn"
            style={{ width: 120, marginRight: 8 }}
            allowClear
            onChange={(v) => setLocMon(v)}
          >
            {dsSubjects.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Mức độ"
            style={{ width: 120, marginRight: 8 }}
            allowClear
            onChange={(v) => setLocMuc(v)}
          >
            {['Dễ', 'TB', 'Khó', 'Rất khó'].map((l) => (
              <Option key={l} value={l}>
                {l}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Khối"
            style={{ width: 120 }}
            allowClear
            onChange={(v) => setLocBlock(v)}
          >
            {dsBlocks.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          dataSource={dsCauHoi.map((q) => ({ key: q.id, ...q }))}
          columns={columnsCauHoi}
          pagination={false}
        />
      </TabPane>
      <TabPane tab="Tạo đề thi tự động" key="3">
        <div style={{ marginBottom: 16 }}>
          <Button onClick={() => setIsLuuCauTrucVisible(true)}>Lưu cấu trúc</Button>
          <Select
            placeholder="Tải cấu trúc"
            style={{ width: 200, marginLeft: 8 }}
            onChange={(value) => {
              const struc = dsCauTrucDaLuu.find(s => s.id === value)
              if (struc) taiCauTruc(struc.structure)
            }}
          >
            {dsCauTrucDaLuu.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </div>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="Môn">
            <Select
              style={{ width: 160 }}
              onChange={(v) => setMonHocDaChon(v)}
            >
              {dsSubjects.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {dsBlocks.map((b) => (
            <div key={b.id} style={{ marginBottom: 8 }}>
              <strong>{b.name}</strong>
              {(['Dễ', 'TB', 'Khó', 'Rất khó'] as const).map((l) => (
                <Form.Item label={l} key={l + b.id} style={{ margin: 0 }}>
                  <InputNumber
                    min={0}
                    value={soDe[b.id]?.[l] || 0}
                    onChange={(v) =>
                      setSoDe((prev) => ({
                        ...prev,
                        [b.id]: { ...prev[b.id], [l]: v || 0 },
                      }))
                    }
                  />
                </Form.Item>
              ))}
            </div>
          ))}
          <Form.Item>
            <Button type="primary" onClick={taoDeThi}>
              Tạo đề
            </Button>
          </Form.Item>
        </Form>
        <Table
          dataSource={dsDeThiDaLuu.map((d) => ({ key: d.id, ...d }))}
          columns={[
            ...columnsDeThi,
            {
              title: 'Hành động',
              render: (record: any) => (
                <Button type="link" onClick={() => moChinhSua(record)}>
                  Chỉnh sửa
                </Button>
              ),
            },
          ]}
          pagination={false}
        />
      </TabPane>
    </Tabs>

    <div>
    <Modal
      title={khoiDangChinhSua ? 'Sua khoi' : 'Them khoi'}
      visible={isKhoiModalVisible}
      onOk={luuKhoi}
      onCancel={() => setIsKhoiModalVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item label="Ma khoi">
          <Input
            value={khoi.id}
            onChange={(e) => setKhoi({ ...khoi, id: e.target.value })}
            disabled={!!khoiDangChinhSua}
          />
        </Form.Item>
        <Form.Item label="Ten khoi">
          <Input
            value={khoi.name}
            onChange={(e) => setKhoi({ ...khoi, name: e.target.value })}
          />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      title={monDangChinhSua ? 'Sua mon' : 'Them mon'}
      visible={isMonModalVisible}
      onOk={luuMon}
      onCancel={() => setIsMonModalVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item label="Ma mon">
          <Input
            value={mon.id}
            onChange={(e) => setMon({ ...mon, id: e.target.value })}
            disabled={!!monDangChinhSua}
          />
        </Form.Item>
        <Form.Item label="Ma hoc phan">
          <Input
            value={mon.code}
            onChange={(e) => setMon({ ...mon, code: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Ten mon">
          <Input
            value={mon.name}
            onChange={(e) => setMon({ ...mon, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="So tin chi">
          <InputNumber
            min={1}
            value={mon.credit}
            onChange={(v) => setMon({ ...mon, credit: v || 0 })}
          />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      title={cauHoiDangChinhSua ? 'Sua cau hoi' : 'Them cau hoi'}
      visible={isCauHoiModalVisible}
      onOk={luuCauHoi}
      onCancel={() => setIsCauHoiModalVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item label="Ma cau hoi">
          <Input
            value={cauHoi.id}
            onChange={(e) => setCauHoi({ ...cauHoi, id: e.target.value })}
            disabled={!!cauHoiDangChinhSua}
          />
        </Form.Item>
        <Form.Item label="Mon hoc">
          <Select
            value={cauHoi.subjectId}
            onChange={(v) => setCauHoi({ ...cauHoi, subjectId: v })}
          >
            {dsSubjects.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Khoi kien thuc">
          <Select
            value={cauHoi.blockId}
            onChange={(v) => setCauHoi({ ...cauHoi, blockId: v })}
          >
            {dsBlocks.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Muc do">
          <Select
            value={cauHoi.level}
            onChange={(v) => setCauHoi({ ...cauHoi, level: v })}
          >
            {['Dễ', 'TB', 'Khó', 'Rất khó'].map((l) => (
              <Option key={l} value={l}>
                {l}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Noi dung cau hoi">
          <Input.TextArea
            value={cauHoi.text}
            onChange={(e) => setCauHoi({ ...cauHoi, text: e.target.value })}
          />
        </Form.Item>
      </Form>
    </Modal>
    </div>

    <Modal
      title="Lưu cấu trúc đề thi"
      visible={isLuuCauTrucVisible}
      onOk={luuCauTruc}
      onCancel={() => setIsLuuCauTrucVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item label="Ten cau truc">
          <Input
            value={tenCauTruc}
            onChange={(e) => setTenCauTruc(e.target.value)}
            placeholder="Nhap ten cau truc"
          />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      title="Chinh sua de thi"
      visible={isChinhSuaDeThiVisible}
      onOk={luuDeThiChinhSua}
      onCancel={() => setIsChinhSuaDeThiVisible(false)}
    >
      <Form layout="vertical">
        <Form.Item label="Mon hoc">
          <Select value={deThiDangChinhSua?.subjectId} disabled>
            {dsSubjects.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {dsBlocks.map((b) => (
          <div key={b.id} style={{ marginBottom: 8 }}>
            <strong>{b.name}</strong>
            {(['Dễ', 'TB', 'Khó', 'Rất khó'] as const).map((l) => (
              <Form.Item label={l} key={l + b.id} style={{ margin: 0 }}>
                <InputNumber
                  min={0}
                  value={soDeDangChinhSua[b.id]?.[l] || 0}
                  onChange={(v) =>
                    setEditSoDe((prev) => ({
                      ...prev,
                      [b.id]: { ...prev[b.id], [l]: v || 0 },
                    }))
                  }
                />
              </Form.Item>
            ))}
          </div>
        ))}
      </Form>
    </Modal>
    </>
  )
}
