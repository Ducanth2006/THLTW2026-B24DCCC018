import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Tabs,
  Space,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface MonHoc {
  id: number;
  tenMon: string;
}

interface TienDo {
  id: number;
  monHoc: string;
  ngayHoc: string;
  thoiLuong: number;
  noiDung: string;
  ghiChu: string;
}

export default function QuanLyTienDoHocTap() {
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [dsTienDo, setDsTienDo] = useState<TienDo[]>([]);
  const [mucTieuThang, setMucTieuThang] = useState<any>({});
  const [tempData, setTempData] = useState<any>(null); // bien tam

  const [isModalMonHocOpen, setIsModalMonHocOpen] = useState(false);
  const [isModalTienDoOpen, setIsModalTienDoOpen] = useState(false);
  const [editingMonId, setEditingMonId] = useState<number | null>(null);
  const [editingTienDoId, setEditingTienDoId] = useState<number | null>(null);
  const [formMonHoc] = Form.useForm();
  const [formTienDo] = Form.useForm();
  const [formMucTieu] = Form.useForm();

  // load data tu local storage khi load trang
  useEffect(() => {
    const savedMonHoc = localStorage.getItem('monHocList');
    const savedTienDo = localStorage.getItem('dsTienDo');
    const savedMucTieu = localStorage.getItem('mucTieuThang');

    if (savedMonHoc) {
      setMonHocList(JSON.parse(savedMonHoc));
    } else {
      // init data mac dinh
      const defaultMonHoc: MonHoc[] = [
        { id: 1, tenMon: 'Toán rời rạc 1' },
        { id: 2, tenMon: 'DSA' },
        { id: 3, tenMon: 'OOP' },
        { id: 4, tenMon: 'Thực hành lập trình web' },
        { id: 5, tenMon: 'Triết học' },
        { id: 6, tenMon: 'Đại số' },
      ];
      setMonHocList(defaultMonHoc);
      localStorage.setItem('monHocList', JSON.stringify(defaultMonHoc));
    }

    if (savedTienDo) {
      setDsTienDo(JSON.parse(savedTienDo));
    }

    if (savedMucTieu) {
      setMucTieuThang(JSON.parse(savedMucTieu));
    }
  }, []);

  // MON HOC TAB
  const handleAddMonHoc = () => {
    setEditingMonId(null);
    formMonHoc.resetFields();
    setIsModalMonHocOpen(true);
  };

  const handleEditMonHoc = (record: any) => {
    setEditingMonId(record.id);
    formMonHoc.setFieldsValue({ tenMon: record.tenMon });
    setIsModalMonHocOpen(true);
  };

  const handleDeleteMonHoc = (id: number) => {
    const updated = monHocList.filter((m) => m.id !== id);
    setMonHocList(updated);
    localStorage.setItem('monHocList', JSON.stringify(updated));
    message.success('Đã xóa môn học');
  };

  const handleOkMonHoc = () => {
    formMonHoc.submit();
  };

  const onFinishMonHoc = (values: any) => {
    let updated;
    let idList = monHocList.map((m) => m.id);
    let maxId = 0;
    // tim id lon nhat
    for (let i = 0; i < idList.length; i++) {
      if (idList[i] > maxId) {
        maxId = idList[i];
      }
    }
    
    if (editingMonId) {
      updated = monHocList.map((m) => {
        if (m.id === editingMonId) {
          return { ...m, tenMon: values.tenMon };
        } else {
          return m;
        }
      });
    } else {
      const newId = maxId + 1;
      updated = [...monHocList, { id: newId, tenMon: values.tenMon }];
    }
    setMonHocList(updated);
    setTempData(updated);
    localStorage.setItem('monHocList', JSON.stringify(updated));
    setIsModalMonHocOpen(false);
    message.success('Lưu thành công');
  };

  const columnsMonHoc = [
    { title: 'Tên Môn', dataIndex: 'tenMon', key: 'tenMon' },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button onClick={() => handleEditMonHoc(record)}>
            Sửa
          </Button>
          <Button onClick={() => handleDeleteMonHoc(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // TIEN DO TAB
  const handleAddTienDo = () => {
    setEditingTienDoId(null);
    formTienDo.resetFields();
    setIsModalTienDoOpen(true);
  };

  const handleEditTienDo = (record: any) => {
    setEditingTienDoId(record.id);
    formTienDo.setFieldsValue({
      monHoc: record.monHoc,
      ngayHoc: dayjs(record.ngayHoc),
      thoiLuong: record.thoiLuong,
      noiDung: record.noiDung,
      ghiChu: record.ghiChu,
    });
    setIsModalTienDoOpen(true);
  };

  const handleDeleteTienDo = (id: number) => {
    const updated = dsTienDo.filter((t) => t.id !== id);
    setDsTienDo(updated);
    localStorage.setItem('dsTienDo', JSON.stringify(updated));
    message.success('Đã xóa');
  };

  const handleOkTienDo = () => {
    formTienDo.submit();
  };

  const onFinishTienDo = (values: any) => {
    let updated;
    let idList2 = dsTienDo.map((t) => t.id);
    let maxId2 = 0;
    for (let i = 0; i < idList2.length; i++) {
      if (idList2[i] > maxId2) {
        maxId2 = idList2[i];
      }
    }
    
    if (editingTienDoId) {
      updated = dsTienDo.map((t) => {
        if (t.id === editingTienDoId) {
          return {
            ...t,
            monHoc: values.monHoc,
            ngayHoc: values.ngayHoc.format('YYYY-MM-DD'),
            thoiLuong: values.thoiLuong,
            noiDung: values.noiDung,
            ghiChu: values.ghiChu,
          };
        } else {
          return t;
        }
      });
    } else {
      const newId = maxId2 + 1;
      updated = [
        ...dsTienDo,
        {
          id: newId,
          monHoc: values.monHoc,
          ngayHoc: values.ngayHoc.format('YYYY-MM-DD'),
          thoiLuong: values.thoiLuong,
          noiDung: values.noiDung,
          ghiChu: values.ghiChu,
        },
      ];
    }
    setDsTienDo(updated);
    setTempData(updated);
    localStorage.setItem('dsTienDo', JSON.stringify(updated));
    setIsModalTienDoOpen(false);
    message.success('Lưu thành công');
  };

  const columnsTienDo = [
    { title: 'Môn Học', dataIndex: 'monHoc', key: 'monHoc' },
    { title: 'Ngày Học', dataIndex: 'ngayHoc', key: 'ngayHoc' },
    { title: 'Thời Lượng (phút)', dataIndex: 'thoiLuong', key: 'thoiLuong' },
    { title: 'Nội Dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Ghi Chú', dataIndex: 'ghiChu', key: 'ghiChu' },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button onClick={() => handleEditTienDo(record)}>
            Sửa
          </Button>
          <Button onClick={() => handleDeleteTienDo(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // MUC TIEU TAB
  const onFinishMucTieu = (values: any) => {
    const newMucTieu: any = {};
    monHocList.forEach((mon) => {
      newMucTieu[mon.tenMon] = values[`target_${mon.id}`] || 0;
    });
    setMucTieuThang(newMucTieu);
    localStorage.setItem('mucTieuThang', JSON.stringify(newMucTieu));
    message.success('Lưu mục tiêu thành công');
  };

  // tinh tong gio hoc cho moi mon
  const tinhTongGioMonHoc = (tenMon: string) => {
    let tong = 0;
    for (let i = 0; i < dsTienDo.length; i++) {
      if (dsTienDo[i].monHoc === tenMon) {
        tong = tong + dsTienDo[i].thoiLuong;
      }
    }
    return tong;
  };

  return (
    <div>
      <div>
        <h2>Quản Lý Tiến Độ Học Tập</h2>
        <Tabs>
          <Tabs.TabPane tab="Môn Học" key="1">
            <div>
              <Button onClick={handleAddMonHoc}>
                Thêm Môn Học
              </Button>
              <Table columns={columnsMonHoc} dataSource={monHocList} rowKey="id" />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Tiến Độ" key="2">
            <div>
              <Button onClick={handleAddTienDo}>
                Thêm Tiến Độ
              </Button>
              <Table columns={columnsTienDo} dataSource={dsTienDo} rowKey="id" />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Mục Tiêu" key="3">
            <div>
              <div>
                <h3>Thiết Lập Mục Tiêu Tháng Này</h3>
                <Form form={formMucTieu} onFinish={onFinishMucTieu} layout="vertical">
                  {monHocList.map((mon) => (
                    <Form.Item
                      key={mon.id}
                      label={`${mon.tenMon} (giờ)`}
                      name={`target_${mon.id}`}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                  ))}
                  <Button htmlType="submit">
                    Lưu Mục Tiêu
                  </Button>
                </Form>
              </div>

              <div>
                <h3>Báo Cáo Tiến Độ</h3>
                {monHocList.map((mon) => {
                  const tongGio = tinhTongGioMonHoc(mon.tenMon) / 60;
                  const target = mucTieuThang[mon.tenMon] || 0;
                  const percent = target > 0 ? Math.round((tongGio / target) * 100) : 0;

                  return (
                    <div key={mon.id}>
                      <p>
                        {mon.tenMon}: {tongGio.toFixed(1)} / {target} giờ ({percent}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>

      <Modal
        title={editingMonId ? 'Sửa Môn Học' : 'Thêm Môn Học'}
        visible={isModalMonHocOpen}
        onOk={handleOkMonHoc}
        onCancel={() => setIsModalMonHocOpen(false)}
      >
        <Form form={formMonHoc} onFinish={onFinishMonHoc} layout="vertical">
          <Form.Item
            label="Tên Môn Học"
            name="tenMon"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingTienDoId ? 'Sửa Tiến Độ' : 'Thêm Tiến Độ'}
        visible={isModalTienDoOpen}
        onOk={handleOkTienDo}
        onCancel={() => setIsModalTienDoOpen(false)}
      >
        <Form form={formTienDo} onFinish={onFinishTienDo} layout="vertical">
          <Form.Item
            label="Môn Học"
            name="monHoc"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              {monHocList.map((mon) => (
                <Select.Option key={mon.id} value={mon.tenMon}>
                  {mon.tenMon}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày Học"
            name="ngayHoc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Thời Lượng (phút)"
            name="thoiLuong"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Nội Dung" name="noiDung">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Ghi Chú" name="ghiChu">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
