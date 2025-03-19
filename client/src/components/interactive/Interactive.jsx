import './interactive.css';
import logo from "../../assets/images/dashboard.png"

const Interactive = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="image-container">
            <img src={logo} alt="dashboard" />
        </div>
        
        <div className="text-content">
          <h1>Interactive Admin Dashboard</h1>
          
          <div className="feature-list">
            <div className="ifeature-item">
              <div className="check-icon">✓</div>
              <p>Add teachers and students in your Virtual College</p>
            </div>
            
            <div className="ifeature-item">
              <div className="check-icon">✓</div>
              <p>Upload Assignment and Quizes for your Students</p>
            </div>
            
            <div className="ifeature-item">
              <div className="check-icon">✓</div>
              <p>Manage your College Timetable and Announcements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interactive