// c:/Users/misba/OneDrive/Documents/workopoly1_proj/frontend/src/components/UserProfile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Keep for theme context, even if selector is removed from this page
import styles from './UserProfile.module.css'; // Ensure this path is correct
import { FaUserCircle, FaPlusCircle, FaLock, FaInfoCircle } from 'react-icons/fa'; // Removed FaEdit, FaSave, FaTimes
import {
  getUserProfile,
  updateUserProfile, // This might be removed if no profile fields are updatable from here
  uploadProfilePicture
} from '../../api/userApi';
// ThemeSelector import is removed as the section is removed from this page.
// If you want to place ThemeSelector elsewhere or bring it back, you'd re-add it.

// --- TierBadge Component ---
const TierBadge = ({ tier }) => {
  if (!tier) return null;

  let badgeContent = null;
  let badgeClass = '';

  switch (tier.toLowerCase()) {
    case 'silver':
      badgeContent = '🥈 Silver';
      badgeClass = styles.silverBadge;
      break;
    case 'gold':
      badgeContent = '🥇 Gold';
      badgeClass = styles.goldBadge;
      break;
    case 'diamond':
      badgeContent = '💎 Diamond';
      badgeClass = styles.diamondBadge;
      break;
    default:
      return null;
  }
  return <span className={`${styles.tierBadge} ${badgeClass}`}>{badgeContent}</span>;
};

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    createdAt: '',
    profilePictureUrl: null,
    points: 0,
    tier: '',
    // Removed: tasksCompleted, badges, level, currentXP, xpForNextLevel as they are not displayed here
  });

  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For upload operations
  const [isFetchingProfile, setIsFetchingProfile] = useState(true); // For initial profile load
  const [error, setError] = useState(null);
  // const [showUnlockInfo, setShowUnlockInfo] = useState(null); // No longer needed as username editing is removed
 
  const { user: authUser, isAuthLoading, login: updateUserInAuthContext } = useAuth(); // Get login to update context
  const { setTheme } = useTheme(); // Keep if theme is still synced from profile

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser) {
        setError("User not logged in.");
        setIsFetchingProfile(false);
        setProfileDataLoaded(true);
        return;
      }

      setIsFetchingProfile(true);
      setError(null);

      try {
        const profileDataFromApi = await getUserProfile();
        const fetchedUserData = {
          name: profileDataFromApi.name || '',
          username: profileDataFromApi.username || '',
          email: profileDataFromApi.email || '',
          role: profileDataFromApi.role || 'user',
          createdAt: profileDataFromApi.createdAt || '',
          profilePictureUrl: profileDataFromApi.profilePictureUrl || null,
          points: profileDataFromApi.points || 0,
          tier: profileDataFromApi.tier || '',
          // Sync theme if it's part of profileDataFromApi and you want to keep this behavior
          // theme: profileDataFromApi.theme || 'light',
        };
        setUserData(fetchedUserData);

        // Set theme from backend if it's part of the profile data
        if (profileDataFromApi.theme) {
          setTheme(profileDataFromApi.theme, "UserProfileInitialLoad");
        }

      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data.");
      } finally {
        setIsFetchingProfile(false);
        setProfileDataLoaded(true);
      }
    };

    if (!isAuthLoading && authUser) { // Ensure authUser is available before fetching
      fetchProfileData();
    } else if (!isAuthLoading && !authUser) {
        setError("User not logged in.");
        setIsFetchingProfile(false);
        setProfileDataLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isAuthLoading, setTheme]); // Added setTheme to dependencies

  const handlePictureUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('profilePicture', file);

      uploadProfilePicture(formData)
        .then(response => {
            // Assuming backend returns { profilePictureUrl: 'new_url' } or { user: { ..., profilePictureUrl: 'new_url' } }
            const newUrl = response.profilePictureUrl || response.user?.profilePictureUrl;
            if (newUrl) {
                const updatedData = { ...userData, profilePictureUrl: newUrl };
                setUserData(updatedData);
                alert("Profile picture updated!");

                // Update AuthContext if profile picture URL is part of authUser
                if (authUser) {
                    updateUserInAuthContext(authUser.token, { ...authUser, profilePictureUrl: newUrl });
                }
            } else {
                throw new Error("Profile picture URL not found in response.");
            }
        })
        .catch(err => {
            setError(err.message || "Failed to upload picture.");
        })
        .finally(() => {
            setIsLoading(false);
        });
  };

  if (isAuthLoading || (isFetchingProfile && !profileDataLoaded) ) {
      return <div className={styles.userProfilePage}><p>Loading profile...</p></div>;
  }
  if (!authUser && profileDataLoaded && !isFetchingProfile) { // Check !isFetchingProfile here
      return <div className={styles.userProfilePage}><p>Please log in to view your profile.</p></div>;
  }
   // This check might be redundant if the one above catches it, but good for safety
  if (!authUser) {
      return <div className={styles.userProfilePage}><p>Please log in to view your profile.</p></div>;
  }
  // Show error only if not fetching and an error exists
  if (error && !isFetchingProfile) {
      return <div className={styles.userProfilePage}><p className={styles.errorMessage}>Error loading profile: {error}</p></div>;
  }


  return (
    <div className={styles.userProfilePage}>
      <h1>User Profile</h1>

      {error && !isFetchingProfile && ( // Display error if it occurred outside initial fetch
        <p className={styles.errorMessage}>{error}</p>
      )}

      <div className={styles.profileContentGrid}>
        <aside className={styles.profileSidebar}>
          <div className={styles.profilePictureContainer}>
             {userData.profilePictureUrl ? (
                 <img
                    src={userData.profilePictureUrl?.startsWith('/') ? `${BACKEND_URL}${userData.profilePictureUrl}` : userData.profilePictureUrl}
                    alt="Profile"
                    className={styles.profilePicture}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200?text=Error"; }}
                 />
             ) : (
                 <FaUserCircle className={`${styles.profilePicture} ${styles.defaultProfileIcon}`} />
             )}
             <label htmlFor="profile-picture-upload" className={styles.uploadIconLabel} title="Change profile picture">
                 {isLoading ? '...' : <FaPlusCircle className={styles.uploadIcon} />}
             </label>
             <input
                id="profile-picture-upload" type="file" accept="image/*"
                onChange={handlePictureUpload} style={{ display: 'none' }}
                disabled={isLoading} // Disable while any loading operation is in progress
             />
          </div>
          {/* Profile actions (edit button, save, cancel) are removed */}
        </aside>

        <main className={styles.profileMainContent}>
          <form id="userProfileForm"> {/* onSubmit removed as there's no form submission for username now */}
            <section className={`${styles.profileSection} ${styles.basicInfo}`}>
              <h2>Basic Info</h2>
              <div className={styles.infoGrid}>
                <label htmlFor="points">Points:</label>
                <span id="points" className={styles.pointsBalance}>{userData.points} ✨</span>

                <label htmlFor="name">Full Name:</label>
                <span>{userData.name || '-'} <TierBadge tier={userData.tier} /></span>

                <label htmlFor="username">Username:</label>
                <span className={styles.usernameDisplay}>
                    {userData.username || '(Not Set)'}
                </span>

                <label htmlFor="email">Email:</label>
                <span>{userData.email || '-'}</span>

                <label>Role:</label>
                <span>{userData.role || '-'}</span>

                <label>Current Tier:</label>
                <span>
                  {userData.tier ? userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1) : 'N/A'}
                </span>
                <label>Joined On:</label>
                <span>{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </section>
            {/* Sections for Appearance, Stats, Badges are removed as per request */}
          </form>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
