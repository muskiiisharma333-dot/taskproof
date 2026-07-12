import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MetricCard } from "../components/shared/MetricCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage: React.FC = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#191c1d",
        bodyColor: "#4a454c",
        borderColor: "rgba(107, 87, 121, 0.15)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        boxPadding: 4,
        titleFont: { family: "Outfit", weight: "bold" as const },
        bodyFont: { family: "Outfit" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(107, 87, 121, 0.05)" },
        ticks: {
          color: "#7c757d",
          font: { family: "Outfit", size: 10, weight: "bold" as const },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#7c757d",
          font: { family: "Outfit", size: 10, weight: "bold" as const },
        },
      },
    },
  };

  // Weekly Activity datasets
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [42, 58, 64, 78, 52, 30, 35],
        backgroundColor: "#cdb4db",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Monthly Activity datasets
  const monthlyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Proofs Submitted",
        data: [120, 240, 190, 310],
        borderColor: "#40627b",
        backgroundColor: "rgba(190, 225, 255, 0.2)",
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#40627b",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <header className="mb-6 select-none">
        <h1 className="font-headline-lg text-3xl text-primary font-bold mb-2">Analytics</h1>
        <p className="font-body-lg text-on-surface-variant">Core performance metrics and verification statistics.</p>
      </header>

      {/* Structured Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter select-none">
        <MetricCard
          title="Tasks Created"
          value="14,209"
          change="+12% this week"
          changeType="up"
          icon="assignment"
          colorTheme="primary"
        />
        <MetricCard
          title="Completion Rate"
          value="90.4%"
          change="+3.4% this week"
          changeType="up"
          icon="task_alt"
          colorTheme="secondary"
        />
        <MetricCard
          title="Proofs Submitted"
          value="1,240"
          change="+8.2% this week"
          changeType="up"
          icon="verified"
          colorTheme="tertiary"
        />
        <MetricCard
          title="Verification Success"
          value="99.9%"
          change="Stable"
          changeType="neutral"
          icon="bolt"
          colorTheme="purple"
        />
      </section>

      {/* Simplified Activity Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Weekly Activity */}
        <div className="glass-card p-6 bg-white/70 dark:bg-inverse-surface/75 border border-white/40 rounded-2xl">
          <h3 className="font-headline-md text-base text-on-surface mb-6 font-bold select-none">Weekly Activity</h3>
          <div className="h-64 relative w-full">
            <Bar data={weeklyData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="glass-card p-6 bg-white/70 dark:bg-inverse-surface/75 border border-white/40 rounded-2xl">
          <h3 className="font-headline-md text-base text-on-surface mb-6 font-bold select-none">Monthly Activity</h3>
          <div className="h-64 relative w-full">
            <Line data={monthlyData} options={chartOptions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
