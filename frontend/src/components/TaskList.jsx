import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ apiBase, idToken, userRole = null }) => { // Added userRole prop
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    if (idToken) {
      fetchTasks();
    }
  }, [idToken]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiBase}/tasks`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Show user-friendly error message
      alert('Failed to load tasks. Please try again.');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const title = taskInput.trim();
    if (!title) return;

    try {
      const response = await axios.post(`${apiBase}/tasks`, {
        title: title,
        description: ''
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setTasks(prevTasks => [response.data, ...prevTasks]);
      setTaskInput('');
    } catch (error) {
      console.error('Error creating task:', error);
      // Show specific error message from backend
      const errorMessage = error.response?.data?.message || 'Failed to create task. Please try again.';
      alert(errorMessage);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const response = await axios.put(`${apiBase}/tasks/${taskId}`, {
        ...task,
        completed: !task.completed
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? response.data
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      // Show specific error message from backend
      const errorMessage = error.response?.data?.message || 'Failed to update task. Please try again.';
      alert(errorMessage);
    }
  };

  const deleteTask = async (taskId) => {
    // Add deleting class effect
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.classList.add('deleting');
      
      setTimeout(async () => {
        try {
          await axios.delete(`${apiBase}/tasks/${taskId}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
          console.error('Error deleting task:', error);
          // Remove deleting class if error occurs
          taskElement.classList.remove('deleting');
          
          // Show specific error message from backend
          const errorMessage = error.response?.data?.message || 'Failed to delete task. Please try again.';
          alert(errorMessage);
        }
      }, 300);
    }
  };

  // Check if user is admin (you can modify this logic based on how you store user role)
  const isAdmin = userRole === 'admin' || userRole === 'ADMIN';

  const TaskItem = ({ task }) => (
    <li className={`task-item ${task.completed ? 'completed' : ''}`} data-task-id={task._id}>
      <div className="task-content">
        <div className="task-details">
          <div className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</div>
          {task.description && (
            <div className={`task-description ${task.completed ? 'completed' : ''}`}>
              {task.description}
            </div>
          )}
          <div className={`task-status ${task.completed ? 'status-done' : 'status-pending'}`}>
            {task.completed ? 'Done' : 'Pending'}
          </div>
        </div>
        <div className="task-actions">
          <button 
            className={`action-btn ${task.completed ? 'undo-btn' : 'complete-btn'}`}
            onClick={() => toggleComplete(task._id)}
          >
            {task.completed ? 'Undo' : 'Complete'}
          </button>

          {/* Option 1: Hide delete button for non-admins}
          {isAdmin ? (
            <button 
              className="action-btn delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          ) : (
            <button 
              className="action-btn delete-btn disabled"
              onClick={() => alert('Only administrators can delete tasks.')}
              title="Only administrators can delete tasks"
            >
              Delete
            </button>
          )}
          { Option 1: Hide delete button for non-admins */}
          
          
          
          {
          <button 
            className="action-btn delete-btn"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
          }
        </div>
      </div>
    </li>
  );

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div>
      <style>{`
        .main-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
        }

        .task-form {
            background: #f8f9ff;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            border: 1px solid #e6e8f0;
        }

        .form-group {
            display: flex;
            gap: 15px;
            align-items: stretch;
        }

        .task-input {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
            background: white;
        }

        .task-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .task-input::placeholder {
            color: #a0a0a0;
        }

        .create-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .create-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .create-btn:active {
            transform: translateY(0);
        }

        .tasks-section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 1.3rem;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .task-count {
            background: #667eea;
            color: white;
            font-size: 0.8rem;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
        }

        .task-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .task-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            animation: slideIn 0.3s ease;
        }

        .task-item:hover {
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }

        .task-item.completed {
            opacity: 0.7;
            background: #f7fafc;
        }

        .task-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
        }

        .task-details {
            flex: 1;
        }

        .task-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .task-title.completed {
            text-decoration: line-through;
            color: #a0aec0;
        }

        .task-description {
            color: #718096;
            font-size: 0.95rem;
            line-height: 1.4;
        }

        .task-description.completed {
            color: #cbd5e0;
        }

        .task-status {
            font-size: 0.85rem;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background: #fed7d7;
            color: #c53030;
        }

        .status-done {
            background: #c6f6d5;
            color: #2f855a;
        }

        .task-actions {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            text-transform: capitalize;
        }

        .complete-btn {
            background: #48bb78;
            color: white;
        }

        .complete-btn:hover {
            background: #38a169;
            transform: translateY(-1px);
        }

        .undo-btn {
            background: #ed8936;
            color: white;
        }

        .undo-btn:hover {
            background: #dd6b20;
            transform: translateY(-1px);
        }

        .delete-btn {
            background: #f56565;
            color: white;
        }

        .delete-btn:hover:not(.disabled) {
            background: #e53e3e;
            transform: translateY(-1px);
        }

        /* Disabled delete button styling for non-admins */
        .delete-btn.disabled {
            background: #a0aec0;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .delete-btn.disabled:hover {
            background: #a0aec0;
            transform: none;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #a0aec0;
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        .empty-text {
            font-size: 1.2rem;
            font-weight: 500;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        .task-item.deleting {
            animation: fadeOut 0.3s ease forwards;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .main-container {
                margin: 10px;
                padding: 20px;
            }
            
            .form-group {
                flex-direction: column;
            }
            
            .task-content {
                flex-direction: column;
                gap: 15px;
            }
            
            .task-actions {
                justify-content: flex-end;
            }
        }
      `}</style>

      <div className="main-container">
        <div className="task-form">
          <div className="form-group">
            <input 
              type="text" 
              className="task-input" 
              placeholder="New task title" 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createTask(e);
                }
              }}
            />
            <button type="button" className="create-btn" onClick={createTask}>
              Create
            </button>
          </div>
        </div>

        <div className="tasks-section">
          <h2 className="section-title">
            📋 Pending Tasks
            <span className="task-count">{pendingTasks.length}</span>
          </h2>
          <ul className="task-list">
            {pendingTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <div className="empty-text">No pending tasks. Great job!</div>
              </div>
            ) : (
              pendingTasks.map(task => (
                <TaskItem key={task._id} task={task} />
              ))
            )}
          </ul>
        </div>

        {completedTasks.length > 0 && (
          <div className="tasks-section">
            <h2 className="section-title">
              ✅ Completed Tasks
              <span className="task-count">{completedTasks.length}</span>
            </h2>
            <ul className="task-list">
              {completedTasks.map(task => (
                <TaskItem key={task._id} task={task} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;