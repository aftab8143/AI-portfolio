"use client";

import { cn, formatDate, generateRecentActivity } from "@/lib/utils.js";
import { useState } from "react";
import {
  Plus,
  Bell,
  ActivityIcon,
  User,
  Mail,
  User2,
  Clock,
  PlusCircle,
  CheckCircle,
  X,
  Search,
} from "lucide-react";
import { FaPeopleCarry, FaTasks } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Updated color palette
const colors = {
  primary: {
    light: "#6366f1",
    main: "#4f46e5",
    dark: "#4338ca",
  },
  secondary: {
    light: "#ec4899",
    main: "#db2777",
    dark: "#be185d",
  },
  success: {
    light: "#10b981",
    main: "#059669",
    dark: "#047857",
  },
  warning: {
    light: "#f59e0b",
    main: "#d97706",
    dark: "#b45309",
  },
  danger: {
    light: "#ef4444",
    main: "#dc2626",
    dark: "#b91c1c",
  },
  info: {
    light: "#06b6d4",
    main: "#0891b2",
    dark: "#0e7490",
  },
  dark: {
    light: "#334155",
    main: "#1e293b",
    dark: "#0f172a",
  },
  light: {
    light: "#f8fafc",
    main: "#f1f5f9",
    dark: "#e2e8f0",
  },
};

export function SidebarItem({ icon, label, active, onClick, expanded }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 w-full px-5 py-3 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden",
        active
          ? `bg-gradient-to-r from-${colors.primary.dark} to-${colors.primary.main} text-white shadow-lg`
          : "text-white/90 hover:bg-white/10 hover:text-white"
      )}
    >
      {/* Left Active Bar */}
      {active && (
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-${colors.info.main} rounded-tr-md rounded-br-md shadow-md`}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-6 h-6 flex items-center justify-center text-xl transition-all duration-200",
          active
            ? `text-${colors.info.main} drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]`
            : "group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
        )}
      >
        {icon}
      </div>

      {/* Label */}
      {expanded && (
        <span
          className={cn(
            "text-sm font-medium transition-all duration-200",
            active ? "text-white" : "text-white/90"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export function OverviewTab({ projects, tasks, team }) {
  const activeProjects = projects.filter(
    (p) => p.status !== "completed"
  ).length;
  const dueTasks = tasks.filter((t) => t.status !== "completed").length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "completed" && new Date(t.dueDate) < new Date()
  ).length;

  const projectBudget = `$${projects
    .reduce((sum, p) => sum + p.budget, 0)
    .toLocaleString()}`;

  const recentActivity = generateRecentActivity(projects, tasks);
  const priorityTasks = tasks
    .filter((t) => t.priority === "high" && t.status !== "completed")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          change={`+${Math.floor(Math.random() * 3)}`}
          icon={<ActivityIcon className="text-indigo-600" />}
        />
        <StatCard
          title="Tasks Due"
          value={dueTasks}
          change={`${Math.random() > 0.5 ? "+" : "-"}${Math.floor(
            Math.random() * 5
          )}`}
          icon={<FaTasks className="text-indigo-600" />}
        />
        <StatCard
          title="Team Members"
          value={team.length}
          change={`+${Math.floor(Math.random() * 2)}`}
          icon={<FaPeopleCarry className="text-indigo-600" />}
        />
        <StatCard
          title="Project Budget"
          value={projectBudget}
          change={`+${Math.floor(Math.random() * 5)}%`}
          icon={<ActivityIcon className="text-indigo-600" />}
        />
      </div>

      {/* Timeline + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Timeline Section */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">
            Project Timeline
          </h3>

          <div className="relative h-72 bg-white/5 rounded-xl border border-white/20 overflow-hidden">
            <ProjectTimeline projects={projects} />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">
            Recent Activity
          </h3>

          <div className="space-y-5 max-h-[18rem] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <ActivityItem
                  key={index}
                  user={activity.user}
                  action={activity.action}
                  project={activity.project}
                  time={activity.time}
                />
              ))
            ) : (
              <p className="text-sm text-white/70">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Priority Tasks Table */}
      <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Priority Tasks
          </h3>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-white rounded-xl overflow-hidden">
            <thead className="bg-white/20 text-white/90">
              <tr>
                {["Task", "Project", "Due Date", "Priority", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {priorityTasks.map((task, index) => {
                const project =
                  projects.find((p) => p.id === task.projectId)?.name ||
                  "Unknown";
                const bgClass = index % 2 === 0 ? "bg-white/5" : "bg-white/0";

                return (
                  <tr
                    key={task.id}
                    className={`${bgClass} hover:bg-white/10 transition`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{project}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-500/20 text-red-400"
                            : task.priority === "Medium"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-500/20 text-green-400"
                            : task.status === "In Progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : task.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ProjectTimeline({ projects }) {
  const now = new Date();
  const minDate = new Date(
    Math.min(...projects.map((p) => new Date(p.startDate)))
  );
  const maxDate = new Date(
    Math.max(...projects.map((p) => new Date(p.endDate)))
  );

  // Add padding to timeline
  minDate.setDate(minDate.getDate() - 15);
  maxDate.setDate(maxDate.getDate() + 15);

  const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

  const getLeftOffset = (date) =>
    ((new Date(date) - minDate) / (1000 * 60 * 60 * 24) / totalDays) * 100;

  return (
    <div className="relative w-full h-64 p-4 bg-white/10 rounded-lg shadow border border-white/20">
      {/* Timeline axis */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-dotted bg-white/30" />

      {/* Now marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-400"
        style={{ left: `${getLeftOffset(now)}%` }}
      >
        <div className="absolute -top-6 -left-4 text-xs text-red-400 font-semibold">
          Now
        </div>
      </div>

      {/* Projects */}
      {projects.map((project, index) => {
        const left = getLeftOffset(project.startDate);
        const width = getLeftOffset(project.endDate) - left;

        const colors = {
          active: "bg-indigo-500",
          completed: "bg-green-500",
          planning: "bg-yellow-500",
          onHold: "bg-gray-400",
        };

        return (
          <div
            key={index}
            className={`absolute h-4 rounded-full transition-all duration-300 ${
              colors[project.status] || "bg-gray-300"
            }`}
            style={{
              top: `${30 + index * 30}px`,
              left: `${left}%`,
              width: `${width}%`,
            }}
          >
            <div className="absolute -top-5 left-0 text-xs font-medium text-white">
              {project.name}
            </div>
          </div>
        );
      })}

      {/* Optional: Date labels at ends */}
      <div className="absolute bottom-2 left-0 text-xs text-white/70">
        {minDate.toLocaleDateString()}
      </div>
      <div className="absolute bottom-2 right-0 text-xs text-white/70">
        {maxDate.toLocaleDateString()}
      </div>
    </div>
  );
}

export function StatCard({ title, value, change, icon }) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-md transform transition-transform duration-200 hover:scale-[1.02] will-change-transform">
      <div className="flex items-center justify-between">
        {/* Text Info */}
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h3 className="text-4xl font-bold text-white mt-1">{value}</h3>
          <p
            className={`text-sm mt-2 font-semibold flex items-center gap-1 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "▲" : "▼"} {change} from last week
          </p>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-indigo-400 text-xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function ProjectsTab({ projects, onAddProject }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg text-white space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input
            icon={<Search className="text-white/70" />}
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={onAddProject}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-white/50 text-sm border border-dashed border-white/20 rounded-lg">
            No projects found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectCard({ project }) {
  const statusStyles = {
    planning: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40",
    active: "bg-green-500/20 text-green-400 ring-1 ring-green-500/40",
    "on-hold": "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40",
    completed: "bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/40",
  };

  const progressColor =
    project.progress < 30
      ? "bg-red-500"
      : project.progress < 70
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-white/20 bg-white/5 text-white shadow hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold leading-snug">{project.name}</h4>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
              statusStyles[project.status]
            }`}
          >
            {project.status.replace("-", " ")}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-2 rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/60">Start</p>
            <p>{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-white/60">End</p>
            <p>{formatDate(project.endDate)}</p>
          </div>
          <div>
            <p className="text-white/60">Budget</p>
            <p>${project.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/60">Tasks</p>
            <p>{Math.floor(project.budget / 500)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-3 bg-white/5 flex justify-end">
        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition">
          View Details →
        </button>
      </div>
    </motion.div>
  );
}

export function TaskItem({ task, onComplete }) {
  const priorityColors = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-green-500/20 text-green-400",
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015, boxShadow: "0px 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-white/20 rounded-lg p-4 bg-white/10 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {/* Completion Checkbox */}
          <button
            onClick={() => onComplete(task.id)}
            className={`mt-1 flex-shrink-0 h-5 w-5 rounded border transition ${
              task.status === "completed"
                ? "bg-green-500 border-green-500"
                : "border-white/30"
            }`}
          >
            {task.status === "completed" && (
              <svg
                className="h-3 w-3 text-white mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Task Details */}
          <div className="ml-3">
            <h4
              className={`text-sm font-medium transition ${
                task.status === "completed"
                  ? "text-white/50 line-through"
                  : "text-white"
              }`}
            >
              {task.name}
            </h4>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`px-2 py-1 rounded-full font-medium capitalize ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
              <span className="text-white/60">
                Due {formatDate(task.dueDate)}
              </span>
              {isOverdue && (
                <span className="text-red-400 font-semibold">Overdue</span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Button (Three Dots) */}
        <button className="text-white/40 hover:text-white transition">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export function TasksTab({ tasks, onCompleteTask }) {
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.status === "completed";
    if (filter === "active") return task.status !== "completed";
    if (filter === "overdue")
      return new Date(task.dueDate) < new Date() && task.status !== "completed";
    return true;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onCompleteTask({
        id: `task-${tasks.length + 1}`,
        name: newTask,
        status: "pending",
        priority: "medium",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "project-1",
      });
      setNewTask("");
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/20 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {showForm ? (
              <X size={16} className="mr-2" />
            ) : (
              <PlusCircle size={16} className="mr-2" />
            )}
            {showForm ? "Cancel" : "New Task"}
          </Button>
        </div>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="add-task-form"
            onSubmit={handleAddTask}
            className="bg-white/10 border border-white/20 p-4 rounded-xl grid md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Task description"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="md:col-span-2 bg-white/10 border-white/20 text-white"
            />
            <Select defaultValue="medium">
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Add Task
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 transition"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-white/90">{task.name}</span>
                  <span className="text-xs text-white/50">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="capitalize bg-white/10 border-white/20 text-white"
                  >
                    {task.priority}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onCompleteTask(task.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={16} />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50 text-sm py-10 border border-dashed border-white/20 rounded-lg"
            >
              No tasks found matching your filter.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function TeamTab({ team }) {
  const [teamMembers, setTeamMembers] = useState(team);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      const newMember = {
        id: `member-${teamMembers.length + 1}`,
        name: email.split("@")[0],
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        joined: new Date().toISOString(),
      };
      setTeamMembers([...teamMembers, newMember]);
      setEmail("");
      setRole("member");
      setShowInviteForm(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button
          variant="secondary"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setShowInviteForm(!showInviteForm)}
        >
          {showInviteForm ? "Cancel" : "+ Invite Member"}
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <form
          onSubmit={handleInviteSubmit}
          className="p-5 rounded-xl bg-white/10 border border-white/20 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Email Input */}
            <div className="md:col-span-2">
              <Label htmlFor="email" className="text-white/90 mb-1 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <Label htmlFor="role" className="text-white/90 mb-1 block">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900/80 text-white border-white/20 backdrop-blur-md">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-white/50 border border-dashed border-white/20 rounded-lg">
            No team members found.
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamMemberCard({ member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/20 bg-white/5 backdrop-blur-lg text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        <img
          src={member.avatar}
          alt={member.name}
          className="h-14 w-14 rounded-full border-2 border-indigo-500 shadow-sm"
        />
        <div>
          <h4 className="font-semibold text-base tracking-tight">
            {member.name}
          </h4>
          <p className="text-sm text-white/70">{member.email}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 pb-4 text-sm">
        <div>
          <p className="text-white/60">Role</p>
          <p className="capitalize font-medium">{member.role}</p>
        </div>
        <div>
          <p className="text-white/60">Joined</p>
          <p>{formatDate(member.joined)}</p>
        </div>
        <div>
          <p className="text-white/60">Tasks</p>
          <p>{Math.floor(Math.random() * 20) + 5}</p>
        </div>
        <div>
          <p className="text-white/60">Projects</p>
          <p>{Math.floor(Math.random() * 5) + 1}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-white/5">
        <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition font-semibold">
          <Mail size={16} />
          Message
        </button>
        <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition font-semibold">
          <User2 size={16} />
          Profile
        </button>
      </div>
    </motion.div>
  );
}

export function SettingsTab() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    timezone: "UTC",
    weeklyReport: true,
    language: "en",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 max-w-full mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Account Settings
      </h2>

      {/* Toggle Settings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">Dark Mode</span>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={() => handleToggle("darkMode")}
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">
            Email Notifications
          </span>
          <Switch
            checked={settings.notifications}
            onCheckedChange={() => handleToggle("notifications")}
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">
            Weekly Reports
          </span>
          <Switch
            checked={settings.weeklyReport}
            onCheckedChange={() => handleToggle("weeklyReport")}
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>
      </div>

      {/* Select Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-white/90">
            Timezone
          </label>
          <Select
            value={settings.timezone}
            onValueChange={(v) => handleSelectChange("timezone", v)}
          >
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="EST">Eastern (EST)</SelectItem>
              <SelectItem value="PST">Pacific (PST)</SelectItem>
              <SelectItem value="CET">Central Europe (CET)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-white/90">
            Language
          </label>
          <Select
            value={settings.language}
            onValueChange={(v) => handleSelectChange("language", v)}
          >
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export function ActivityItem({ user, action, project, time }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/10 transition-all">
      {/* Avatar / Icon */}
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-lg shadow-inner">
        <User></User>
      </div>

      {/* Activity Content */}
      <div className="flex-1">
        <p className="text-sm text-white leading-snug">
          <span className="font-semibold">{user}</span> {action} in{" "}
          <span className="text-indigo-400 font-medium">{project}</span>
        </p>
        <p className="text-xs text-white/50 mt-1">{time}</p>
      </div>
    </div>
  );
}

export function ReportsTab({ projects, tasks }) {
  const [reportType, setReportType] = useState("project-progress");

  const reportData = (() => {
    if (reportType === "project-progress") {
      return projects.map((p) => ({
        name: p.name,
        progress: p.progress,
        budget: p.budget,
      }));
    } else if (reportType === "task-distribution") {
      const counts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([status, count]) => ({
        status,
        count,
      }));
    } else {
      const counts = tasks.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([priority, count]) => ({
        priority,
        count,
      }));
    }
  })();

  return (
    <div className="space-y-8">
      {/* Header + Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Reports Overview
        </h2>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[220px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900/80 border border-white/20 backdrop-blur-md text-white">
            <SelectItem value="project-progress">Project Progress</SelectItem>
            <SelectItem value="task-distribution">Task Distribution</SelectItem>
            <SelectItem value="task-priority">Task Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart Area */}
      <Card className="bg-white/10 border border-white/20 backdrop-blur-md shadow-lg rounded-xl">
        <CardHeader className="text-white font-semibold text-lg">
          {reportType
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <ReportVisualization type={reportType} data={reportData} />
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SummaryCard label="Active Projects" value="8" color="blue" />
        <SummaryCard label="Completed Tasks" value="24" color="purple" />
        <SummaryCard label="Team Productivity" value="82%" color="green" />
      </div>
    </div>
  );
}

export function SummaryCard({ label, value, color }) {
  const colorMap = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
    },
  };

  const { bg, text, border } = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={`${bg} ${border} border backdrop-blur-sm`}>
        <CardHeader className={`text-sm font-medium ${text}`}>
          {label}
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold text-white`}>{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ReportVisualization({ type, data = [] }) {
  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const fallbackProjectData = [
    { name: "Website Redesign", progress: 92 },
    { name: "Mobile App", progress: 68 },
    { name: "Marketing Push", progress: 41 },
    { name: "New Launch", progress: 18 },
  ];

  const fallbackTaskData = [
    { status: "completed", count: 22 },
    { status: "pending", count: 12 },
    { status: "in progress", count: 6 },
  ];

  const fallbackPriorityData = [
    { priority: "high", count: 7 },
    { priority: "medium", count: 14 },
    { priority: "low", count: 4 },
  ];

  if (type === "project-progress") {
    const chartData = data.length ? data : fallbackProjectData;

    return (
      <div className="space-y-5 w-full">
        {chartData.map((project, index) => {
          const color =
            project.progress < 30
              ? "from-red-400 to-red-600"
              : project.progress < 70
              ? "from-yellow-400 to-yellow-500"
              : "from-green-400 to-green-500";

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm font-semibold text-white/80">
                <span>{project.name}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "task-distribution") {
    const chartData = data.length ? data : fallbackTaskData;
    const pieColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full h-full">
        {/* Donut */}
        <div className="relative w-48 h-48 rounded-full bg-white/5 shadow-inner">
          <svg
            viewBox="0 0 36 36"
            className="transform -rotate-90 w-full h-full"
          >
            {
              chartData.reduce(
                (acc, item, i) => {
                  const val = (item.count / total) * 100;
                  const start = acc.total;
                  acc.total += val;
                  acc.segments.push(
                    <circle
                      key={i}
                      className="transition-all duration-700"
                      stroke={pieColors[i % pieColors.length]}
                      strokeWidth="3.2"
                      strokeDasharray={`${val}, 100`}
                      strokeDashoffset={100 - start}
                      fill="none"
                      cx="18"
                      cy="18"
                      r="15.915"
                    />
                  );
                  return acc;
                },
                { total: 0, segments: [] }
              ).segments
            }
          </svg>
          <div className="absolute inset-6 flex flex-col items-center justify-center bg-black/10 rounded-full">
            <span className="text-xl font-bold text-white">{total}</span>
            <span className="text-sm text-white/60">Tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 text-sm">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pieColors[i % pieColors.length] }}
              />
              <span className="capitalize text-white/80">{item.status}</span>
              <span className="ml-auto text-white">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "task-priority") {
    const chartData = data.length ? data : fallbackPriorityData;
    const barColors = ["#ef4444", "#f59e0b", "#10b981"];
    const max = Math.max(...chartData.map((item) => item.count));

    return (
      <div className="flex items-end justify-around h-60 w-full px-4">
        {chartData.map((item, index) => {
          const height = (item.count / max) * 100;
          return (
            <div key={index} className="flex flex-col items-center w-1/5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8 }}
                className="w-full rounded-t-md"
                style={{
                  backgroundColor: barColors[index % barColors.length],
                }}
              />
              <span className="text-xs mt-2 capitalize text-white/70">
                {item.priority}
              </span>
              <span className="text-xs text-white">{item.count}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export function NotificationBell({ notifications, onDismiss }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full bg-white/10 border border-white/20 shadow-sm hover:bg-white/20 transition"
      >
        <Bell className="w-5 h-5 text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scroll">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-white/10 transition border-b border-white/10 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-white/70 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="text-white/40 hover:text-red-400 text-sm ml-3"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center px-6 py-10 text-white/50 text-sm">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function UserProfile() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="https://randomuser.me/api/portraits/women/44.jpg"
        alt="User"
        className="w-8 h-8 rounded-full border-2 border-white/20"
      />
      <span className="text-sm font-medium text-white">Sarah Johnson</span>
    </div>
  );
}
