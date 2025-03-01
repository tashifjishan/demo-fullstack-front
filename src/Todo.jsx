import React, { useState, useEffect } from "react";

const TodoApp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Check if user is logged in when the app mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setIsLoggedIn(true);
      fetchAllTasks(storedEmail, storedPassword);
    }
  }, []);

  // Handle login
  const handleLogin = async () => {
    const response = await fetch("https://fullstackback-omega.vercel.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      setIsLoggedIn(true);
      fetchAllTasks(email, password); // Fetch tasks after successful login
    } else {
      alert("Invalid email or password.");
    }
  };

  // Fetch all tasks for the user
  const fetchAllTasks = async (email, password) => {
    const response = await fetch("https://fullstackback-omega.vercel.app/task/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const tasks = await response.json();
      console.log(tasks.data)
      setTodos(tasks.data.todoList);
    } else {
      alert("Failed to fetch tasks.");
    }
  };

  // Handle adding a new task
  const handleAddTask = async () => {
    if (task.trim() === "") return; // Prevent adding empty tasks

    const response = await fetch("https://fullstackback-omega.vercel.app/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, task }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTodos(prevTodos => [...prevTodos, task]);
      setTask(""); // Clear the input field
    } else {
      alert("Failed to add task.");
    }
  };






  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setTodos([]);
  };

  return (
    <div className="max-w-sm mx-auto p-6 rounded-lg shadow-lg bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

      {!isLoggedIn ? (
        
        <div>
        <h1>Login form</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-black placeholder:text-black w-full p-2 mb-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-black placeholder:text-black w-full p-2 mb-4 rounded-md"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      ) : (
        // Task Input and Task List
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded-md mb-4 w-full"
          >
            Logout
          </button>

          {/* Task Input */}
          <div className="flex mb-4">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="border-2 border-black placeholder:text-black flex-1 p-2 border border-gray-300 rounded-l-md"
              placeholder="Add a new task"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          {/* Task List */}
          <ul className="space-y-2">
            {todos.map((todo, index) => (
              <li
                key={todo + index}
                className={`flex justify-between items-center p-2 border-b bg-white`}
              >

                {todo}


              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
