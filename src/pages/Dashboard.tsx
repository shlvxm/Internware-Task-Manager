import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Search, LogOut, Plus, Trash2, CheckCircle, Circle, Sun, Moon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface UserData {
  id: number;
  fullname: string;
  role: string;
  email: string;
}

interface TaskData {
  id: number;
  title: string;
  description: string;
  done: boolean;
  assignedTo: number[];
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState<number[]>([]);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(true);

  const usersEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize data from localStorage or use defaults
    const storedUsers = localStorage.getItem('team_members');
    const storedTasks = localStorage.getItem('team_tasks');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Default team members
      const defaultUsers = [
        { id: 1, username: 'admin', fullname: 'Administrator', role: 'Administrator', email: 'admin@internware.com' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('team_members', JSON.stringify(defaultUsers));
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      // Default tasks
      const defaultTasks = [
        { id: 1, title: 'Setup Project', description: 'Initialize React and Tailwind CSS', done: true, assignedTo: [] },
        { id: 2, title: 'Design UI', description: 'Create glassmorphism dashboard', done: false, assignedTo: [] },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('team_tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDesc) return;

    const newTask = {
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title: newTaskTitle,
      description: newTaskDesc,
      done: false,
      assignedTo: newTaskAssignedTo
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('team_tasks', JSON.stringify(updatedTasks));

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskAssignedTo([]);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserRole || !newUserEmail) return;

    const username = newUserEmail.split('@')[0];
    if (users.find(u => u.username === username)) {
      alert('User with this email prefix already exists');
      return;
    }

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      fullname: newUserName,
      role: newUserRole,
      email: newUserEmail
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('team_members', JSON.stringify(updatedUsers));

    setNewUserName('');
    setNewUserRole('');
    setNewUserEmail('');
    setSearchQuery('');

    setTimeout(() => {
      usersEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleDeleteUser = (id: number) => {
    if (id === 1) {
      alert('Cannot delete the primary administrator account');
      return;
    }
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('team_members', JSON.stringify(updatedUsers));
  };

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('team_tasks', JSON.stringify(updatedTasks));
  };

  const handleToggleTask = (task: TaskData) => {
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, done: !t.done } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('team_tasks', JSON.stringify(updatedTasks));
  };

  const filteredUsers = users.filter(u =>
    u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen transition-colors duration-500 relative font-sans bg-slate-50 dark:bg-[#0f172a]">
      {/* Theme Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-[#0f172a] dark:to-black z-0 transition-colors duration-500"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/20 shadow-sm dark:shadow-md transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-medium text-slate-800 dark:text-white tracking-wide transition-colors duration-500">
              InternWare
            </h1>
            <span className="hidden sm:inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 backdrop-blur-md transition-colors duration-500">
              Welcome, {user?.role === 'Administrator' ? 'Admin' : user?.fullname?.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full transition-colors bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 backdrop-blur-md"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-5 py-2 rounded-full transition-colors bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/20 backdrop-blur-md"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-slate-800 dark:text-white transition-colors duration-500">

        {/* Users Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-medium tracking-wide text-slate-800 dark:text-white transition-colors duration-500">Team Members</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-white/70 group-focus-within:text-slate-600 dark:group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-full w-full sm:w-72 bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all backdrop-blur-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Team Member Form */}
            <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] h-fit transition-colors duration-500">
              <h3 className="text-lg font-medium mb-5 tracking-wide">Add Team Member</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Role"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all backdrop-blur-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-slate-800 dark:bg-[#e2e8f0] text-white dark:text-black font-semibold hover:bg-slate-900 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-800/50 dark:focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-md flex items-center justify-center space-x-2 mt-2"
                >
                  <Plus size={20} />
                  <span>Add Member</span>
                </button>
              </form>
            </div>

            {/* Team Members List */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-[2rem] bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-white/5 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium tracking-wide text-slate-800 dark:text-white">{u.fullname}</h3>
                      <p className="text-sm mt-1 text-slate-500 dark:text-white/70">{u.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 dark:hover:bg-red-500/30 text-red-500 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100 border border-transparent hover:border-red-500/30"
                        aria-label="Delete member"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white backdrop-blur-md transition-colors duration-500">
                        {u.fullname.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/20 transition-colors duration-500">
                    <p className="text-sm text-slate-500 dark:text-white/70">{u.email}</p>
                  </div>
                </motion.div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-white/70 bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-colors duration-500">
                  No users found matching your search.
                </div>
              )}
              <div ref={usersEndRef} className="col-span-full h-1" />
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium tracking-wide text-slate-800 dark:text-white transition-colors duration-500">Tasks</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Task Form */}
            <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] h-fit transition-colors duration-500">
              <h3 className="text-lg font-medium mb-5 tracking-wide">Add New Task</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Task Description"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-transparent border border-slate-300 dark:border-white/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white focus:outline-none focus:border-slate-500 dark:focus:border-white focus:bg-white dark:focus:bg-white/5 transition-all resize-none backdrop-blur-md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white/80 px-2">Assign To:</label>
                  <div className="max-h-40 overflow-y-auto space-y-1 p-2 rounded-2xl bg-white/30 dark:bg-black/20 border border-slate-200/60 dark:border-white/10 custom-scrollbar">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={newTaskAssignedTo.includes(u.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTaskAssignedTo([...newTaskAssignedTo, u.id]);
                              } else {
                                setNewTaskAssignedTo(newTaskAssignedTo.filter(id => id !== u.id));
                              }
                            }}
                            className="peer appearance-none w-4 h-4 border border-slate-400 dark:border-white/60 bg-transparent rounded-sm checked:bg-slate-800 dark:checked:bg-white cursor-pointer transition-colors"
                          />
                          <svg className="absolute w-3 h-3 text-white dark:text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-white/90">{u.fullname}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-slate-800 dark:bg-[#e2e8f0] text-white dark:text-black font-semibold hover:bg-slate-900 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-800/50 dark:focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-md flex items-center justify-center space-x-2 mt-2"
                >
                  <Plus size={20} />
                  <span>Add Task</span>
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="lg:col-span-2 space-y-4">
              {tasks.length === 0 ? (
                <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/20 text-center text-slate-500 dark:text-white/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-colors duration-500">
                  No tasks available. Add one to get started!
                </div>
              ) : (
                tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={`p-5 rounded-[2rem] bg-white/60 dark:bg-[#0f172a]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/20 flex items-start justify-between group transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:bg-white/80 dark:hover:bg-white/5 ${task.done ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`mt-1 flex-shrink-0 transition-colors ${task.done
                          ? 'text-slate-800 dark:text-white'
                          : 'text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white'
                          }`}
                      >
                        {task.done ? <CheckCircle size={24} /> : <Circle size={24} />}
                      </button>
                      <div>
                        <h4 className={`text-lg font-medium tracking-wide ${task.done ? 'line-through text-slate-500 dark:text-white/80' : 'text-slate-800 dark:text-white'}`}>{task.title}</h4>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-white/70 leading-relaxed">
                          {task.description}
                        </p>
                        {task.assignedTo && task.assignedTo.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {task.assignedTo.map(userId => {
                              const assignedUser = users.find(u => u.id === userId);
                              return assignedUser ? (
                                <span key={userId} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200/50 dark:bg-white/10 text-slate-700 dark:text-white/90 border border-slate-300/50 dark:border-white/10">
                                  {assignedUser.fullname}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 dark:hover:bg-red-500/30 text-red-500 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100 border border-transparent hover:border-red-500/30"
                      aria-label="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
