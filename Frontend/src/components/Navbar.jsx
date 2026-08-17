import {Link} from "react-router-dom";
import "../navbar.css";

export default function Navbar(){
    return(
        <nav className="navbar-container">
            <div className="navbar-wrapper">
                <Link className="navbar-brand" to="/">
                    <span className="navbar-brand-icon">📊</span>
                    Invoice Manager
                </Link>
                <ul className="navbar-nav">
                    <li className="navbar-nav-item">
                        <Link className="navbar-nav-link" to="/">
                            <span>🏠</span> Dashboard
                        </Link>
                    </li>
                    <li className="navbar-nav-item">
                        <Link className="navbar-nav-link" to="/clients">
                            <span>👥</span> Clients
                        </Link>
                    </li>
                    <li className="navbar-nav-item">
                        <Link className="navbar-nav-link" to="/invoices">
                            <span>📄</span> Invoices
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );  
}