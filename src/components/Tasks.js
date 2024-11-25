import React, { useState, useEffect } from "react";

const Task = ({
  task,
  deleteTask,
  toggleComplete,
  updateTaskTimer,
  showNotification,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [hasNotified, setHasNotified] = useState(false); // Prevent repeated notifications

  useEffect(() => {
    if (task.timer) {
      const interval = setInterval(() => {
        const timeLeft = task.timer - Date.now();
        setRemainingTime(timeLeft > 0 ? timeLeft : 0);

        if (timeLeft <= 0 && !hasNotified) {
          setHasNotified(true); // Mark notification as sent
          showNotification(`Time's up for: ${task.text}`); // Custom notification
          playNotificationSound(); // Play sound
        }

        if (timeLeft <= 0) {
          clearInterval(interval); // Stop the timer
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [task.timer, hasNotified, showNotification]);

  const setTaskTimer = () => {
    const minutes = prompt("Set timer in minutes:");
    if (isNaN(minutes) || minutes <= 0) {
      showNotification("Invalid time!"); // Custom notification
      return;
    }
    const duration = parseInt(minutes) * 60000;
    setHasNotified(false); // Reset notification state
    updateTaskTimer(task.id, duration);
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3"); // Ensure notification.mp3 is in the public folder
    audio.play().catch((err) => console.error("Failed to play sound:", err));
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <li
      className={`task-item ${task.isComplete ? "complete" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        type="checkbox"
        checked={task.isComplete}
        onChange={() => toggleComplete(task.id)}
      />
      <span>{task.text}</span>
      {task.timer && remainingTime !== null && (
        <span className="timer">
          {remainingTime > 0 ? formatTime(remainingTime) : "Time's up!"}
        </span>
      )}
      <button onClick={setTaskTimer} className="timer-btn">
        Set Timer
      </button>
      <button onClick={() => deleteTask(task.id)} className="delete-btn">
        Delete
      </button>
    </li>
  );
};

export default Task;
