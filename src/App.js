import React, { useState, useEffect } from "react";
import Task from "./components/Tasks";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [draggingTask, setDraggingTask] = useState(null);
  const [notifications, setNotifications] = useState([]); // For custom notifications

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText) => {
    if (taskText.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      isComplete: false,
      timer: null,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    playDeleteSound(); // Play delete sound
  };

  const playDeleteSound = () => {
    const audio = new Audio("/delete.mp3"); // Ensure delete.mp3 is in the public folder
    audio.play();
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  const handleDragStart = (task) => {
    setDraggingTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetTask) => {
    if (!draggingTask) return;

    const newTasks = [...tasks];
    const draggingIndex = newTasks.findIndex((t) => t.id === draggingTask.id);
    const targetIndex = newTasks.findIndex((t) => t.id === targetTask.id);

    newTasks.splice(draggingIndex, 1);
    newTasks.splice(targetIndex, 0, draggingTask);

    setTasks(newTasks);
    setDraggingTask(null);
  };

  const updateTaskTimer = (id, duration) => {
    const endTime = Date.now() + duration;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, timer: endTime } : task
      )
    );
  };

  const showNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000); // Auto-remove notification after 5 seconds
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="input-area">
        <input
          type="text"
          id="task-input"
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && addTask(e.target.value)}
        />
        <button
          onClick={() => {
            const input = document.getElementById("task-input");
            addTask(input.value);
            input.value = "";
          }}
        >
          Add Task
        </button>
      </div>
      <ul id="task-list">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            updateTaskTimer={updateTaskTimer}
            showNotification={showNotification}
            onDragStart={() => handleDragStart(task)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(task)}
          />
        ))}
      </ul>

      {/* Notification Pop-up */}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification">
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
