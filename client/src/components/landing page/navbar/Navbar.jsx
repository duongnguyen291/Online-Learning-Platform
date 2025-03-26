import "./navbar.css"
import logo from "../../../assets/images/Edusmart.png"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="navbar-container">

      <div className="logo">
        <img src={logo} alt="edusmart-logo" />
      </div>

      <div className="nav-items">
        <h3>Course</h3>
        <h3>Chatbot</h3>
        <h3>How to use</h3>
        <h3>About us</h3>
      </div>

      <div className="side-nav-items">
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <h3>Log in</h3>
      </Link>
      <Link to="/register" style={{ textDecoration: 'none' }}>
        <h3>Sign up</h3>
      </Link>
      </div>

    </div>
  )
}

export default Navbar