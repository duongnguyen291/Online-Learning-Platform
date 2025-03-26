import "./footer.css"
import logo from "../../../assets/images/Edusmart.png"

const Footer = () => {
    return (
        <>
            <div className="footer-container">

                <div className="footer-logo">
                  <img src={logo} alt="edusmart-logo" />
                </div>

                <div className="footer-medic">
                    <ul className="footer-lists">
                        <li>Courses</li>
                        <li>Classroom Courses</li>
                        <li>Virtual Classroom Course</li>
                        <li>E-learning Course</li>
                        <li>Video Courses</li>
                    </ul>
                </div>

                <div className="footer-about">
                    <ul className="footer-lists">
                        <li>Community</li>
                        <li>Learners</li>
                        <li>Parteners</li>
                        <li>Developers</li>
                        <li>Blog</li>
                        <li>Teaching Center</li>
                    </ul>
                </div>

                <div className="footer-social-media">
                    <ul className="footer-lists">
                        <li>Social Media</li>
                        <li>Twitter / X</li>
                        <li>Facebook</li>
                        <li>Instagram</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <ul className="footer-lists">
                        <li>Contact</li>
                        <li>Austin Texas, 4567 Road Palm</li>
                        <li>+00 123 456 789</li>
                        <li>medi@test.com</li>
                    </ul>
                </div>

            </div>

        </>


    )
}

export default Footer