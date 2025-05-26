import React from 'react';
import { Users, UserCheck, UserX, GraduationCap, BarChart2 } from 'lucide-react';
import studentData from '../../assets/data/StudentData';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const stats = studentData.getStatistics();
  const students = studentData.getStudents();

  const getTopPerformers = () => {
    return students
      .filter(student => student.status === 'active')
      .map(student => {
        const avgProgress = Object.values(student.progress).reduce(
          (sum, course) => sum + course.completed,
          0
        ) / Object.keys(student.progress).length || 0;

        const avgGrade = Object.values(student.progress).reduce((sum, course) => {
          const courseAvg = course.grades.reduce((s, g) => s + g.score, 0) / course.grades.length || 0;
          return sum + courseAvg;
        }, 0) / Object.keys(student.progress).length || 0;

        return {
          ...student,
          avgProgress,
          avgGrade
        };
      })
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, 5);
  };

  const topPerformers = getTopPerformers();

  return (
    <div className="content-section">
      <div className="content-header">
        <div className="header-info">
          <h1>Tổng quan học viên</h1>
          <p>Thống kê và phân tích về học viên</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon students">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Tổng số học viên</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.activeStudents}</h3>
            <p>Học viên đang học</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingStudents}</h3>
            <p>Chờ duyệt</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.inactiveStudents}</h3>
            <p>Ngừng học</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>
            <BarChart2 size={20} />
            Tiến độ trung bình
          </h3>
          <div className="progress-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3"
                strokeDasharray={`${stats.averageProgress}, 100`}
              />
              <text x="18" y="20.35" className="percentage">
                {Math.round(stats.averageProgress)}%
              </text>
            </svg>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Top 5 học viên xuất sắc</h3>
          <div className="top-performers">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="performer-item">
                <div className="performer-rank">{index + 1}</div>
                <div className="performer-info">
                  <h4>{student.fullName}</h4>
                  <div className="performer-stats">
                    <span>Điểm TB: {Math.round(student.avgGrade)}</span>
                    <span>Tiến độ: {Math.round(student.avgProgress)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 