import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Tabs,
  Card,
  Space,
  Statistic,
  Row,
  Col,
  message,
  DatePicker,
  Popconfirm,
  Divider,
  List,
  Avatar,
  Typography
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// --- DỮ LIỆU MẪU & INTERFACE ---

interface SanPham {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface DonHang {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: { productId: number; productName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}

const sanPhamMau: SanPham[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const donHangMau: DonHang[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
];

// --- COMPONENT CHÍNH ---

const QuanLyCuaHang = () => {
  // --- STATE ---
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>([]);
  const [danhSachDonHang, setDanhSachDonHang] = useState<DonHang[]>([]);
  const [activeTab, setActiveTab] = useState<string>('san-pham');

  // State cho Sản phẩm
  const [modalSanPhamVisible, setModalSanPhamVisible] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState<SanPham | null>(null);
  const [filterSanPham, setFilterSanPham] = useState({ keyword: '', category: '', status: '' });
  const [formSanPham] = Form.useForm();

  // State cho Đơn hàng
  const [modalDonHangVisible, setModalDonHangVisible] = useState(false);
  const [modalChiTietDonHangVisible, setModalChiTietDonHangVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const [filterDonHang, setFilterDonHang] = useState<{ keyword: string; status: string; dateRange: any }>({
    keyword: '', status: '', dateRange: null
  });
  const [formDonHang] = Form.useForm();

  // --- LOCAL STORAGE & INIT ---
  useEffect(() => {
    const spStorage = localStorage.getItem('products');
    const dhStorage = localStorage.getItem('orders');

    if (spStorage) setDanhSachSanPham(JSON.parse(spStorage));
    else setDanhSachSanPham(sanPhamMau);

    if (dhStorage) setDanhSachDonHang(JSON.parse(dhStorage));
    else setDanhSachDonHang(donHangMau);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(danhSachSanPham));
  }, [danhSachSanPham]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(danhSachDonHang));
  }, [danhSachDonHang]);

  // --- LOGIC SẢN PHẨM ---

  const danhMucList = Array.from(new Set(danhSachSanPham.map(item => item.category)));

  const handleLuuSanPham = (values: any) => {
    if (editingSanPham) {
      // Sửa
      const dsMoi = danhSachSanPham.map(sp => sp.id === editingSanPham.id ? { ...sp, ...values, id: sp.id } : sp);
      setDanhSachSanPham(dsMoi);
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      // Thêm mới
      const newId = danhSachSanPham.length > 0 ? Math.max(...danhSachSanPham.map(s => s.id)) + 1 : 1;
      setDanhSachSanPham([...danhSachSanPham, { ...values, id: newId }]);
      message.success('Thêm sản phẩm thành công!');
    }
    setModalSanPhamVisible(false);
    formSanPham.resetFields();
    setEditingSanPham(null);
  };

  const filteredSanPham = danhSachSanPham.filter(item => {
    const matchName = item.name.toLowerCase().includes(filterSanPham.keyword.toLowerCase());
    const matchCategory = filterSanPham.category ? item.category === filterSanPham.category : true;
    let matchStatus = true;
    if (filterSanPham.status === 'con-hang') matchStatus = item.quantity > 10;
    if (filterSanPham.status === 'sap-het') matchStatus = item.quantity > 0 && item.quantity <= 10;
    if (filterSanPham.status === 'het-hang') matchStatus = item.quantity === 0;
    
    return matchName && matchCategory && matchStatus;
  });

  const columnsSanPham: TableProps<SanPham>['columns'] = [
    { title: 'STT', key: 'stt', render: (_, __, idx) => idx + 1, width: 60 },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    { 
      title: 'Giá', 
      dataIndex: 'price', 
      key: 'price', 
      render: (val) => val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      sorter: (a, b) => a.price - b.price
    },
    { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        if (record.quantity === 0) return <Tag color="red">Hết hàng</Tag>;
        if (record.quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
        return <Tag color="green">Còn hàng</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingSanPham(record);
            formSanPham.setFieldsValue(record);
            setModalSanPhamVisible(true);
          }} />
        </Space>
      )
    }
  ];

  // --- LOGIC ĐƠN HÀNG ---

  const handleTaoDonHang = (values: any) => {
    // values.products chứa mảng id sản phẩm. Cần mapping số lượng.
    // Vì Form.List phức tạp với người mới, ta dùng logic đơn giản:
    // Form trả về: { customerName, phone, address, items: [{productId, quantity}] }
    
    const { customerName, phone, address, items } = values;
    let total = 0;
    const productsInOrder: any[] = [];

    // Validation & Tính toán
    for (const item of items) {
      const product = danhSachSanPham.find(p => p.id === item.productId);
      if (!product) continue;
      
      if (item.quantity > product.quantity) {
        message.error(`Sản phẩm ${product.name} chỉ còn ${product.quantity} cái!`);
        return;
      }
      total += product.price * item.quantity;
      productsInOrder.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const newOrder: DonHang = {
      id: `DH${Date.now()}`, // Tạo mã đơn hàng đơn giản
      customerName,
      phone,
      address,
      products: productsInOrder,
      totalAmount: total,
      status: 'Chờ xử lý',
      createdAt: moment().format('YYYY-MM-DD')
    };

    setDanhSachDonHang([newOrder, ...danhSachDonHang]);
    message.success('Tạo đơn hàng thành công!');
    setModalDonHangVisible(false);
    formDonHang.resetFields();
  };

  const handleUpdateStatus = (orderId: string, newStatus: DonHang['status']) => {
    const orderIndex = danhSachDonHang.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const oldStatus = danhSachDonHang[orderIndex].status;
    if (oldStatus === newStatus) return;

    const currentOrder = danhSachDonHang[orderIndex];
    let newProductList = [...danhSachSanPham];

    // LOGIC KHO HÀNG (Theo yêu cầu BT)
    // 1. Chuyển sang "Hoàn thành" -> Trừ kho
    if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
      // Kiểm tra lại tồn kho lần nữa cho chắc chắn
      for (const item of currentOrder.products) {
        const prodIndex = newProductList.findIndex(p => p.id === item.productId);
        if (prodIndex !== -1) {
          if (newProductList[prodIndex].quantity < item.quantity) {
             message.error(`Không đủ hàng trong kho để hoàn thành đơn này! (${item.productName})`);
             return; // Dừng, không cập nhật status
          }
          newProductList[prodIndex] = {
            ...newProductList[prodIndex],
            quantity: newProductList[prodIndex].quantity - item.quantity
          };
        }
      }
      setDanhSachSanPham(newProductList);
    }

    // 2. Chuyển sang "Đã hủy" TỪ "Hoàn thành" -> Hoàn kho
    // (Nếu từ Chờ xử lý -> Hủy thì không cần hoàn vì chưa trừ)
    if (newStatus === 'Đã hủy' && oldStatus === 'Hoàn thành') {
      for (const item of currentOrder.products) {
        const prodIndex = newProductList.findIndex(p => p.id === item.productId);
        if (prodIndex !== -1) {
          newProductList[prodIndex] = {
            ...newProductList[prodIndex],
            quantity: newProductList[prodIndex].quantity + item.quantity
          };
        }
      }
      setDanhSachSanPham(newProductList);
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrders = [...danhSachDonHang];
    updatedOrders[orderIndex].status = newStatus;
    setDanhSachDonHang(updatedOrders);
    message.success(`Đã cập nhật trạng thái đơn hàng: ${newStatus}`);
  };

  const filteredDonHang = danhSachDonHang.filter(order => {
    const matchKeyword = 
      order.customerName.toLowerCase().includes(filterDonHang.keyword.toLowerCase()) ||
      order.id.toLowerCase().includes(filterDonHang.keyword.toLowerCase());
    
    const matchStatus = filterDonHang.status ? order.status === filterDonHang.status : true;
    
    let matchDate = true;
    if (filterDonHang.dateRange) {
      const orderDate = moment(order.createdAt);
      const start = filterDonHang.dateRange[0];
      const end = filterDonHang.dateRange[1];
      matchDate = orderDate.isBetween(start, end, 'day', '[]');
    }

    return matchKeyword && matchStatus && matchDate;
  });

  const columnsDonHang: TableProps<DonHang>['columns'] = [
    { title: 'Mã ĐH', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { 
      title: 'Số SP', 
      key: 'count', 
      render: (_, r) => r.products.reduce((acc, cur) => acc + cur.quantity, 0) 
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (val) => <Text strong type="danger">{val.toLocaleString('vi-VN')} đ</Text>
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix() },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select 
          value={status} 
          style={{ width: 130 }}
          onChange={(val) => handleUpdateStatus(record.id, val)}
          // Không cho sửa nếu đã hủy
          disabled={status === 'Đã hủy' && false} 
        >
          <Option value="Chờ xử lý">Chờ xử lý</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => { setSelectedOrder(record); setModalChiTietDonHangVisible(true); }}>
          Chi tiết
        </Button>
      )
    }
  ];

  // --- LOGIC THỐNG KÊ ---
  const stats = useMemo(() => {
    const totalProducts = danhSachSanPham.length;
    const totalStockValue = danhSachSanPham.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const totalOrders = danhSachDonHang.length;
    const revenue = danhSachDonHang
      .filter(o => o.status === 'Hoàn thành')
      .reduce((acc, o) => acc + o.totalAmount, 0);
    
    const ordersByStatus = {
      pending: danhSachDonHang.filter(o => o.status === 'Chờ xử lý').length,
      shipping: danhSachDonHang.filter(o => o.status === 'Đang giao').length,
      completed: danhSachDonHang.filter(o => o.status === 'Hoàn thành').length,
      cancelled: danhSachDonHang.filter(o => o.status === 'Đã hủy').length,
    };

    return { totalProducts, totalStockValue, totalOrders, revenue, ordersByStatus };
  }, [danhSachSanPham, danhSachDonHang]);


  // --- RENDER GIAO DIỆN ---

  const renderDashboard = () => (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card><Statistic title="Tổng sản phẩm" value={stats.totalProducts} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Giá trị kho" value={stats.totalStockValue} precision={0} suffix="đ" prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Tổng đơn hàng" value={stats.totalOrders} prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Doanh thu thực tế" value={stats.revenue} precision={0} suffix="đ" valueStyle={{ color: '#3f8600' }} prefix={<BarChartOutlined />} /></Card>
        </Col>
      </Row>
      <Divider orientation="left">Trạng thái đơn hàng</Divider>
      <Row gutter={16} style={{ textAlign: 'center' }}>
        <Col span={6}><Tag color="blue" style={{ fontSize: 16, padding: 10 }}>Chờ xử lý: {stats.ordersByStatus.pending}</Tag></Col>
        <Col span={6}><Tag color="cyan" style={{ fontSize: 16, padding: 10 }}>Đang giao: {stats.ordersByStatus.shipping}</Tag></Col>
        <Col span={6}><Tag color="green" style={{ fontSize: 16, padding: 10 }}>Hoàn thành: {stats.ordersByStatus.completed}</Tag></Col>
        <Col span={6}><Tag color="red" style={{ fontSize: 16, padding: 10 }}>Đã hủy: {stats.ordersByStatus.cancelled}</Tag></Col>
      </Row>
    </div>
  );

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        type="card"
        size="large"
        tabBarStyle={{ marginBottom: 0 }}
      >
        <Tabs.TabPane tab={<span><BarChartOutlined /> Thống kê</span>} key="dashboard">
          {renderDashboard()}
        </Tabs.TabPane>

        <Tabs.TabPane tab={<span><AppstoreOutlined /> Quản lý Sản phẩm</span>} key="san-pham">
          <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }} wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingSanPham(null); setModalSanPhamVisible(true); }}>
                Thêm sản phẩm
              </Button>
              <Input 
                placeholder="Tìm tên sản phẩm..." 
                prefix={<SearchOutlined />} 
                onChange={e => setFilterSanPham({ ...filterSanPham, keyword: e.target.value })} 
                style={{ width: 200 }}
              />
              <Select 
                placeholder="Lọc theo Danh mục" 
                style={{ width: 150 }} 
                allowClear 
                onChange={val => setFilterSanPham({ ...filterSanPham, category: val })}
              >
                {danhMucList.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
              <Select 
                placeholder="Trạng thái kho" 
                style={{ width: 150 }} 
                allowClear
                onChange={val => setFilterSanPham({ ...filterSanPham, status: val })}
              >
                <Option value="con-hang">Còn hàng ({'>'}10)</Option>
                <Option value="sap-het">Sắp hết (1-10)</Option>
                <Option value="het-hang">Hết hàng (0)</Option>
              </Select>
            </Space>
            
            <Table 
              rowKey="id" 
              dataSource={filteredSanPham} 
              columns={columnsSanPham} 
              pagination={{ pageSize: 5 }} 
              bordered
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab={<span><ShoppingOutlined /> Quản lý Đơn hàng</span>} key="don-hang">
           <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }} wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalDonHangVisible(true)}>
                Tạo đơn hàng
              </Button>
              <Input 
                placeholder="Tìm khách hàng/Mã ĐH..." 
                prefix={<SearchOutlined />} 
                onChange={e => setFilterDonHang({ ...filterDonHang, keyword: e.target.value })} 
                style={{ width: 200 }}
              />
              <Select 
                placeholder="Trạng thái" 
                style={{ width: 150 }} 
                allowClear
                onChange={val => setFilterDonHang({ ...filterDonHang, status: val })}
              >
                <Option value="Chờ xử lý">Chờ xử lý</Option>
                <Option value="Đang giao">Đang giao</Option>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
              <RangePicker 
                onChange={(dates) => setFilterDonHang({ ...filterDonHang, dateRange: dates })} 
              />
            </Space>

            <Table 
              rowKey="id" 
              dataSource={filteredDonHang} 
              columns={columnsDonHang} 
              pagination={{ pageSize: 5 }} 
              bordered
            />
           </div>
        </Tabs.TabPane>
      </Tabs>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      <Modal
        title={editingSanPham ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        visible={modalSanPhamVisible}
        onCancel={() => { setModalSanPhamVisible(false); formSanPham.resetFields(); }}
        onOk={() => formSanPham.submit()}
      >
        <Form form={formSanPham} layout="vertical" onFinish={handleLuuSanPham}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Nhập danh mục!' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Nhập giá!' }]}>
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng tồn" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL TẠO ĐƠN HÀNG */}
      <Modal
        title="Tạo đơn hàng mới"
        visible={modalDonHangVisible}
        onCancel={() => { setModalDonHangVisible(false); formDonHang.resetFields(); }}
        onOk={() => formDonHang.submit()}
        width={700}
      >
        <Form form={formDonHang} layout="vertical" onFinish={handleTaoDonHang} initialValues={{ items: [{}] }}>
          <Row gutter={16}>
             <Col span={12}>
                <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
             </Col>
             <Col span={12}>
                <Form.Item name="phone" label="Số điện thoại" rules={[
                  { required: true },
                  { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ (10-11 số)' }
                ]}>
                  <Input placeholder="09xxx..." />
                </Form.Item>
             </Col>
          </Row>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
             <Input />
          </Form.Item>
          
          <Divider>Danh sách sản phẩm mua</Divider>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                    <Col span={14}>
                      <Form.Item
                        {...restField}
                        name={[name, 'productId']}
                        rules={[{ required: true, message: 'Chọn SP!' }]}
                        style={{ margin: 0 }}
                      >
                        <Select placeholder="Chọn sản phẩm" showSearch optionFilterProp="children">
                           {danhSachSanPham.filter(p => p.quantity > 0).map(p => (
                             <Option key={p.id} value={p.id}>{p.name} (Tồn: {p.quantity}, Giá: {p.price.toLocaleString()})</Option>
                           ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Nhập SL!' }]}
                        initialValue={1}
                        style={{ margin: 0 }}
                      >
                        <InputNumber min={1} placeholder="SL" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red', cursor: 'pointer' }} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm sản phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      <Modal
        title={`Chi tiết đơn hàng: ${selectedOrder?.id}`}
        visible={modalChiTietDonHangVisible}
        onCancel={() => setModalChiTietDonHangVisible(false)}
        footer={[<Button key="close" onClick={() => setModalChiTietDonHangVisible(false)}>Đóng</Button>]}
      >
        {selectedOrder && (
          <div>
             <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
             <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
             <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
             <p><strong>Ngày tạo:</strong> {selectedOrder.createdAt}</p>
             <p><strong>Trạng thái:</strong> <Tag color="blue">{selectedOrder.status}</Tag></p>
             <Divider>Sản phẩm</Divider>
             <List
               dataSource={selectedOrder.products}
               renderItem={item => (
                 <List.Item>
                   <List.Item.Meta
                     title={item.productName}
                     description={`Số lượng: ${item.quantity} x ${item.price.toLocaleString()} đ`}
                   />
                   <div>{(item.quantity * item.price).toLocaleString()} đ</div>
                 </List.Item>
               )}
             />
             <Divider />
             <h3 style={{ textAlign: 'right', color: 'red' }}>Tổng tiền: {selectedOrder.totalAmount.toLocaleString()} đ</h3>
          </div>
        )}
      </Modal>

    </Card>
  );
};

export default QuanLyCuaHang;