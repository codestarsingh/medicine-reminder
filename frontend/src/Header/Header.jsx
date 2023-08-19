import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function Header() {
    return (
        <div>
            <header>
                <h1><NotificationsActiveIcon /> Medicine Reminder</h1>
                <Link className="register" to={'/sign-up'}>Register</Link>
            </header>
        </div>
    );
}

export default Header;