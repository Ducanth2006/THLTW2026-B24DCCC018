import React, { useState, useEffect } from 'react';
import { loadAppointments, saveAppointments, loadRatings, saveRatings, loadEmployees, loadServices, formatCurrency, formatDateTime } from './data';

export default function BangDieuKhien() {
  const [danhSachLich, setDanhSachLich] = useState([]);
  const [danhGiaKhach, setDanhGiaKhach] = useState([]);
  const [nhanVien, setNhanVien] = useState([]);
  const [cacDichVu, setCacDichVu] = useState([]);
  const [locTrangThai, setLocTrangThai] = useState('all');
  const [nhapDanhGia, setNhapDanhGia] = useState({});

  useEffect(() => {
    setDanhSachLich(loadAppointments());
    setDanhGiaKhach(loadRatings());
    setNhanVien(loadEmployees());
    setCacDichVu(loadServices());
  }, []);

  const doiTrangThaiLich = (idLich, trangThaiMoi) => {
    const daCapNhat = danhSachLich.map(item =>
      item.id === idLich ? { ...item, status: trangThaiMoi } : item
    );
    setDanhSachLich(daCapNhat);
    saveAppointments(daCapNhat);
  };

  const bamXoaLich = (idLich) => {
    if (window.confirm('Bạn chắc chắn muốn xóa lịch hẹn này?')) {
      const conLai = danhSachLich.filter(item => item.id !== idLich);
      setDanhSachLich(conLai);
      saveAppointments(conLai);
    }
  };

  const guiDanhGiaMoi = (idLich, mucSao, loiNhan) => {
    if (!mucSao) {
      alert('Vui lòng chọn đánh giá');
      return;
    }

    const daCoChua = danhGiaKhach.findIndex(d => d.appointmentId === idLich);
    const thongTinDanhGia = {
      appointmentId: idLich,
      rating: parseInt(mucSao),
      comment: loiNhan.trim(),
      createdAt: new Date().toISOString()
    };

    let mangMoi;
    if (daCoChua >= 0) {
      mangMoi = [...danhGiaKhach];
      mangMoi[daCoChua] = thongTinDanhGia;
    } else {
      mangMoi = [...danhGiaKhach, thongTinDanhGia];
    }

    setDanhGiaKhach(mangMoi);
    saveRatings(mangMoi);
    setNhapDanhGia({ ...nhapDanhGia, [idLich]: {} });
  };

  const timTenNhanVien = (idTho) => {
    return nhanVien.find(n => n.id === idTho)?.name || 'Chưa rõ';
  };

  const timTenDichVu = (idGoi) => {
    return cacDichVu.find(d => d.id === idGoi)?.name || 'Chưa rõ';
  };

  const xemGiaTien = (idGoi) => {
    return cacDichVu.find(d => d.id === idGoi)?.price || 0;
  };

  const xemDiemDanhGia = (idLich) => {
    return danhGiaKhach.find(d => d.appointmentId === idLich);
  };

  const lichSauKhiLoc = locTrangThai === 'all'
    ? danhSachLich
    : danhSachLich.filter(item => item.status === locTrangThai);

  const lichDaXong = danhSachLich.filter(item => item.status === 'completed');
  const tongTienKiemDuoc = lichDaXong.reduce((tong, item) => tong + xemGiaTien(item.serviceId), 0);
  const saoTrungBinh = danhGiaKhach.length > 0
    ? (danhGiaKhach.reduce((tong, d) => tong + d.rating, 0) / danhGiaKhach.length).toFixed(1)
    : 'Chưa có';

  return (
    <div className="dashboard">
      <h2>Bảng thống kê</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng lịch hẹn</div>
          <div className="stat-value">{danhSachLich.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lịch hẹn đã hoàn thành</div>
          <div className="stat-value">{lichDaXong.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng doanh thu</div>
          <div className="stat-value-large">{formatCurrency(tongTienKiemDuoc)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đánh giá trung bình</div>
          <div className="stat-value">{saoTrungBinh} / 5</div>
        </div>
      </div>

      <div className="appointments-section">
        <h3>Danh sách lịch hẹn</h3>
        <div className="filter-buttons">
          <button className={`filter-btn ${locTrangThai === 'all' ? 'active' : ''}`} onClick={() => setLocTrangThai('all')}>
            Tất cả ({danhSachLich.length})
          </button>
          <button className={`filter-btn ${locTrangThai === 'pending' ? 'active' : ''}`} onClick={() => setLocTrangThai('chờ')}>
            Chờ xác nhận ({danhSachLich.filter(a => a.status === 'pending').length})
          </button>
          <button className={`filter-btn ${locTrangThai === 'approved' ? 'active' : ''}`} onClick={() => setLocTrangThai('chấp nhận')}>
            Đã xác nhận ({danhSachLich.filter(a => a.status === 'approved').length})
          </button>
          <button className={`filter-btn ${locTrangThai === 'completed' ? 'active' : ''}`} onClick={() => setLocTrangThai('Đã oke')}>
            Hoàn thành ({danhSachLich.filter(a => a.status === 'completed').length})
          </button>
          <button className={`filter-btn ${locTrangThai === 'cancelled' ? 'active' : ''}`} onClick={() => setLocTrangThai('Hủy')}>
            Đã hủy ({danhSachLich.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {lichSauKhiLoc.length === 0 ? (
          <p className="no-data">Không có lịch hẹn</p>
        ) : (
          <div className="appointments-list">
            {lichSauKhiLoc.map(item => {
              const ketQuaDanhGia = xemDiemDanhGia(item.id);
              return (
                <div key={item.id} className="appointment-card">
                  <div className="apt-header">
                    <div className="apt-main-info">
                      <h4>{item.customerName}</h4>
                      <p className="apt-phone">Số điện thoại :{item.customerPhone}</p>
                    </div>
                    <div className={`apt-status status-${item.status}`}>{item.status}</div>
                  </div>

                  <table className="apt-details-table">
                    <tbody>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{timTenDichVu(item.serviceId)}</td>
                      </tr>
                      <tr>
                        <td><strong>Nhân viên:</strong></td>
                        <td>{timTenNhanVien(item.employeeId)}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày giờ:</strong></td>
                        <td>{new Date(item.appointmentDate).toLocaleDateString('vi-VN')} lúc {item.appointmentTime}</td>
                      </tr>
                      <tr>
                        <td><strong>Giá:</strong></td>
                        <td>{formatCurrency(xemGiaTien(item.serviceId))}</td>
                      </tr>
                      {item.notes && (
                        <tr>
                          <td><strong>Ghi chú:</strong></td>
                          <td>{item.notes}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="apt-actions">
                    {item.status !== 'completed' && item.status !== 'cancelled' && (
                      <>
                        {item.status === 'pending' && (
                          <button className="btn-action btn-approve" onClick={() => doiTrangThaiLich(item.id, 'approved')}>
                            Xác nhận
                          </button>
                        )}
                        {item.status === 'approved' && (
                          <button className="btn-action btn-complete" onClick={() => doiTrangThaiLich(item.id, 'completed')}>
                            Hoàn thành
                          </button>
                        )}
                        <button className="btn-action btn-cancel" onClick={() => doiTrangThaiLich(item.id, 'cancelled')}>
                          Hủy
                        </button>
                      </>
                    )}

                    {item.status === 'completed' && !ketQuaDanhGia && (
                      <div className="rating-section">
                        <select onChange={(e) => setNhapDanhGia({ ...nhapDanhGia, [item.id]: { ...nhapDanhGia[item.id], rating: e.target.value } })}>
                          <option value="">Đánh giá *</option>
                          <option value="5"> Rất tốt</option>
                          <option value="4"> Tốt</option>
                          <option value="3"> Bình thường</option>
                          <option value="2"> Không tốt (Kém)</option>
                          <option value="1"> Rất tệ</option>
                        </select>
                        <textarea
                          placeholder="Phản hồi (tuỳ chọn)"
                          onChange={(e) => setNhapDanhGia({ ...nhapDanhGia, [item.id]: { ...nhapDanhGia[item.id], comment: e.target.value } })}
                          rows="2"
                        />
                        <button className="btn-action btn-submit" onClick={() => guiDanhGiaMoi(item.id, nhapDanhGia[item.id]?.rating, nhapDanhGia[item.id]?.comment || '')}>
                          Gửi đánh giá
                        </button>
                      </div>
                    )}

                    {ketQuaDanhGia && (
                      <div className="rating-display">
                        <strong>Đánh giá:  ({ketQuaDanhGia.rating}/5)</strong>
                        {ketQuaDanhGia.comment && <p>{ketQuaDanhGia.comment}</p>}
                      </div>
                    )}

                    <button className="btn-action btn-delete-small" onClick={() => bamXoaLich(item.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}