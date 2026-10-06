import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Calendar, BookOpen, FileText } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { addAssignment } from '../assignmentSlice';
import {
  isPriority,
  type Assignment,
  type AssignmentFormData,
  type AssignmentFormErrors,
} from '../assignmentTypes';
import { getTodayISOString, parseISODate } from '../../../utils/dateUtils';

export interface AssignmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();

  // Form State using Omit<Assignment, 'id' | 'completed'>
  const [formData, setFormData] = useState<AssignmentFormData>({
    subject: '',
    title: '',
    deadline: getTodayISOString(),
    priority: 'MEDIUM',
  });

  // Validation errors using Partial<Record<keyof AssignmentFormData, string>>
  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for edited field
    if (errors[name as keyof AssignmentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Validation logic leveraging Type Guard and Utility Types
   */
  const validateForm = (): boolean => {
    const newErrors: AssignmentFormErrors = {};

    // 1. Validate subject (Môn học không được rỗng)
    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tên môn học';
    } else if (formData.subject.trim().length < 2) {
      newErrors.subject = 'Tên môn học phải có ít nhất 2 ký tự';
    }

    // 2. Validate title (Tên bài tập không được rỗng)
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên bài tập';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Tên bài tập phải có ít nhất 3 ký tự';
    }

    // 3. Validate deadline (Deadline không được rỗng và phải hợp lệ)
    if (!formData.deadline) {
      newErrors.deadline = 'Vui lòng chọn ngày hết hạn nộp';
    } else {
      const parsed = parseISODate(formData.deadline);
      if (isNaN(parsed.getTime())) {
        newErrors.deadline = 'Định dạng ngày deadline không hợp lệ';
      }
    }

    // 4. Validate Priority using Type Guard isPriority(value)
    if (!isPriority(formData.priority)) {
      newErrors.priority = 'Mức độ ưu tiên phải là LOW, MEDIUM hoặc HIGH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Type guard assertion check
    if (!isPriority(formData.priority)) {
      setErrors({ priority: 'Mức độ ưu tiên không hợp lệ' });
      setIsSubmitting(false);
      return;
    }

    const newAssignment: Assignment = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      subject: formData.subject.trim(),
      title: formData.title.trim(),
      deadline: formData.deadline,
      priority: formData.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Dispatch Redux action
    dispatch(addAssignment(newAssignment));

    // Reset Form
    setFormData({
      subject: '',
      title: '',
      deadline: getTodayISOString(),
      priority: 'MEDIUM',
    });
    setErrors({});
    setIsSubmitting(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit} noValidate>
      {/* Subject Field */}
      <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
        <label htmlFor="subject-input" className="form-label">
          <BookOpen size={16} className="label-icon" />
          <span>Môn học</span>
          <span className="required-star">*</span>
        </label>
        <input
          id="subject-input"
          type="text"
          name="subject"
          className="form-input"
          placeholder="Ví dụ: Lập trình Web, Cơ sở dữ liệu..."
          value={formData.subject}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {errors.subject && (
          <p className="error-hint" role="alert">
            <AlertCircle size={14} />
            <span>{errors.subject}</span>
          </p>
        )}
      </div>

      {/* Assignment Title Field */}
      <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
        <label htmlFor="title-input" className="form-label">
          <FileText size={16} className="label-icon" />
          <span>Tên bài tập</span>
          <span className="required-star">*</span>
        </label>
        <input
          id="title-input"
          type="text"
          name="title"
          className="form-input"
          placeholder="Ví dụ: Xây dựng ứng dụng React, Thiết kế ERD..."
          value={formData.title}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {errors.title && (
          <p className="error-hint" role="alert">
            <AlertCircle size={14} />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      <div className="form-row">
        {/* Deadline Field */}
        <div className={`form-group flex-1 ${errors.deadline ? 'has-error' : ''}`}>
          <label htmlFor="deadline-input" className="form-label">
            <Calendar size={16} className="label-icon" />
            <span>Hạn nộp</span>
            <span className="required-star">*</span>
          </label>
          <input
            id="deadline-input"
            type="date"
            name="deadline"
            className="form-input"
            value={formData.deadline}
            onChange={handleInputChange}
          />
          {errors.deadline && (
            <p className="error-hint" role="alert">
              <AlertCircle size={14} />
              <span>{errors.deadline}</span>
            </p>
          )}
        </div>

        {/* Priority Field */}
        <div className={`form-group flex-1 ${errors.priority ? 'has-error' : ''}`}>
          <label htmlFor="priority-input" className="form-label">
            <span>Mức độ ưu tiên</span>
            <span className="required-star">*</span>
          </label>
          <select
            id="priority-input"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="LOW">Low (Thấp)</option>
            <option value="MEDIUM">Medium (Trung bình)</option>
            <option value="HIGH">High (Cao)</option>
          </select>
          {errors.priority && (
            <p className="error-hint" role="alert">
              <AlertCircle size={14} />
              <span>{errors.priority}</span>
            </p>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Huỷ bỏ
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <PlusCircle size={18} />
          <span>Thêm bài tập</span>
        </button>
      </div>
    </form>
  );
};
