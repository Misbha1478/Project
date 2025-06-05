// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import styles from './Navbar.module.css';
import logo from '../../assets/logo1.jpg'; // Make sure this path is correct
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { FaSignOutAlt } from 'react-icons/fa'; // For the logout icon

function Navbar() {
  // State for dropdown is no longer needed if features dropdown is removed
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);
  const { isLoggedIn, logout, isLoadingAuth } = useAuth(); // Get auth state, logout, and isLoadingAuth
  const { pathname } = useLocation(); // Get current pathname

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };
  // const closeDropdown = () => setIsDropdownOpen(false);

  // Close dropdown if clicking outside - No longer needed
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [dropdownRef]);

  // Debugging log to check auth state
  console.log("Navbar Debug: isLoadingAuth =", isLoadingAuth, ", isLoggedIn =", isLoggedIn, ", Path =", pathname);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isAuthPage) {
    return null; // No navbar on login/signup pages
  }

  // Common Features Dropdown JSX - REMOVED
  // const featuresDropdown = (
  //   <li className={styles.dropdown} ref={dropdownRef}>
  //     <button className={styles.dropbtn} onClick={toggleDropdown} aria-haspopup="true" aria-expanded={isDropdownOpen}>
  //       Features
  //     </button>
  //     <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.show : ''}`} role="menu">
  //       <Link to="/features/task-management" className={styles.dropdownItem} role="menuitem" onClick={closeDropdown}>Task Management</Link>
  //       <Link to="/features/time-management" className={styles.dropdownItem} role="menuitem" onClick={closeDropdown}>Time Management</Link>
  //       <Link to="/features/gamification" className={styles.dropdownItem} role="menuitem" onClick={closeDropdown}>Gamification</Link>
  //     </div>
  //   </li>
  // );

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="Workopoly Logo" className={styles.logoImage} />
        <span className={styles.logoText}>Workopoly</span>
      </Link>
      <ul className={styles.navLinks}>
        {isLoadingAuth ? (
          <li><span className={styles.loadingSpinner}></span></li>
        ) : (
          <>
            {isDashboardPage ? (
              // Links for Dashboard pages
              isLoggedIn && (
                <li>
                  <button
                    onClick={() => { logout(); /* closeDropdown(); */ }} // closeDropdown removed as dropdown is gone
                    className={`${styles.dropbtn} ${styles.logoutButton || ''}`}
                  >
                    <FaSignOutAlt style={{ marginRight: '8px' }} />
                    Logout
                  </button>
                </li>
              )
            ) : (
              // Links for Home and Generic pages (e.g., /about)
              <>
                <li><Link to="/" className={pathname === '/' ? styles.active : ''} /* onClick={closeDropdown} */>Home</Link></li>
                <li><Link to="/about" className={pathname === '/about' ? styles.active : ''} /* onClick={closeDropdown} */>About</Link></li>
                {/* featuresDropdown REMOVED */}
                {!isLoggedIn ? (
                  <>
                    <li><Link to="/signup" /* onClick={closeDropdown} */>Sign Up</Link></li>
                    <li><Link to="/login" /* onClick={closeDropdown} */>Login</Link></li>
                  </>
                ) : (
                  <li><Link to="/dashboard" className={pathname.startsWith('/dashboard') ? styles.active : ''} /* onClick={closeDropdown} */>Dashboard</Link></li>
                )}
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
