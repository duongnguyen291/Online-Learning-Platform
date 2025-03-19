import "./banner.css"

const Banner = () => {
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
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et massa eget augue ornare tincidunt.</p>
                    <p>Nullam at mi tincidunt, malesuada elit vel, porta felis. Nulla ut metus quis neque dapibus consectetur eu eget lorem.</p>
                </div>

                <div className="banner-buttons">
                    <button className="banner-getstarted-button">Get started </button>
                </div>
            </div>

            <div className="banner-graphic">

            </div>
        </div>
    )
}

export default Banner