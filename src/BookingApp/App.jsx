import React, { useState } from 'react';
import BookingForm from './BookingForm';
import AdminPanel from './AdminPanel';
import Dashboard from './Dashboard';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('booking');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAppointmentBooked = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Hệ thống đặt lịch hẹn dịch vụ</h1>
        <p className="app-subtitle">Quản lý lịch làm việc chuyên nghiệp</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          Đặt lịch
        </button>
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Quản lý & Thống kê
        </button>
        <button
          className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Cài đặt
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'booking' && <BookingForm onAppointmentBooked={handleAppointmentBooked} />}
        {activeTab === 'dashboard' && <Dashboard key={refreshTrigger} />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Hệ thống quản lý lịch hẹn dịch vụ</p>
      </footer>
    </div>
  );
}
