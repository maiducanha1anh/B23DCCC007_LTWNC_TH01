import assert from 'node:assert';
import { calculateDeadlineInfo } from '../src/utils/dateUtils.ts';
import {
  isPriority,
  isDeadlineFilter,
  isAssignment,
  type Assignment,
} from '../src/features/assignments/assignmentTypes.ts';
import { isAssignmentOverdue } from '../src/features/assignments/assignmentSelectors.ts';
import assignmentReducer, {
  addAssignment,
  toggleAssignment,
  deleteAssignment,
  setFilter,
  type AssignmentState,
} from '../src/features/assignments/assignmentSlice.ts';

console.log('====================================================');
console.log('🧪 RUNNING STUDENT DEADLINE TRACKER INTEGRATION TESTS');
console.log('====================================================');

// 1. DATE CALCULATION TESTS
const baseDate = new Date(2026, 9, 6); // 2026-10-06 (Today)

console.log('\n--- 1. Testing Deadline Calculations ---');
const case1 = calculateDeadlineInfo('2026-10-10', baseDate);
assert.strictEqual(case1.daysRemaining, 4);
assert.strictEqual(case1.isOverdue, false);
assert.strictEqual(case1.isToday, false);
assert.strictEqual(case1.label, 'Còn 4 ngày');
console.log('  ✔ Future deadline (2026-10-10): "Còn 4 ngày"');

const case2 = calculateDeadlineInfo('2026-10-05', baseDate);
assert.strictEqual(case2.daysRemaining, -1);
assert.strictEqual(case2.isOverdue, true);
assert.strictEqual(case2.isToday, false);
assert.strictEqual(case2.label, 'Quá hạn 1 ngày');
console.log('  ✔ Overdue deadline (2026-10-05): "Quá hạn 1 ngày"');

const case3 = calculateDeadlineInfo('2026-10-06', baseDate);
assert.strictEqual(case3.daysRemaining, 0);
assert.strictEqual(case3.isOverdue, false);
assert.strictEqual(case3.isToday, true);
assert.strictEqual(case3.label, 'Hạn hôm nay');
console.log('  ✔ Today deadline (2026-10-06): "Hạn hôm nay"');

const case4 = calculateDeadlineInfo('2026-10-03', baseDate);
assert.strictEqual(case4.daysRemaining, -3);
assert.strictEqual(case4.isOverdue, true);
assert.strictEqual(case4.label, 'Quá hạn 3 ngày');
console.log('  ✔ Overdue 3 days (2026-10-03): "Quá hạn 3 ngày"');

const case5 = calculateDeadlineInfo('2026-10-07', baseDate);
assert.strictEqual(case5.daysRemaining, 1);
assert.strictEqual(case5.isOverdue, false);
assert.strictEqual(case5.label, 'Còn 1 ngày');
console.log('  ✔ 1 day remaining (2026-10-07): "Còn 1 ngày"');

// 2. TYPE GUARD TESTS
console.log('\n--- 2. Testing Type Guards ---');
assert.strictEqual(isPriority('HIGH'), true);
assert.strictEqual(isPriority('MEDIUM'), true);
assert.strictEqual(isPriority('LOW'), true);
assert.strictEqual(isPriority('CRITICAL'), false);
assert.strictEqual(isPriority(123), false);
assert.strictEqual(isPriority(null), false);
console.log('  ✔ isPriority type guard correctly validates LOW | MEDIUM | HIGH');

assert.strictEqual(isDeadlineFilter('ALL'), true);
assert.strictEqual(isDeadlineFilter('PENDING'), true);
assert.strictEqual(isDeadlineFilter('OVERDUE'), true);
assert.strictEqual(isDeadlineFilter('COMPLETED'), true);
assert.strictEqual(isDeadlineFilter('INVALID'), false);
console.log('  ✔ isDeadlineFilter type guard correctly validates filter tabs');

const sampleValidAssignment: Assignment = {
  id: 'test-1',
  subject: 'Toán cao cấp',
  title: 'Giải tích 1',
  deadline: '2026-10-20',
  priority: 'HIGH',
  completed: false,
};
assert.strictEqual(isAssignment(sampleValidAssignment), true);
assert.strictEqual(isAssignment({ id: 'bad' }), false);
console.log('  ✔ isAssignment type guard correctly validates shape and nested types');

// 3. OVERDUE RULE TESTS
console.log('\n--- 3. Testing Overdue Business Rules ---');
// Rule: deadline < today AND completed === false
const overdueAssignment: Assignment = {
  id: 'od-1',
  subject: 'Cơ sở dữ liệu',
  title: 'Thiết kế Database',
  deadline: '2026-10-05',
  priority: 'MEDIUM',
  completed: false,
};
assert.strictEqual(isAssignmentOverdue(overdueAssignment, baseDate), true);

// If completed is true, it should NOT be considered overdue
const completedPastAssignment: Assignment = {
  id: 'od-2',
  subject: 'Cơ sở dữ liệu',
  title: 'Thiết kế Database',
  deadline: '2026-10-05',
  priority: 'MEDIUM',
  completed: true,
};
assert.strictEqual(isAssignmentOverdue(completedPastAssignment, baseDate), false);
console.log('  ✔ Overdue correctly applies: deadline < today AND completed === false');

// 4. REDUX REDUCER TESTS
console.log('\n--- 4. Testing Redux Reducers ---');
let state: AssignmentState = {
  items: [sampleValidAssignment],
  status: 'succeeded',
  error: null,
  filter: 'ALL',
  searchQuery: '',
};

// Add
const newAssignment: Assignment = {
  id: 'test-2',
  subject: 'Vật lý đại cương',
  title: 'Bài tập Cơ học',
  deadline: '2026-10-25',
  priority: 'LOW',
  completed: false,
};
state = assignmentReducer(state, addAssignment(newAssignment));
assert.strictEqual(state.items.length, 2);
assert.strictEqual(state.items[0].id, 'test-2');
console.log('  ✔ Redux addAssignment prepends new assignment to items');

// Toggle
state = assignmentReducer(state, toggleAssignment('test-2'));
assert.strictEqual(state.items[0].completed, true);
console.log('  ✔ Redux toggleAssignment: false -> true');

state = assignmentReducer(state, toggleAssignment('test-2'));
assert.strictEqual(state.items[0].completed, false);
console.log('  ✔ Redux toggleAssignment: true -> false');

// Delete
state = assignmentReducer(state, deleteAssignment('test-2'));
assert.strictEqual(state.items.length, 1);
assert.strictEqual(state.items[0].id, 'test-1');
console.log('  ✔ Redux deleteAssignment: correctly removes item');

// Filter
state = assignmentReducer(state, setFilter('OVERDUE'));
assert.strictEqual(state.filter, 'OVERDUE');
console.log('  ✔ Redux setFilter: updates active filter tab');

console.log('\n====================================================');
console.log('🎉 ALL INTEGRATION AND UNIT TESTS PASSED (100%)!');
console.log('====================================================\n');
