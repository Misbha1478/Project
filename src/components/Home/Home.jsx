// src/components/Home/Home.jsx
import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import TaskBoardIllustration from '../TaskBoardIllustration/TaskBoardIllustration.jsx';


// --- Import Videos (Make sure paths are correct) ---
import video1 from '../../assets/video1.mp4';
import video2 from '../../assets/video2.mp4';
import video3 from '../../assets/video3.mp4';
// --- Import Images for How It Works Section ---
// import smallImg from '../../assets/small.jpg'; // No longer used
// import small1Img from '../../assets/small1.jpg'; // No longer used
// import small2Img from '../../assets/small2.jpg'; // No longer used
// import small3Img from '../../assets/small3.jpg'; // No longer used
// --- Import Hero Image ---
// import secondHeroImage from '../../assets/second.jpg'; // Old intro image, no longer used
import newintroImg from '../../assets/newintro.jpg';
import newintro1Img from '../../assets/newintro1.jpg';
import newintro2Img from '../../assets/newintro2.jpg';
import finalHeroImg from '../../assets/download.png'; // Import the new hero image

// --- Import Images for New Hero Grid ---
import grid1 from '../../assets/grid1.jpg';
import grid2 from '../../assets/grid2.jpg';
import grid3 from '../../assets/grid3.jpg';
import grid4 from '../../assets/grid4.jpg';
import grid7 from '../../assets/grid7.jpg';
import grid8 from '../../assets/grid8.jpg';
import grid9 from '../../assets/grid9.jpg';
import workopoly1image from '../../assets/workopoly1image.jpg';
import workopoly2image from '../../assets/workopoly2image.jpeg';





// --- Import Icons ---
import { FaTasks, FaClock, FaGamepad, FaChild, FaLock, FaChartLine, FaQuoteLeft, FaStar, FaRocket, FaLightbulb } from 'react-icons/fa'; // Added some example icons for keypoints

// Q&A Data
const faqs = [
  {
    id: 1,
    question: "What is Workopoly?",
    answer: "Workopoly is a task management web application that turns productivity into a game. It helps users manage tasks efficiently, earn points, unlock levels, and stay motivated through gamification elements like badges, progress bars, and quiz challenges.",
    arrowChar: "\u21E9"
  },
  {
    id: 2,
    question: "How does the points and leveling system work in Workopoly?",
    answer: "Each time you complete a task, you earn points. Accumulating points helps you level up, and each new level may unlock rewards like badges, quiz challenges, or advanced features. Completing quizzes also earns points, adding to your overall progress.",
    arrowChar: "\u21E9"
  },
  {
    id: 3,
    question: "What makes Workopoly different from other task managers?",
    answer: "Unlike traditional task managers, Workopoly combines productivity with fun through games, badges, and visual progress tracking. It keeps users engaged and motivated by turning everyday tasks into achievements and challenges.",
    arrowChar: "\u21E9"
  },
  {
    id: 4,
    question: "Who can use Workopoly?",
    answer: "Workopoly is ideal for students, professionals, and even kids who want to manage their time better while enjoying a gamified experience. Its flexible design caters to both personal productivity and educational engagement.",
    arrowChar: "\u21E9"
  }
];

// Image data for the new hero grid
const heroGridImages = [
  { id: 1, src: grid1, alt: "Workopoly feature 1" },
  { id: 2, src: grid2, alt: "Workopoly feature 2" },
  { id: 3, src: grid3, alt: "Workopoly feature 3" },
  { id: 4, src: grid4, alt: "Workopoly feature 4" },
  { id: 5, src: workopoly1image, alt: "Workopoly in action 1" },
  { id: 6, src: grid7, alt: "Workopoly feature 7" },
  { id: 7, src: grid8, alt: "Workopoly feature 8" },
  { id: 8, src: workopoly2image, alt: "Workopoly in action 2" },
  { id: 9, src: grid9, alt: "Workopoly feature 9" },
];

// Stats data for the new hero section
const heroStatsData = [
  { id: 1, value: "1L+", label: "Tasks Completed" },
  { id: 2, value: "✅ 10,000+", label: "Active Users" },
  { id: 3, value: "100K+", label: "Hours Managed" },
];

// Data for the new Intro Section blocks
const introContentData = [
  {
    id: 1,
    imageSrc: newintroImg,
    imageAlt: "Illustration of a person feeling overwhelmed by tasks",
    title: "Feeling Overwhelmed?",
    subheading: "When tasks pile up, focus and motivation disappear.",
    description: [
      "Missed deadlines, scattered notes, and no clear path forward — sound familiar?",
      "Without the right tools, task management becomes a burden instead of a boost.",
      "That’s why Workopoly exists: to bring clarity, structure, and motivation into your day."
    ]
  },
  {
    id: 2,
    imageSrc: newintro1Img,
    imageAlt: "Illustration of deadlines approaching rapidly",
    title: "Deadlines on Fire?",
    subheading: "Burnout isn’t a badge of honor — it’s a sign you need better tools.",
    description: [
      "The race against time shouldn't leave you feeling defeated.",
      "Endless to-do lists, last-minute cramming, and forgotten priorities are symptoms of a broken workflow.",
      "Workopoly helps you take control of your time, stay on top of deadlines, and prevent burnout — with smart scheduling, real-time tracking, and a fun twist of gamification."
    ]
  },
  {
    id: 3,
    imageSrc: newintro2Img,
    imageAlt: "Illustration of smart work and planning",
    title: "Work Smarter, Not Harder.",
    subheading: "Balance learning, planning, and doing — all in one place.",
    description: [
      "Whether you're a student tackling assignments, a professional juggling deadlines, or a parent guiding a child — Workopoly brings everything under one roof.",
      "📚 Read, plan, and take action with ease.",
      "💻 Track tasks, set goals, and stay on top of your progress.",
      "🎯 Visual dashboards and a gamified experience make staying productive fun and rewarding."
    ]
  }
];

function Home() {

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section - Updated with Left Text and Right Image Grid */}
      <section className={styles.heroSection}>
        <div className={styles.heroContentLeft}>
          <h1 className={styles.heroSiteName}>Workopoly</h1>
          <p className={styles.heroTagline}>Turn Tasks Into Triumphs with Workopoly</p>
          <div className={styles.heroStatsGrid}>
            {heroStatsData.map(stat => (
              <div key={stat.id} className={styles.heroStatItem}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
          <Link to="/signup" className={styles.heroCtaButtonLink}>
            <button className={styles.heroCtaButton}>Get Started Free</button>
          </Link>
          <p className={styles.heroSubTagline}>Master your day with smart task management, flexible scheduling, and rewarding productivity — all in one place.</p>
        </div>
         {/* New Hero Visual Area */}
         <div className={styles.heroVisualArea}>
             <img src={finalHeroImg} alt="Workopoly platform showcase" className={styles.heroImage} />
         </div>
      </section>

      {/* Intro Section - Updated with multiple alternating blocks */}
      <section className={styles.introSection} id="intro">
        <h2 className={`${styles.sectionHeading} ${styles.introSectionHeading}`}>🚀 What is Workopoly?</h2>
        <div className={styles.introContentWrapper}>
          {introContentData.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.introBlock} ${index % 2 === 1 ? styles.introBlockImageRight : ''}`}
            >
              <div className={styles.introImageContainer}>
                <img src={item.imageSrc} alt={item.imageAlt} />
              </div>
              <div className={styles.introTextualContent}>
                <h3 className={styles.introBlockTitle}>{item.title}</h3>
                <h4 className={styles.introBlockSubheading}>{item.subheading}</h4>
                <div className={styles.introBlockDescription}>
                  {item.description.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className={styles.videoSection} id="videos">
        <h2 className={styles.sectionHeading}>See Workopoly in Action</h2>
        <p className={styles.sectionSubheading}>Short glimpses into how Workopoly makes productivity engaging.</p>
        <div className={styles.videoShowcase}>
          <div className={styles.videoItem}>
            <div className={styles.videoPlayerWrapper}>
              <video playsInline loop muted autoPlay className={styles.videoElement}>
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.videoTextContent}>
              <h4 className={styles.videoTitle}>Effortless Task Creation</h4>
              <p className={styles.videoDescription}>Quickly add new tasks, set due dates, and assign priorities without breaking your flow.</p>
            </div>
          </div>
          <div className={styles.videoItem}>
             <div className={styles.videoPlayerWrapper}>
              <video playsInline loop muted autoPlay className={styles.videoElement}>
                <source src={video2} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.videoTextContent}>
              <h4 className={styles.videoTitle}>Track Your Progress</h4>
              <p className={styles.videoDescription}>Visualize your accomplishments and see how much you've completed at a glance.</p>
            </div>
          </div>
          <div className={styles.videoItem}>
             <div className={styles.videoPlayerWrapper}>
              <video playsInline loop muted autoPlay className={styles.videoElement}>
                <source src={video3} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className={styles.videoTextContent}>
              <h4 className={styles.videoTitle}>Gamified Motivation</h4>
              <p className={styles.videoDescription}>Earn points, level up, and climb the leaderboard as you conquer your quests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section - Assuming styles.featureCard from CSS */}
      <section className={styles.featuresSection} id="features">
         <h2 className={styles.sectionHeading}>🌟 What Makes Workopoly Different?</h2>
         <div className={styles.featuresGrid}>
            {/* Example Feature Card Structure - Repeat for each feature */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}> {/* Updated from featureIconContainer */}
                 <FaTasks className={styles.featureIcon} />
              </div>
              <h3 className={styles.featureTitle}>Flexible Task Views</h3>
              <p className={styles.featureDescription}>Organize your way with lists, boards, or calendars. Set priorities, due dates, and tags.</p>
            </div>
            <div className={styles.featureCard}>
               <div className={styles.featureIconWrapper}>
                 <FaClock className={styles.featureIcon} />
               </div>
              <h3 className={styles.featureTitle}>Integrated Time Tracking</h3>
              <p className={styles.featureDescription}>Log time spent on tasks, analyze your workflow, and improve estimations.</p>
            </div>
            <div className={styles.featureCard}>
               <div className={styles.featureIconWrapper}>
                 <FaGamepad className={styles.featureIcon} />
               </div>
              <h3 className={styles.featureTitle}>Addictive Gamification</h3>
              <p className={styles.featureDescription}>Earn points for completion, unlock achievements, and compete on leaderboards.</p>
            </div>
            <div className={styles.featureCard}>
               <div className={styles.featureIconWrapper}>
                 <FaChartLine className={styles.featureIcon} />
               </div>
              <h3 className={styles.featureTitle}>Progress Tracking</h3>
              <p className={styles.featureDescription}>Visualize your progress, completion rates, and time usage with clear charts.</p>
            </div>
            <div className={styles.featureCard}>
               <div className={styles.featureIconWrapper}>
                 <FaChild className={styles.featureIcon} />
               </div>
              <h3 className={styles.featureTitle}>Built for Everyone</h3>
              <p className={styles.featureDescription}>Perfect for students, professionals, and even kids learning time management.</p>
            </div>
            <div className={styles.featureCard}>
               <div className={styles.featureIconWrapper}>
                 <FaLock className={styles.featureIcon} />
               </div>
              <h3 className={styles.featureTitle}>Secure & Synced</h3>
              <p className={styles.featureDescription}>Secure login with progress sync across devices. Your data is safe.</p>
            </div>
         </div>
      </section>

      {/* Testimonials Section - Assuming styles.testimonialCard from CSS */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionHeading}>Hear from Our High Scorers</h2>
        <div className={styles.testimonialSlider}> {/* Changed from testimonialsGrid to testimonialSlider to match CSS */}
          <div className={styles.testimonialCard}>
            {/* <FaQuoteLeft className={styles.quoteIcon} /> CSS handles quote mark with ::before */}
            <blockquote className={styles.testimonialQuote}>"I used to procrastinate like crazy. Workopoly's point system actually motivates me to get stuff done ahead of time!"</blockquote>
            <div className={styles.testimonialAuthor}>
              {/* Assuming authorAvatar and authorInfo structure from CSS */}
              {/* <img src="path/to/avatar1.jpg" alt="Jordan P." className={styles.authorAvatar} /> */}
              <div className={styles.authorInfo}>
                <h4>Jordan P.</h4>
                <p>University Student</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <blockquote className={styles.testimonialQuote}>"As a freelancer, juggling clients was chaotic. Workopoly brought order and, dare I say, fun to my workflow."</blockquote>
            <div className={styles.testimonialAuthor}>
              {/* <img src="path/to/avatar2.jpg" alt="Chloe M." className={styles.authorAvatar} /> */}
              <div className={styles.authorInfo}>
                <h4>Chloe M.</h4>
                <p>Graphic Designer</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <blockquote className={styles.testimonialQuote}>"The kids are actually excited about doing chores now to earn points for their avatars. It's been a game-changer!"</blockquote>
            <div className={styles.testimonialAuthor}>
              {/* <img src="path/to/avatar3.jpg" alt="David L." className={styles.authorAvatar} /> */}
              <div className={styles.authorInfo}>
                <h4>David L.</h4>
                <p>Parent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q&A Section - Using accordion structure from CSS */}
      <section className={styles.qaSection} id="faq">
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <p className={styles.sectionSubheading}>Got questions? We've got answers!</p>
        <div className={styles.qaAccordion}>
          {faqs.map((faq) => (
            <details key={faq.id} className={styles.qaItem}>
              <summary className={styles.qaQuestion}>
                {faq.question}
                <span className={styles.qaIcon}>+</span> {/* CSS will handle open/close icon state */}
              </summary>
              <div className={styles.qaAnswer} aria-hidden="true"> {/* CSS handles visibility */}
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}> {/* Added ctaContent wrapper as per CSS */}
          <h2 className={styles.ctaHeading}>📱 Start Today</h2>
          <p className={styles.ctaText}>Your goals won’t wait — and neither should you.</p>
          <Link to="/signup" className={styles.ctaButtonLink}> {/* Added ctaButtonLink as per CSS */}
            <button className={styles.ctaButton}>Sign Up Free</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
