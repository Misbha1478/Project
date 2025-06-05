// src/components/About/About.jsx
import React from 'react';
import styles from './About.module.css'; // Import the CSS Module

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.mainHeading}>About Workopoly</h1>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🟢 1. Intro: What is Workopoly?</h2>
        <p className={styles.paragraph}>
          <strong>Workopoly is a smart, gamified task management platform</strong> that helps individuals, professionals, teams, and even kids organize their tasks, boost productivity, and stay motivated — all while having fun.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🧠 2. Our Mission</h2>
        <blockquote className={styles.blockquote}>
          <em>To transform task management from a stressful chore into a rewarding experience — through intelligent features, motivation-driven design, and fun.</em>
        </blockquote>
        <p className={styles.paragraph}>
          We believe productivity should feel empowering, not exhausting.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🔍 3. Why We Built Workopoly</h2>
        <p className={styles.paragraph}>
          Traditional task managers are often rigid, boring, and stressful. Many people give up on them quickly.
          We created Workopoly to solve this — by adding:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>✅ Smart task scheduling</li>
          <li className={styles.listItem}>🧠 Gamification and point rewards</li>
          <li className={styles.listItem}>🎮 Educational games for kids</li>
          <li className={styles.listItem}>📊 Visual progress tracking</li>
          <li className={styles.listItem}>🏆 Leaderboards to encourage healthy competition</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🧩 4. Who is Workopoly For?</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>Students</strong> – Manage assignments and learning with fun</li>
          <li className={styles.listItem}><strong>Professionals</strong> – Track multiple projects and deadlines</li>
          <li className={styles.listItem}><strong>Parents & Kids</strong> – Use simple games and rewards to build productivity habits early</li>
          <li className={styles.listItem}><strong>Teams</strong> – Collaborate and track progress together</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🔐 5. What Makes Workopoly Different?</h2>
        <table className={styles.table}>
          <thead>
            <tr><th className={styles.th}>Feature</th><th className={styles.th}>Benefit</th></tr>
          </thead>
          <tbody>
            <tr><td className={styles.td}>🎯 Gamification</td><td className={styles.td}>Stay motivated through points, badges, and rewards</td></tr>
            <tr><td className={styles.td}>🤖 Smart Scheduling</td><td className={styles.td}>AI-based task prioritization</td></tr>
            <tr><td className={styles.td}>🧒 Kid-Friendly Features</td><td className={styles.td}>Optional child dashboard and games</td></tr>
            <tr><td className={styles.td}>📆 Calendar Integration</td><td className={styles.td}>Sync with Google Calendar</td></tr>
            <tr><td className={styles.td}>🔐 Secure Authentication</td><td className={styles.td}>JWT, role-based access</td></tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>👨‍💻 6. How We Built It</h2>
        <p className={styles.paragraph}>
          Workopoly is built using the powerful <strong>MERN stack (MongoDB, Express.js, React.js, Node.js)</strong>.
          We focused on performance, security, and responsive design so users can manage tasks anywhere, anytime.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🛠 7. Our Team / Developers (Optional)</h2>
        <blockquote className={styles.blockquote}>
          <em>“We are a group of passionate developers who want to make productivity fun and accessible to everyone.”</em>
        </blockquote>
        <p className={styles.paragraph}>(You can add your name, contact, or credits here)</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>📬 8. Get in Touch</h2>
        <p className={styles.paragraph}>
          Got feedback or questions? We’d love to hear from you.
          <br />
          <a href="mailto:support@workopoly.com" className={styles.contactLink}>Contact Us</a> or email us at <a href="mailto:support@workopoly.com" className={styles.contactLink}>support@workopoly.com</a>
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subHeading}>🔚 9. Closing Statement</h2>
        <p className={styles.paragraph}>
          Workopoly isn't just about ticking boxes. It's about transforming the way you work, learn, and grow.
          <br />
          <em>Join us and turn your tasks into triumphs.</em>
        </p>
      </section>
    </div>
  );
}

export default About;
