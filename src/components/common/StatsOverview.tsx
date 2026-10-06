import React from 'react';
import { BookOpen, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';
import type { AssignmentCounts } from '../../features/assignments/assignmentSelectors';

export interface StatsOverviewProps {
  counts: AssignmentCounts;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ counts }) => {
  const completionRate =
    counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <section className="stats-overview-section" aria-label="Thống kê tổng quan">
      <div className="stats-card stat-total">
        <div className="stat-icon-wrapper bg-indigo-soft">
          <BookOpen className="stat-icon text-indigo" size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Tổng bài tập</span>
          <span className="stat-value">{counts.all}</span>
        </div>
      </div>

      <div className="stats-card stat-pending">
        <div className="stat-icon-wrapper bg-amber-soft">
          <Clock className="stat-icon text-amber" size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Chưa hoàn thành</span>
          <span className="stat-value">{counts.pending}</span>
        </div>
      </div>

      <div className="stats-card stat-overdue">
        <div className="stat-icon-wrapper bg-rose-soft">
          <AlertOctagon className="stat-icon text-rose" size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Quá hạn</span>
          <span className="stat-value text-rose">{counts.overdue}</span>
        </div>
      </div>

      <div className="stats-card stat-completed">
        <div className="stat-icon-wrapper bg-emerald-soft">
          <CheckCircle2 className="stat-icon text-emerald" size={22} />
        </div>
        <div className="stat-content">
          <div className="stat-label-row">
            <span className="stat-label">Đã hoàn thành</span>
            <span className="stat-rate">{completionRate}%</span>
          </div>
          <span className="stat-value text-emerald">{counts.completed}</span>
        </div>
      </div>
    </section>
  );
};
