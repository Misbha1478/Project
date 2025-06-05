// src/components/TaskBoardIllustration/TaskBoardIllustration.jsx
import React from 'react';
// Make sure to import the CSS that styles this illustration.
// This could be a dedicated CSS file for this component,
// or styles from a more global CSS file.
// For example:
// import './TaskBoardIllustration.css';
// or if the styles are in the HeroSectionWithIllustration.css and that component is its parent:
// import '../HeroSectionWithIllustration/HeroSectionWithIllustration.css';

const TaskBoardIllustration = () => {
  return (
    <div className="hero-illustration">
      {/* Main Task Board */}
      <div className="task-board">
        <div className="board-header">
          <div className="board-title">Today's Tasks</div>
          <div className="board-menu"></div>
        </div>

        <div className="task-item task-completed">
          <div className="task-checkbox"></div>
          <div className="task-text">Review project proposals</div>
          <div className="task-priority priority-high"></div>
        </div>

        <div className="task-item task-in-progress">
          <div className="task-checkbox"></div>
          <div className="task-text">Design new dashboard interface</div>
          <div className="task-priority priority-medium"></div>
        </div>

        <div className="task-item task-pending">
          <div className="task-checkbox"></div>
          <div className="task-text">Schedule team meeting for next week</div>
          <div className="task-priority priority-low"></div>
        </div>

        <div className="task-item task-pending">
          <div className="task-checkbox"></div>
          <div className="task-text">Update client documentation</div>
          <div className="task-priority priority-medium"></div>
        </div>

        {/* Progress Ring */}
        <div className="progress-ring">
          <svg>
            <circle className="bg" cx="40" cy="40" r="25"></circle>
            <circle className="progress" cx="40" cy="40" r="25"></circle>
          </svg>
        </div>
      </div>

      {/* Floating Stats Card */}
      <div className="floating-element stats-card">
        <span className="stats-number">24</span>
        <span className="stats-label">Completed Today</span>
      </div>

      {/* Floating Notification */}
      <div className="floating-element notification-card">
        <div className="notification-icon"></div>
        <div className="notification-text">Task completed successfully!</div>
      </div>
    </div>
  );
};

export default TaskBoardIllustration;
