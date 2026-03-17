import React, { useState, useEffect } from 'react';
import { loadEmployees, saveEmployees, loadServices, saveServices, formatCurrency } from './data';

export default function BangQuanLy() {
  const [danhSachNguoiLam, setDanhSachNguoiLam] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [hienOVanTayNhanVien, setHienOVanTayNhanVien] = useState(false);
  const [hienOVanTayDichVu, setHienOVanTayDichVu] = useState(false);
  const [dangSuaNguoiLam, setDangSuaNguoiLam] = useState(null);
  const [dangSuaMon, setDangSuaMon] = useState(null);

  const [tenNguoi, setTenNguoi] = useState('');
  const [ngheNghiep, setNgheNghiep] = useState('');
  const [soKhachMax, setSoKhachMax] = useState('5');
  const [lichLamViec, setLichLamViec] = useState([1, 2, 3, 4, 5]);

  const [tenMon, setTenMon] = useState('');
  const [thoiGianLam, setThoiGianLam] = useState('60');
  const [giaTien, setGiaTien] = useState('');

  useEffect(() => {
    setDanhSachNguoiLam(loadEmployees());
    setDanhSachMon(loadServices());
  }, []);

  const luuHoacSuaNguoiLam = (e) => {
    e.preventDefault();
    
    if (!tenNguoi.trim() || !ngheNghiep.trim() || !soKhachMax) {
      alert('Vui lòng điền đầy đủ thông tin nhân viên');
      return;
    }

    const soKhach = parseInt(soKhachMax);
    if (soKhach < 1) {
      alert('Số khách tối đa phải >= 1');
      return;
    }

    if (dangSuaNguoiLam) {
      const daCapNhat = danhSachNguoiLam.map(n =>
        n.id === dangSuaNguoiLam.id
          ? { ...n, name: tenNguoi.trim(), specialty: ngheNghiep.trim(), maxCustomersPerDay: soKhach, workDays: lichLamViec }
          : n
      );
      setDanhSachNguoiLam(daCapNhat);
      saveEmployees(daCapNhat);
      setDangSuaNguoiLam(null);
    } else {
      const nguoiMoi = {
        id: Math.max(...danhSachNguoiLam.map(n => n.id), 0) + 1,
        name: tenNguoi.trim(),
        specialty: ngheNghiep.trim(),
        maxCustomersPerDay: soKhach,
        workDays: lichLamViec
      };
      const daCapNhat = [...danhSachNguoiLam, nguoiMoi];
      setDanhSachNguoiLam(daCapNhat);
      saveEmployees(daCapNhat);
    }

    
    setNgheNghiep('');
    setSoKhachMax('5');
    setLichLamViec([1, 2, 3, 4, 5]);
    setHienOVanTayNhanVien(false);
  };

  const bamXoaNguoiLam = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      const conLai = danhSachNguoiLam.filter(n => n.id !== id);
      setDanhSachNguoiLam(conLai);
      saveEmployees(conLai);
    }
  };

  const moFormSuaNguoi = (nguoi) => {
    setTenNguoi(nguoi.name);
    setNgheNghiep(nguoi.specialty);
    setSoKhachMax(String(nguoi.maxCustomersPerDay));
    setLichLamViec([...nguoi.workDays]);
    setDangSuaNguoiLam(nguoi);
    setHienOVanTayNhanVien(true);
  };

  const luuHoacSuaMon = (e) => {
    e.preventDefault();

    if (!tenMon.trim() || !thoiGianLam || !giaTien) {
      alert('Vui lòng điền đầy đủ thông tin dịch vụ');
      return;
    }

    const thoiGian = parseInt(thoiGianLam);
    const gia = parseInt(giaTien);

    if (thoiGian < 15) {
      alert('Thời lượng tối thiểu 15 phút');
      return;
    }

    if (gia < 0) {
      alert('Giá không hợp lệ');
      return;
    }

    if (dangSuaMon) {
      const daCapNhat = danhSachMon.map(m =>
        m.id == dangSuaMon.id
          ? { ...m, name: tenMon.trim(), duration: thoiGian, price: gia }
          : m
      );
      setDanhSachMon(daCapNhat);
      saveServices(daCapNhat);
      setDangSuaMon(null);
    } else {
      const monMoi = {
        id: Math.max(...danhSachMon.map(m => m.id), 0) + 1,
        name: tenMon.trim(),
        duration: thoiGian,
        price: gia
      };
      const daCapNhat = [...danhSachMon, monMoi];
      setDanhSachMon(daCapNhat);
      saveServices(daCapNhat);
    }

    setTenMon('');
    setThoiGianLam('60');
    setGiaTien('');
    setHienOVanTayDichVu(false);
  };

  const bamXoaMon = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa dịch vụ này?')) {
      const conLai = danhSachMon.filter(m => m.id != id);
      setDanhSachMon(conLai);
      saveServices(conLai);
    }
  };

  const moFormSuaMon = (mon) => {
    setTenMon(mon.name);
    setThoiGianLam(String(mon.duration));
    setGiaTien(String(mon.price));
    setDangSuaMon(mon);
    setHienOVanTayDichVu(true);
  };

  const chonNgayTruc = (ngay) => {
    if (lichLamViec.includes(ngay)) {
      setLichLamViec(lichLamViec.filter(n => n != ngay));
    } else {
      setLichLamViec([...lichLamViec, ngay].sort());
    }
  };

  const cacThuTrongTuan = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];

  return (
    <div className="admin-panel">
      <h2>Quản lý hệ thống</h2>

      <div className="admin-section">
        <h3>Quản lý nhân viên</h3>
        <button className="btn-add" onClick={() => {
          setDangSuaNguoiLam(null);
          setTenNguoi('');
          setNgheNghiep('');
          setSoKhachMax('5');
          setLichLamViec([1, 2, 3, 4, 5]);
          setHienOVanTayNhanVien(!hienOVanTayNhanVien);
        }}>
          {hienOVanTayNhanVien ? 'Thôi không thêm nữa' : '+ Thêm người làm'}
        </button>

        {hienOVanTayNhanVien && (
          <form onSubmit={luuHoacSuaNguoiLam} className="admin-form">
            <div className="form-group">
              <label>Tên nhân viên: *</label>
              <input
                type="text"
                value={tenNguoi}
                onChange={(e) => setTenNguoi(e.target.value)}
                placeholder="Nhập tên"
              />
            </div>

            <div className="form-group">
              <label>Chuyên môn: *</label>
              <input
                type="text"
                value={ngheNghiep}
                onChange={(e) => setNgheNghiep(e.target.value)}
                placeholder="Ví dụ: Dạy vẽ, Thiết kế"
              />
            </div>

            <div className="form-group">
              <label>Số khách tối đa/ngày: *</label>
              <input
                type="number"
                value={soKhachMax}
                onChange={(e) => setSoKhachMax(e.target.value)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Lịch trực (chọn các ngày làm việc):</label>
              <div className="work-days">
                {cacThuTrongTuan.map((tenThu, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={lichLamViec.includes(index)}
                      onChange={() => chonNgayTruc(index)}
                    />
                    {tenThu}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-submit">
              {dangSuaNguoiLam ? 'Lưu thay đổi' : 'Thêm luôn'}
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Chuyên môn</th>
              <th>Max khách/ngày</th>
              <th>Lịch trực</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachNguoiLam.map(nguoi => (
              <tr key={nguoi.id}>
                <td>{nguoi.name}</td>
                <td>{nguoi.name}</td>
                <td>{nguoi.maxCustomersPerDay}</td>
                <td>{nguoi.workDays.map(d => cacThuTrongTuan[d]).join(', ')}</td>
                <td>
                  <button className="btn-edit" onClick={() => moFormSuaNguoi(nguoi)}>Sửa</button>
                  <button className="btn-delete" onClick={() => bamXoaNguoiLam(nguoi.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Quản lý dịch vụ</h3>
        <button className="btn-add" onClick={() => {
          setDangSuaMon(null);
          setTenMon('');
          setThoiGianLam('60');
          setGiaTien('');
          setHienOVanTayDichVu(!hienOVanTayDichVu);
        }}>
          {hienOVanTayDichVu ? 'Thôi không thêm nữa' : '+ Thêm món mới'}
        </button>

        {hienOVanTayDichVu && (
          <form onSubmit={luuHoacSuaMon} className="admin-form">
            <div className="form-group">
              <label>Tên món: *</label>
              <input
                type="text"
                value={tenMon}
                onChange={(e) => setTenMon(e.target.value)}
                placeholder="Nhập tên dịch vụ"
              />
            </div>

            <div className="form-group">
              <label>Thời lượng (phút): *</label>
              <input
                type="number"
                value={thoiGianLam}
                onChange={(e) => setThoiGianLam(e.target.value)}
                min="15"
                step="15"
              />
            </div>

            <div className="form-group">
              <label>Giá (VND): *</label>
              <input
                type="number"
                value={giaTien}
                onChange={(e) => setGiaTien(e.target.value)}
                min="0"
              />
            </div>

            <button type="submit" className="btn-submit">
              {dangSuaMon ? 'Lưu thay đổi' : 'Thêm luôn'}
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Thời lượng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachMon.map(mon => (
              <tr key={mon.id}>
                <td>{mon.name}</td>
                <td>{mon.duration} phút</td>
                <td>{formatCurrency(mon.price)}</td>
                <td>
                  <button className="btn-edit" onClick={() => moFormSuaMon(mon)}>Sửa</button>
                  <button className="btn-delete" onClick={() => bamXoaMon(mon.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}