import React, { useState, useEffect } from 'react';
import { loadEmployees, saveEmployees, loadServices, saveServices, formatCurrency } from './data';

export default function AdminPanel() {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [empName, setEmpName] = useState('');
  const [empSpecialty, setEmpSpecialty] = useState('');
  const [empMaxCustomers, setEmpMaxCustomers] = useState('5');
  const [empWorkDays, setEmpWorkDays] = useState([1, 2, 3, 4, 5]);

  const [srvName, setSrvName] = useState('');
  const [srvDuration, setSrvDuration] = useState('60');
  const [srvPrice, setSrvPrice] = useState('');

  useEffect(() => {
    setEmployees(loadEmployees());
    setServices(loadServices());
  }, []);

  const handleAddOrEditEmployee = (e) => {
    e.preventDefault();
    
    if (!empName.trim() || !empSpecialty.trim() || !empMaxCustomers) {
      alert('Vui lòng điền đầy đủ thông tin nhân viên');
      return;
    }

    const maxCustomers = parseInt(empMaxCustomers);
    if (maxCustomers < 1) {
      alert('Số khách tối đa phải >= 1');
      return;
    }

    if (editingEmployee) {
      const updated = employees.map(e =>
        e.id === editingEmployee.id
          ? { ...e, name: empName.trim(), specialty: empSpecialty.trim(), maxCustomersPerDay: maxCustomers, workDays: empWorkDays }
          : e
      );
      setEmployees(updated);
      saveEmployees(updated);
      setEditingEmployee(null);
    } else {
      const newEmployee = {
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        name: empName.trim(),
        specialty: empSpecialty.trim(),
        maxCustomersPerDay: maxCustomers,
        workDays: empWorkDays
      };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      saveEmployees(updated);
    }

    setEmpName('');
    setEmpSpecialty('');
    setEmpMaxCustomers('5');
    setEmpWorkDays([1, 2, 3, 4, 5]);
    setShowEmployeeForm(false);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      const updated = employees.filter(e => e.id !== id);
      setEmployees(updated);
      saveEmployees(updated);
    }
  };

  const handleEditEmployee = (employee) => {
    setEmpName(employee.name);
    setEmpSpecialty(employee.specialty);
    setEmpMaxCustomers(String(employee.maxCustomersPerDay));
    setEmpWorkDays([...employee.workDays]);
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleAddOrEditService = (e) => {
    e.preventDefault();

    if (!srvName.trim() || !srvDuration || !srvPrice) {
      alert('Vui lòng điền đầy đủ thông tin dịch vụ');
      return;
    }

    const duration = parseInt(srvDuration);
    const price = parseInt(srvPrice);

    if (duration < 15) {
      alert('Thời lượng tối thiểu 15 phút');
      return;
    }

    if (price < 0) {
      alert('Giá không hợp lệ');
      return;
    }

    if (editingService) {
      const updated = services.map(s =>
        s.id === editingService.id
          ? { ...s, name: srvName.trim(), duration, price }
          : s
      );
      setServices(updated);
      saveServices(updated);
      setEditingService(null);
    } else {
      const newService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        name: srvName.trim(),
        duration,
        price
      };
      const updated = [...services, newService];
      setServices(updated);
      saveServices(updated);
    }

    setSrvName('');
    setSrvDuration('60');
    setSrvPrice('');
    setShowServiceForm(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa dịch vụ này?')) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      saveServices(updated);
    }
  };

  const handleEditService = (service) => {
    setSrvName(service.name);
    setSrvDuration(String(service.duration));
    setSrvPrice(String(service.price));
    setEditingService(service);
    setShowServiceForm(true);
  };

  const toggleWorkDay = (day) => {
    if (empWorkDays.includes(day)) {
      setEmpWorkDays(empWorkDays.filter(d => d !== day));
    } else {
      setEmpWorkDays([...empWorkDays, day].sort());
    }
  };

  const dayNames = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];

  return (
    <div className="admin-panel">
      <h2>Quản lý hệ thống</h2>

      <div className="admin-section">
        <h3>Quản lý nhân viên</h3>
        <button className="btn-add" onClick={() => {
          setEditingEmployee(null);
          setEmpName('');
          setEmpSpecialty('');
          setEmpMaxCustomers('5');
          setEmpWorkDays([1, 2, 3, 4, 5]);
          setShowEmployeeForm(!showEmployeeForm);
        }}>
          {showEmployeeForm ? 'Hủy' : '+ Thêm nhân viên'}
        </button>

        {showEmployeeForm && (
          <form onSubmit={handleAddOrEditEmployee} className="admin-form">
            <div className="form-group">
              <label>Tên nhân viên: *</label>
              <input
                type="text"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="Nhập tên"
              />
            </div>

            <div className="form-group">
              <label>Chuyên môn: *</label>
              <input
                type="text"
                value={empSpecialty}
                onChange={(e) => setEmpSpecialty(e.target.value)}
                placeholder="Ví dụ: Dạy vẽ, Thiết kế"
              />
            </div>

            <div className="form-group">
              <label>Số khách tối đa/ngày: *</label>
              <input
                type="number"
                value={empMaxCustomers}
                onChange={(e) => setEmpMaxCustomers(e.target.value)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Lịch trực (chọn các ngày làm việc):</label>
              <div className="work-days">
                {dayNames.map((name, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={empWorkDays.includes(index)}
                      onChange={() => toggleWorkDay(index)}
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-submit">
              {editingEmployee ? 'Cập nhật' : 'Thêm'}
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
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.specialty}</td>
                <td>{emp.maxCustomersPerDay}</td>
                <td>{emp.workDays.map(d => dayNames[d]).join(', ')}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditEmployee(emp)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDeleteEmployee(emp.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Quản lý dịch vụ</h3>
        <button className="btn-add" onClick={() => {
          setEditingService(null);
          setSrvName('');
          setSrvDuration('60');
          setSrvPrice('');
          setShowServiceForm(!showServiceForm);
        }}>
          {showServiceForm ? 'Hủy' : '+ Thêm dịch vụ'}
        </button>

        {showServiceForm && (
          <form onSubmit={handleAddOrEditService} className="admin-form">
            <div className="form-group">
              <label>Tên dịch vụ: *</label>
              <input
                type="text"
                value={srvName}
                onChange={(e) => setSrvName(e.target.value)}
                placeholder="Nhập tên dịch vụ"
              />
            </div>

            <div className="form-group">
              <label>Thời lượng (phút): *</label>
              <input
                type="number"
                value={srvDuration}
                onChange={(e) => setSrvDuration(e.target.value)}
                min="15"
                step="15"
              />
            </div>

            <div className="form-group">
              <label>Giá (VND): *</label>
              <input
                type="number"
                value={srvPrice}
                onChange={(e) => setSrvPrice(e.target.value)}
                min="0"
              />
            </div>

            <button type="submit" className="btn-submit">
              {editingService ? 'Cập nhật' : 'Thêm'}
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Thời lượng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map(srv => (
              <tr key={srv.id}>
                <td>{srv.name}</td>
                <td>{srv.duration} phút</td>
                <td>{formatCurrency(srv.price)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditService(srv)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDeleteService(srv.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
