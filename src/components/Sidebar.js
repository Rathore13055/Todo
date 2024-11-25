import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ task, closeSidebar, updateTaskDetails }) => {
  const [description, setDescription] = useState(task.description || "");
  const [location, setLocation] = useState(task.location || "");
  const [date, setDate] = useState(task.date || "");

  const handleSave = () => {
    updateTaskDetails(task.id, { description, location, date });
    closeSidebar();
  };

  return (
    <div className="sidebar">
      <h2>Edit Task</h2>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={closeSidebar}>Close</button>
    </div>
  );
};

export default Sidebar;
