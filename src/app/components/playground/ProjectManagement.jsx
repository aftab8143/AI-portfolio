"use client";

import { useState, useEffect } from "react";
import {
  Home,
  ClipboardList,
  CheckCircle,
  Users,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  SidebarItem,
  SettingsTab,
  TasksTab,
  TeamTab,
  OverviewTab,
  ReportsTab,
  UserProfile,
  NotificationBell,
  ProjectsTab,
} from "../../components/Mockups/ProjectDashboard.jsx";

import {
  generateDummyNotifications,
  generateDummyProjects,
  generateDummyTasks,
  generateDummyTeam,
} from "@/lib/utils.js";

export default function ProjectDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(generateDummyProjects());
      let tasks = generateDummyTasks();
      setTasks(tasks);
      setTeamMembers(generateDummyTeam());
      setNotifications(generateDummyNotifications(tasks));
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddProject = () => {
    const newProject = {
      id: `project-${projects.length + 1}`,
      name: `New Project ${projects.length + 1}`,
      status: "planning",
      progress: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      budget: 5000 + Math.floor(Math.random() * 20000),
      team: [],
    };
    setProjects([...projects, newProject]);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "completed" } : task
      )
    );
  };

  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-indigo-900 transition-all duration-300 overflow-hidden border-r border-indigo-800`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-800">
          {sidebarOpen && (
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              <span className="text-indigo-300">Project</span>
              <span className="text-cyan-400">Hub</span>
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-indigo-800 text-indigo-300 hover:text-white transition"
          >
            {sidebarOpen ? (
              <ChevronLeft size={22} />
            ) : (
              <ChevronRight size={22} />
            )}
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-2">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<ClipboardList size={20} />}
            label="Projects"
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<CheckCircle size={20} />}
            label="Tasks"
            active={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Team"
            active={activeTab === "team"}
            onClick={() => setActiveTab("team")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<BarChart2 size={20} />}
            label="Reports"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            expanded={sidebarOpen}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold capitalize text-white">
              {
                {
                  overview: "Project Overview",
                  projects: "My Projects",
                  tasks: "Task Management",
                  team: "Team Members",
                  reports: "Project Reports",
                  settings: "Settings",
                }[activeTab]
              }
            </h2>
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                onDismiss={handleDismissNotification}
              />
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  projects={projects}
                  tasks={tasks}
                  team={teamMembers}
                />
              )}
              {activeTab === "projects" && (
                <ProjectsTab
                  projects={projects}
                  onAddProject={handleAddProject}
                />
              )}
              {activeTab === "tasks" && (
                <TasksTab tasks={tasks} onCompleteTask={handleCompleteTask} />
              )}
              {activeTab === "team" && <TeamTab team={teamMembers} />}
              {activeTab === "reports" && (
                <ReportsTab projects={projects} tasks={tasks} />
              )}
              {activeTab === "settings" && <SettingsTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
