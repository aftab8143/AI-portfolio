import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper functions
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Dummy data generators
export function generateDummyProjects() {
    const statuses = ["planning", "active", "active", "on-hold", "completed"];
    const projects = [];

    for (let i = 1; i <= 8; i++) {
        const startDate = new Date(
            Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000,
        );
        const endDate = new Date(
            startDate.getTime() +
            (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000,
        );

        projects.push({
            id: `project-${i}`,
            name: `Project ${i}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            progress: Math.floor(Math.random() * 100),
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
            budget: 5000 + Math.floor(Math.random() * 20000),
            team: [],
        });
    }

    return projects;
}

export function generateDummyTasks() {
    const priorities = ["high", "medium", "low"];
    const statuses = ["pending", "in-progress", "completed"];
    const tasks = [];

    for (let i = 1; i <= 15; i++) {
        const dueDate = new Date(
            Date.now() + Math.floor(Math.random() * 30 - 10) * 24 * 60 * 60 * 1000,
        );

        tasks.push({
            id: `task-${i}`,
            name: `Task ${i}: ${["Design", "Develop", "Test", "Review", "Deploy"][
                Math.floor(Math.random() * 5)
                ]
                } ${["homepage", "API", "database", "UI", "feature"][
                Math.floor(Math.random() * 5)
                ]
                }`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            dueDate: dueDate.toISOString().split("T")[0],
            projectId: `project-${Math.floor(Math.random() * 8) + 1}`,
        });
    }

    return tasks;
}

export function generateDummyTeam() {
    const roles = ["member", "admin", "manager"];
    const team = [];
    const names = [
        "Alex Johnson",
        "Maria Garcia",
        "James Smith",
        "Sarah Williams",
        "David Brown",
        "Emily Davis",
        "Robert Wilson",
        "Jennifer Miller",
    ];

    for (let i = 0; i < 8; i++) {
        const email = `${names[i].split(" ")[0].toLowerCase()}@example.com`;
        team.push({
            id: `member-${i + 1}`,
            name: names[i],
            email,
            role: roles[Math.min(i, 2)],
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            joined: new Date(
                Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
            ).toISOString(),
        });
    }

    return team;
}

export function generateDummyNotifications(tasks) {
    // Add tasks as parameter
    const actions = [
        "mentioned you in a comment",
        "assigned you a task",
        "requested your review",
        "completed a task you assigned",
        "updated project requirements",
    ];

    const projects = [
        "Website Redesign",
        "Mobile App",
        "Marketing Campaign",
        "Internal Tools",
    ];

    return [
        {
            id: "1",
            title: "New mention",
            message: `John Doe ${actions[0]} on ${projects[0]}`,
            time: "2 hours ago",
        },
        {
            id: "2",
            title: "Task assigned",
            message: `You've been assigned to "${tasks[0].name}"`,
            time: "1 day ago",
        },
        {
            id: "3",
            title: "Project update",
            message: `${projects[1]} timeline has been updated`,
            time: "3 days ago",
        },
    ];
}

export function generateRecentActivity(projects, tasks) {
    const users = ["John D.", "Sarah M.", "Alex K.", "Team"];
    const actions = [
        "completed task",
        "uploaded files",
        "commented",
        "scheduled meeting",
        "updated status",
    ];

    return [
        {
            user: users[0],
            action: actions[0],
            project: projects[0].name,
            time: "2h ago",
        },
        {
            user: users[1],
            action: actions[1],
            project: projects[1].name,
            time: "4h ago",
        },
        {
            user: users[2],
            action: actions[2],
            project: projects[2].name,
            time: "1d ago",
        },
        {
            user: users[3],
            action: actions[3],
            project: "All Projects",
            time: "1d ago",
        },
        {
            user: users[0],
            action: actions[4],
            project: tasks[0].name,
            time: "2d ago",
        },
    ];
}

