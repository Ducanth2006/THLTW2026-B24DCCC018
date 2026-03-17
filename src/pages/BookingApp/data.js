const KEY_EMPLOYEES = 'booking_employees';
const KEY_SERVICES = 'booking_services';
const KEY_APPOINTMENTS = 'booking_appointments';
const KEY_RATINGS = 'booking_ratings';

const defaultEmployees = [
  { id: 1, name: 'Nguyễn Văn A', specialty: 'Dạy vẽ', maxCustomersPerDay: 5, workDays: [1, 2, 3, 4, 5] },
  { id: 2, name: 'Trần Thị B', specialty: 'Thiết kế', maxCustomersPerDay: 4, workDays: [0, 1, 2, 3, 4, 5] },
  { id: 3, name: 'Phạm Văn C', specialty: 'Lập trình', maxCustomersPerDay: 3, workDays: [1, 2, 3, 4] }
];

const defaultServices = [
  { id: 1, name: 'Dạy vẽ cơ bản', duration: 60, price: 200000 },
  { id: 2, name: 'Thiết kế logo', duration: 120, price: 500000 },
  { id: 3, name: 'Tư vấn lập trình', duration: 45, price: 300000 },
  { id: 4, name: 'Lớp tiếng Anh', duration: 90, price: 250000 }
];

export function loadEmployees() {
  const data = localStorage.getItem(KEY_EMPLOYEES);
  return data ? JSON.parse(data) : defaultEmployees;
}

export function saveEmployees(employees) {
  localStorage.setItem(KEY_EMPLOYEES, JSON.stringify(employees));
}

export function loadServices() {
  const data = localStorage.getItem(KEY_SERVICES);
  return data ? JSON.parse(data) : defaultServices;
}

export function saveServices(services) {
  localStorage.setItem(KEY_SERVICES, JSON.stringify(services));
}

export function loadAppointments() {
  const data = localStorage.getItem(KEY_APPOINTMENTS);
  return data ? JSON.parse(data) : [];
}

export function saveAppointments(appointments) {
  localStorage.setItem(KEY_APPOINTMENTS, JSON.stringify(appointments));
}

export function loadRatings() {
  const data = localStorage.getItem(KEY_RATINGS);
  return data ? JSON.parse(data) : [];
}

export function saveRatings(ratings) {
  localStorage.setItem(KEY_RATINGS, JSON.stringify(ratings));
}

export function checkAvailability(employeeId, appointmentDate, appointmentTime, duration) {
  const appointments = loadAppointments();
  const employees = loadEmployees();
  const employee = employees.find(e => e.id === employeeId);
  
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const dayOfWeek = appointmentDateTime.getDay();
  
  if (!employee.workDays.includes(dayOfWeek)) {
    return { available: false, message: 'Nhân viên không làm việc vào ngày này' };
  }
  
  const countAppointmentsThisDay = appointments.filter(apt => {
    return apt.employeeId === employeeId && apt.appointmentDate === appointmentDate && apt.status !== 'cancelled';
  }).length;
  
  if (countAppointmentsThisDay >= employee.maxCustomersPerDay) {
    return { available: false, message: 'Nhân viên đã hết số khách trong ngày này' };
  }
  
  const conflict = appointments.some(apt => {
    if (apt.employeeId !== employeeId || apt.appointmentDate !== appointmentDate || apt.status === 'cancelled') {
      return false;
    }
    
    const existingStart = new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
    const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000);
    const newStart = appointmentDateTime;
    const newEnd = new Date(newStart.getTime() + duration * 60000);
    
    return !(newEnd <= existingStart || newStart >= existingEnd);
  });
  
  if (conflict) {
    return { available: false, message: 'Trùng lịch với khách hàng khác' };
  }
  
  return { available: true, message: 'Có thể đặt lịch' };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatDateTime(dateString, timeString) {
  const date = new Date(`${dateString}T${timeString}`);
  return date.toLocaleString('vi-VN');
}
