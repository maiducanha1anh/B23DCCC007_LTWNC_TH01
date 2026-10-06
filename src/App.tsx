import React, { useEffect, useState } from 'react';
import { Plus, GraduationCap, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchAssignments, resetDefaults } from './features/assignments/assignmentSlice';
import {
  selectAssignmentStatus,
  selectAssignmentError,
} from './features/assignments/assignmentSelectors';
import { AssignmentFilter } from './features/assignments/components/AssignmentFilter';
import { AssignmentForm } from './features/assignments/components/AssignmentForm';
import { AssignmentListWithLoading } from './features/assignments/components/AssignmentList';
import { Modal } from './components/common/Modal';
import { StatsOverview } from './components/common/StatsOverview';
import { useAssignmentFilter } from './hooks/useAssignmentFilter';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAssignmentStatus);
  const error = useAppSelector(selectAssignmentError);
  const { filteredAssignments, counts } = useAssignmentFilter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initial data fetch on mount via createAsyncThunk
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAssignments());
    }
  }, [dispatch, status]);

  const handleRetry = () => {
    dispatch(fetchAssignments({ forceFail: false }));
  };

  const handleSimulateError = () => {
    dispatch(fetchAssignments({ forceFail: true }));
  };

  const handleResetData = () => {
    dispatch(resetDefaults());
    dispatch(fetchAssignments());
  };

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="container header-container">
          <div className="logo-group">
            <div className="logo-icon-wrapper">
              <GraduationCap className="logo-icon" size={26} />
            </div>
            <div>
              <h1 className="app-title">Student Deadline Tracker</h1>
              <p className="app-subtitle">Quản lý và theo dõi tiến độ bài tập cá nhân</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-primary add-assignment-btn"
              onClick={() => setIsAddModalOpen(true)}
              id="add-assignment-btn"
            >
              <Plus size={18} />
              <span>Thêm bài tập</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container main-content">
        {/* Quick Stats Overview */}
        <StatsOverview counts={counts} />

        {/* Filter and Search Bar */}
        <div className="control-bar-wrapper">
          <AssignmentFilter />

          {/* Quick simulation controls for testing features */}
          <div className="dev-test-bar">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={handleResetData}
              title="Đặt lại dữ liệu bài tập mẫu ban đầu"
            >
              <RotateCcw size={13} />
              <span>Dữ liệu mẫu ban đầu</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-muted"
              onClick={handleSimulateError}
              title="Kiểm tra giao diện trạng thái lỗi API và nút Thử lại"
            >
              <AlertTriangle size={13} />
              <span>Mô phỏng lỗi API</span>
            </button>
          </div>
        </div>

        {/* Assignment List rendered with withLoading HOC */}
        <AssignmentListWithLoading
          status={status}
          error={error}
          onRetry={handleRetry}
          assignments={filteredAssignments}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Modal for Adding New Assignment */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm bài tập mới"
        maxWidth="md"
      >
        <AssignmentForm
          onSuccess={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Modern Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>© 2026 Student Deadline Tracker • React 19 + TypeScript + Redux Toolkit</p>
          <p className="footer-badges">
            <span className="tech-tag">TypeScript Strict</span>
            <span className="tech-tag">Compound Components</span>
            <span className="tech-tag">withLoading HOC</span>
            <span className="tech-tag">createAsyncThunk</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
