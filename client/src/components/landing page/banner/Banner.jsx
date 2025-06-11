import "./banner.css"
import { useNavigate } from 'react-router-dom';
import EDUImage from '../../../assets/images/EDU.png';

const Banner = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/courses');
    };

    return (
        <div className="banner-container">
            <div className="red-ellipse-gradient"></div>
            
            <div className="banner-content">
                <div className="banner-heading1">
                    <h2>Knowledge Connection</h2>
                </div>
                
                <div className="banner-heading2">
                    <h2>Open the Door to the Future</h2>
                </div>
                
                <div className="banner-subheading">
                    <p>Join our online learning platform and unlock a world of knowledge anytime, anywhere. Our expert-led courses help you gain real-world skills and stay ahead in your career</p>
                </div>
                
                <div className="banner-buttons">
                    <button className="banner-getstarted-button" onClick={handleGetStarted}>
                        Get started
                    </button>
                </div>
            </div>
            
            <div className="banner-graphic">
                <img src={EDUImage} alt="Education" className="banner-image" />
            </div>
        </div>
    )
}

export default Banner