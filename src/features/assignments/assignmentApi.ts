/**
 * Simulated Mock API Service
 * Emulates backend network delays, status codes, and ApiResponse<Assignment[]> generic response envelope
 */

import type { ApiResponse } from '../../types/api';
import type { Assignment } from './assignmentTypes';

const INITIAL_MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    subject: 'Lập trình Web',
    title: 'Xây dựng ứng dụng React',
    deadline: '2026-10-10',
    priority: 'HIGH',
    completed: false,
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: '2',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế Database',
    deadline: '2026-10-05',
    priority: 'MEDIUM',
    completed: false,
    createdAt: '2026-09-28T10:30:00Z',
  },
  {
    id: '3',
    subject: 'Cấu trúc dữ liệu',
    title: 'Bài tập Stack và Queue',
    deadline: '2026-10-15',
    priority: 'LOW',
    completed: true,
    createdAt: '2026-10-02T14:00:00Z',
  },
  {
    id: '4',
    subject: 'Mạng máy tính',
    title: 'Cấu hình VLAN & Định tuyến OSPF',
    deadline: '2026-10-06',
    priority: 'HIGH',
    completed: false,
    createdAt: '2026-10-03T09:15:00Z',
  },
  {
    id: '5',
    subject: 'Trí tuệ nhân tạo',
    title: 'Cài đặt giải thuật A* tìm đường đi ngắn nhất',
    deadline: '2026-10-03',
    priority: 'MEDIUM',
    completed: false,
    createdAt: '2026-09-25T11:00:00Z',
  },
];

const STORAGE_KEY = 'student_deadline_tracker_assignments_v1';

/**
 * Reads assignments from local persistence or initial defaults
 */
function getStoredAssignments(): Assignment[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Assignment[];
        }
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using fallback mock data', err);
  }
  return INITIAL_MOCK_ASSIGNMENTS;
}

/**
 * Saves assignments to local persistence
 */
export function persistAssignments(assignments: Assignment[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  } catch (err) {
    console.warn('Could not write to localStorage', err);
  }
}

/**
 * Resets local persistence back to initial mock seed
 */
export function resetMockStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not clear storage', err);
  }
}

/**
 * Simulated API Client using Generic ApiResponse<T>
 */
export const assignmentApi = {
  /**
   * Fetches assignments with simulated network latency
   * @param forceFail Optional boolean flag to simulate network error for testing error UI
   */
  async fetchAssignments(forceFail = false): Promise<ApiResponse<Assignment[]>> {
    // Simulate network delay between 400ms and 700ms
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (forceFail) {
      throw new Error('Lỗi kết nối máy chủ! Không thể tải danh sách bài tập (HTTP 500)');
    }

    const data = getStoredAssignments();

    return {
      success: true,
      status: 200,
      message: 'Lấy danh sách bài tập thành công',
      data,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Simulated API call to sync/save assignments
   */
  async syncAssignments(assignments: Assignment[]): Promise<ApiResponse<Assignment[]>> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    persistAssignments(assignments);
    return {
      success: true,
      status: 200,
      message: 'Đồng bộ dữ liệu thành công',
      data: assignments,
      timestamp: new Date().toISOString(),
    };
  },
};
