import React, { useState, useEffect } from 'react';
import { loadAppointments, saveAppointments, loadEmployees, loadServices, checkAvailability, formatCurrency } from './data';

export default function BookingForm({ onAppointmentBooked }) {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setEmployees(loadEmployees());
    setServices(loadServices());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!customerName.trim() || !customerPhone.trim() || !selectedEmployee || !selectedService || !appointmentDate || !appointmentTime) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const service = services.find(s => s.id === parseInt(selectedService));
    const employee = employees.find(e => e.id === parseInt(selectedEmployee));

    if (!service || !employee) {
      setError('Lỗi: Dịch vụ hoặc nhân viên không tồn tại');
      return;
    }

    const availability = checkAvailability(parseInt(selectedEmployee), appointmentDate, appointmentTime, service.duration);
    if (!availability.available) {
      setError(availability.message);
      return;
    }

    const newAppointment = {
      id: Date.now(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      employeeId: parseInt(selectedEmployee),
      serviceId: parseInt(selectedService),
      appointmentDate,
      appointmentTime,
      notes: notes.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      duration: service.duration
    };

    const appointments = loadAppointments();
    appointments.push(newAppointment);
    saveAppointments(appointments);

    setSuccess(`Đặt lịch thành công! Mã lịch: ${newAppointment.id}`);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedEmployee('');
    setSelectedService('');
    setAppointmentDate('');
    setAppointmentTime('');
    setNotes('');

    if (onAppointmentBooked) {
      onAppointmentBooked(newAppointment);
    }

    setTimeout(() => setSuccess(''), 3000);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form">
      <h2>Đặt lịch hẹn dịch vụ</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên khách hàng: *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại: *</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Chọn dịch vụ: *</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">-- Chọn dịch vụ --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatCurrency(service.price)} ({service.duration} phút)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Chọn nhân viên: *</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ngày hẹn: *</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={minDate}
          />
        </div>

        <div className="form-group">
          <label>Giờ hẹn: *</label>
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú thêm (tuỳ chọn)"
            rows="3"
          />
        </div>

        <button type="submit" className="btn-submit">Đặt lịch</button>
      </form>
    </div>
  );
}
