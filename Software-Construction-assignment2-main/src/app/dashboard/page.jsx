"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editId, setEditId] = useState(null);

  const getTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // Update existing task
      await fetch(`/api/tasks/${editId}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      // Create new task
      await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          userId: 1, // Replace with real user id if you add auth
        }),
      });
    }

    setForm({ title: "", description: "", dueDate: "" });
    getTasks();
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0], // format date to yyyy-mm-dd
      status: task.status,
    });
    setEditId(task.id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    getTasks();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {editId ? "Edit Task" : "Create Task"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-6 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-gray-300 text-sm font-medium mb-1"
              >
                Title
              </label>
              <input
                id="title"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-gray-300 text-sm font-medium mb-1"
              >
                Description
              </label>
              <input
                id="description"
                placeholder="Task description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-gray-300 text-sm font-medium mb-1"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-gray-300 text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={form.status || "todo"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {editId ? "Update Task" : "Create Task"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      title: "",
                      description: "",
                      dueDate: "",
                      status: "todo",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-4">Tasks List</h2>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition duration-150"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-gray-300 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "todo"
                          ? "bg-yellow-600 text-yellow-100"
                          : task.status === "inprogress"
                          ? "bg-blue-600 text-blue-100"
                          : "bg-green-600 text-green-100"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded hover:bg-gray-700 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-gray-700 transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
