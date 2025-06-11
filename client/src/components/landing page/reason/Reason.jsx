import "./reason.css"

const Reason = () => {
  return (
    <div className="reason-section">
      <div className="reason-container">
        <div className="reason-heading">
          <h2>Why should you choose EduSmart?</h2>
        </div>
        
        <div className="reason-cards">
          <div className="reason-card">
            <div className="reason-card-content">
              <div className="reason-card-image">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2021/2021122.png" 
                  alt="AI Chatbot Support"
                  className="reason-icon"
                />
              </div>
              <h3>Instant Knowledge Support</h3>
              <p>
              Get quick answers to your questions anytime with our intelligent chatbot designed to support your learning journey.
              </p>
            </div>
          </div>
          
          <div className="reason-card">
            <div className="reason-card-content">
              <div className="reason-card-image">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/9746/9746836.png" 
                  alt="Personalized Learning"
                  className="reason-icon"
                />
              </div>
              <h3>Personalized Learning Path</h3>
              <p>
              Receive tailored course recommendations and learning plans based on your goals and current skills.
              </p>
            </div>
          </div>
          
          <div className="reason-card">
            <div className="reason-card-content">
              <div className="reason-card-image">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3247/3247965.png" 
                  alt="Certificate"
                  className="reason-icon"
                />
              </div>
              <h3>Free Certified Courses</h3>
              <p>
              Access a variety of free courses and earn certificates to boost your resume and professional profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reason