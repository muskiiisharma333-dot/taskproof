import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task } from "../types";
import { initialTasks } from "../services/mockData";

interface TaskContextType {
  tasks: Task[];
  addTask: (description: string, tags: string[]) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage or initial mock data
    const stored = localStorage.getItem("taskproof_tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("taskproof_tasks", JSON.stringify(newTasks));
  };

  const addTask = (description: string, tags: string[]) => {
    const nextIdNum = tasks.length > 0 
      ? Math.max(...tasks.map(t => parseInt(t.id.split("-")[1] || "0"))) + 1 
      : 8493;
    
    const newTask: Task = {
      id: `TK-${nextIdNum}`,
      description,
      tags: tags.length > 0 ? tags : ["General"],
      status: "Pending",
      progress: 0,
      owner: "Stellar Dev",
      time: "Just now",
      timestamp: new Date().toISOString()
    };

    saveTasks([newTask, ...tasks]);
  };

  const updateProgress = (id: string, progress: number) => {
    const updated = tasks.map((task) => {
      if (task.id === id) {
        const nextStatus: Task["status"] = progress === 100 
          ? "Completed" 
          : progress > 0 
            ? "Processing" 
            : "Pending";
        return {
          ...task,
          progress: Math.min(100, Math.max(0, progress)),
          status: nextStatus,
          time: "Just now"
        };
      }
      return task;
    });
    saveTasks(updated);
  };

  const updateStatus = (id: string, status: Task["status"]) => {
    const updated = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          status,
          progress: status === "Completed" ? 100 : task.progress,
          time: "Just now"
        };
      }
      return task;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const filtered = tasks.filter((task) => task.id !== id);
    saveTasks(filtered);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateProgress,
        updateStatus,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
