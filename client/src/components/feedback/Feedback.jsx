import React, { useState } from 'react';
import './feedback.css';
import Ava from "../../assets/images/avatar.jpg"

const Feedback = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Jassica Andrew",
      avatar: Ava,
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et massa eget augue ornare tincidunt."
    },
    {
      id: 2,
      name: "Darlene Robertson",
      avatar: Ava,
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et massa eget augue ornare tincidunt. Nullam at mi tincidunt, malesuada elit vel, porta felis."
    },
    {
      id: 3,
      name: "Dianne Russell",
      avatar: Ava,
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et massa eget augue ornare tincidunt."
    }
  ];

  // State to track current slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <h2>What Our Users Say</h2>
        
        <div className="testimonials-slider">
          <button className="nav-button prev" onClick={goToPrevious}>
            <span>&#10094;</span>
          </button>
          
          <div className="testimonials-wrapper">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${index === currentIndex ? 'active' : ''}`}
              >
                <div className="avatar-container">
                  <img src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} />
                </div>
                <h3>{testimonial.name}</h3>
                <div className="rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p>{testimonial.text}</p>
              </div>
            ))}
          </div>
          
          <button className="nav-button next" onClick={goToNext}>
            <span>&#10095;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;