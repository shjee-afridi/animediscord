'use client';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface DayData {
  date: string;
  visit: number;
  copy: number;
  join: number;
  bump: number;
  rating: number;
}

interface DailyStatsProps {
  data: DayData[];
  className?: string;
}

export default function DailyStatsChart({ data, className = '' }: DailyStatsProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const labels = data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Visits',
          data: data.map(d => d.visit),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Copies',
          data: data.map(d => d.copy),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Joins',
          data: data.map(d => d.join),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Bumps',
          data: data.map(d => d.bump),
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: '#d1d5db',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const date = new Date(data[dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
          },
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const dayData = data[dataIndex];
            const prevData = dataIndex > 0 ? data[dataIndex - 1] : dayData;
            
            const changes: string[] = [];
            const metrics = [
              { key: 'visit', label: 'Visits', current: dayData.visit, prev: prevData.visit },
              { key: 'copy', label: 'Copies', current: dayData.copy, prev: prevData.copy },
              { key: 'join', label: 'Joins', current: dayData.join, prev: prevData.join },
              { key: 'bump', label: 'Bumps', current: dayData.bump, prev: prevData.bump },
            ];
            
            metrics.forEach(metric => {
              const diff = metric.current - metric.prev;
              if (diff !== 0) {
                const symbol = diff > 0 ? '↗️' : '↘️';
                const sign = diff > 0 ? '+' : '';
                changes.push(`${symbol} ${metric.label}: ${sign}${diff}`);
              }
            });
            
            return changes.length > 0 ? changes : ['No changes from previous day'];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          callback: (value: any) => {
            return Number.isInteger(value) ? value : '';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  // Calculate daily changes and spikes
  const dailyChanges = useMemo(() => {
    if (!data || data.length < 2) return [];
    
    return data.slice(1).map((day, index) => {
      const prevDay = data[index];
      const changes = {
        date: day.date,
        visitChange: day.visit - prevDay.visit,
        copyChange: day.copy - prevDay.copy,
        joinChange: day.join - prevDay.join,
        bumpChange: day.bump - prevDay.bump,
      };
      
      return {
        ...changes,
        totalChange: Math.abs(changes.visitChange) + Math.abs(changes.copyChange) + 
                    Math.abs(changes.joinChange) + Math.abs(changes.bumpChange),
      };
    });
  }, [data]);

  const topSpikes = useMemo(() => {
    return dailyChanges
      .filter(change => change.totalChange > 0)
      .sort((a, b) => b.totalChange - a.totalChange)
      .slice(0, 3);
  }, [dailyChanges]);

  if (!chartData) {
    return (
      <div className={`${className} flex items-center justify-center h-64 bg-neutral-800/60 rounded-xl`}>
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Chart */}
      <div className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700">
        <h3 className="text-lg font-bold text-white mb-4">Daily Analytics (Last 30 Days)</h3>
        <div className="h-64 sm:h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {/* Spikes Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">📈 Biggest Spikes</h4>
          <div className="space-y-2">
            {topSpikes.length > 0 ? (
              topSpikes.map((spike, index) => (
                <div key={spike.date} className="text-xs">
                  <div className="text-white font-medium">
                    {new Date(spike.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-gray-400 flex flex-wrap gap-1">
                    {spike.visitChange > 0 && <span className="text-blue-400">+{spike.visitChange} visits</span>}
                    {spike.copyChange > 0 && <span className="text-green-400">+{spike.copyChange} copies</span>}
                    {spike.joinChange > 0 && <span className="text-yellow-400">+{spike.joinChange} joins</span>}
                    {spike.bumpChange > 0 && <span className="text-purple-400">+{spike.bumpChange} bumps</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500">No significant spikes</div>
            )}
          </div>
        </div>

        <div className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">📊 Latest Activity</h4>
          <div className="space-y-2">
            {data.length > 0 && (
              <div className="text-xs">
                <div className="text-white font-medium">Today</div>
                <div className="text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Visits:</span>
                    <span className="text-blue-400">{data[data.length - 1]?.visit || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Copies:</span>
                    <span className="text-green-400">{data[data.length - 1]?.copy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Joins:</span>
                    <span className="text-yellow-400">{data[data.length - 1]?.join || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bumps:</span>
                    <span className="text-purple-400">{data[data.length - 1]?.bump || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">📉 Recent Drops</h4>
          <div className="space-y-2">
            {dailyChanges.length > 0 ? (
              dailyChanges
                .filter(change => 
                  change.visitChange < 0 || change.copyChange < 0 || 
                  change.joinChange < 0 || change.bumpChange < 0
                )
                .slice(-3)
                .map((drop, index) => (
                  <div key={drop.date} className="text-xs">
                    <div className="text-white font-medium">
                      {new Date(drop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-gray-400 flex flex-wrap gap-1">
                      {drop.visitChange < 0 && <span className="text-red-400">{drop.visitChange} visits</span>}
                      {drop.copyChange < 0 && <span className="text-red-400">{drop.copyChange} copies</span>}
                      {drop.joinChange < 0 && <span className="text-red-400">{drop.joinChange} joins</span>}
                      {drop.bumpChange < 0 && <span className="text-red-400">{drop.bumpChange} bumps</span>}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-xs text-gray-500">No recent drops</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
