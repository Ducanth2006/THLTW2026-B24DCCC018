import React, { useState, useEffect } from 'react';
import { loadAppointments, saveAppointments, loadRatings, saveRatings, loadEmployees, loadServices, formatCurrency, formatDateTime } from './data';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [ratingData, setRatingData] = useState({});

  useEffect(() => {
    setAppointments(loadAppointments());
    setRatings(loadRatings());
    setEmployees(loadEmployees());
    setServices(loadServices());
  }, []);

  const handleChangeStatus = (appointmentId, newStatus) => {
    const updated = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa lịch hẹn này?')) {
      const updated = appointments.filter(apt => apt.id !== appointmentId);
      setAppointments(updated);
      saveAppointments(updated);
    }
  };

  const handleRateAppointment = (appointmentId, rating, comment) => {
    if (!rating) {
      alert('Vui lòng chọn đánh giá');
      return;
    }

    const existingIndex = ratings.findIndex(r => r.appointmentId === appointmentId);
    const newRating = {
      appointmentId,
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...ratings];
      updated[existingIndex] = newRating;
    } else {
      updated = [...ratings, newRating];
    }

    setRatings(updated);
    saveRatings(updated);
    setRatingData({ ...ratingData, [appointmentId]: {} });
  };

  const getEmployeeName = (employeeId) => {
    return employees.find(e => e.id === employeeId)?.name || 'N/A';
  };

  const getServiceName = (serviceId) => {
    return services.find(s => s.id === serviceId)?.name || 'N/A';
  };

  const getServicePrice = (serviceId) => {
    return services.find(s => s.id === serviceId)?.price || 0;
  };

  const getAppointmentRating = (appointmentId) => {
    return ratings.find(r => r.appointmentId === appointmentId);
  };

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div className="dashboard">
      <h2>Bảng thống kê</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng lịch hẹn</div>
          <div className="stat-value">{appointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lịch hẹn đã hoàn thành</div>
          <div className="stat-value">{completedAppointments.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng doanh thu</div>
          <div className="stat-value-large">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đánh giá trung bình</div>
          <div className="stat-value">{averageRating} / 5</div>
        </div>
      </div>

      <div className="appointments-section">
        <h3>Danh sách lịch hẹn</h3>
        <div className="filter-buttons">
          <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
            Tất cả ({appointments.length})
          </button>
          <button className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
            Chờ xác nhận ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`} onClick={() => setFilterStatus('approved')}>
            Đã xác nhận ({appointments.filter(a => a.status === 'approved').length})
          </button>
          <button className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => setFilterStatus('completed')}>
            Hoàn thành ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('cancelled')}>
            Đã hủy ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="no-data">Không có lịch hẹn</p>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map(apt => {
              const rating = getAppointmentRating(apt.id);
              return (
                <div key={apt.id} className="appointment-card">
                  <div className="apt-header">
                    <div className="apt-main-info">
                      <h4>{apt.customerName}</h4>
                      <p className="apt-phone">{apt.customerPhone}</p>
                    </div>
                    <div className={`apt-status status-${apt.status}`}>{apt.status}</div>
                  </div>

                  <table className="apt-details-table">
                    <tbody>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{getServiceName(apt.serviceId)}</td>
                      </tr>
                      <tr>
                        <td><strong>Nhân viên:</strong></td>
                        <td>{getEmployeeName(apt.employeeId)}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày giờ:</strong></td>
                        <td>{new Date(apt.appointmentDate).toLocaleDateString('vi-VN')} lúc {apt.appointmentTime}</td>
                      </tr>
                      <tr>
                        <td><strong>Giá:</strong></td>
                        <td>{formatCurrency(getServicePrice(apt.serviceId))}</td>
                      </tr>
                      {apt.notes && (
                        <tr>
                          <td><strong>Ghi chú:</strong></td>
                          <td>{apt.notes}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="apt-actions">
                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <>
                        {apt.status === 'pending' && (
                          <button className="btn-action btn-approve" onClick={() => handleChangeStatus(apt.id, 'approved')}>
                            Xác nhận
                          </button>
                        )}
                        {apt.status === 'approved' && (
                          <button className="btn-action btn-complete" onClick={() => handleChangeStatus(apt.id, 'completed')}>
                            Hoàn thành
                          </button>
                        )}
                        <button className="btn-action btn-cancel" onClick={() => handleChangeStatus(apt.id, 'cancelled')}>
                          Hủy
                        </button>
                      </>
                    )}

                    {apt.status === 'completed' && !rating && (
                      <div className="rating-section">
                        <select onChange={(e) => setRatingData({ ...ratingData, [apt.id]: { ...ratingData[apt.id], rating: e.target.value } })}>
                          <option value="">Đánh giá *</option>
                          <option value="5">⭐⭐⭐⭐⭐ Rất tốt</option>
                          <option value="4">⭐⭐⭐⭐ Tốt</option>
                          <option value="3">⭐⭐⭐ Bình thường</option>
                          <option value="2">⭐⭐ Không tốt</option>
                          <option value="1">⭐ Rất tệ</option>
                        </select>
                        <textarea
                          placeholder="Phản hồi (tuỳ chọn)"
                          onChange={(e) => setRatingData({ ...ratingData, [apt.id]: { ...ratingData[apt.id], comment: e.target.value } })}
                          rows="2"
                        />
                        <button className="btn-action btn-submit" onClick={() => handleRateAppointment(apt.id, ratingData[apt.id]?.rating, ratingData[apt.id]?.comment || '')}>
                          Gửi đánh giá
                        </button>
                      </div>
                    )}

                    {rating && (
                      <div className="rating-display">
                        <strong>Đánh giá: {'⭐'.repeat(rating.rating)} ({rating.rating}/5)</strong>
                        {rating.comment && <p>{rating.comment}</p>}
                      </div>
                    )}

                    <button className="btn-action btn-delete-small" onClick={() => handleDeleteAppointment(apt.id)}>
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
