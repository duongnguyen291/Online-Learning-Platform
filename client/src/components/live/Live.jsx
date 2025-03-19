import './live.css';
import onlineClassIcon from "../../assets/images/sound.jpg"
import liveChatIcon from "../../assets/images/live.jpg"
import recordedClassIcon from "../../assets/images/video.jpg"

const Live = () => {
  return (
    <div className="live-learning-container">
      <div className="live-learning-content">
        <div className="header-section">
          <h1>Interactive Live Learning Experience</h1>
          <p className="description-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et massa eget augue 
            ornare tincidunt. Nullam at mi tincidunt, malesuada elit vel, porta felis.
          </p>
          
          <div className="cta-section">
            <button className="try-now-button">Try now!</button>
            <div className="decorative-dots"></div>
          </div>
        </div>
        
        <div className="video-container">
          {/* This is where you would include your embedded video */}
          <div className="video-wrapper">
            <iframe 
              src="https://youtu.be/5A1_qgKWZ8A" 
              title="Interactive Learning Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
            
            {/* Call button overlay */}
            <div className="call-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon orange-bg">
              <img src={onlineClassIcon} alt="Online classes icon" />
            </div>
            <p>Online classes</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon purple-bg">
              <img src={liveChatIcon} alt="Live chat icon" />
            </div>
            <p>Live chat</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon green-bg">
              <img src={recordedClassIcon} alt="Recorded class icon" />
            </div>
            <p>Recorded Class</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Live