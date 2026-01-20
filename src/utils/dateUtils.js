// 날짜 필터링 유틸리티 함수들

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * 주의 시작일(월요일) 구하기
 */
export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 일요일이면 -6, 아니면 월요일로
  return new Date(d.setDate(diff));
};

/**
 * 주의 마지막일(일요일) 구하기
 */
export const getEndOfWeek = (date = new Date()) => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

/**
 * 날짜가 오늘인지 확인
 */
export const isToday = (date) => {
  if (!date) return false;
  return isSameDay(new Date(date), new Date());
};

/**
 * 날짜가 이번 주인지 확인
 */
export const isThisWeek = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const start = getStartOfWeek();
  const end = getEndOfWeek();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return d >= start && d <= end;
};

/**
 * 날짜가 나중에(이번 주 이후)인지 확인
 */
export const isLater = (date) => {
  if (!date) return true; // 날짜가 없으면 "나중에"로 분류
  const d = new Date(date);
  const end = getEndOfWeek();
  end.setHours(23, 59, 59, 999);
  return d > end;
};

/**
 * 날짜를 포맷팅 (YYYY-MM-DD)
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 한글로 포맷팅 (MM월 DD일)
 */
export const formatDateKorean = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}월 ${day}일`;
};

/**
 * 요일 가져오기
 */
export const getDayOfWeek = (date = new Date()) => {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[new Date(date).getDay()];
};

/**
 * 카테고리별로 할일 필터링
 */
export const filterTodosByCategory = (todos, category) => {
  switch (category) {
    case 'today':
      return todos.filter(todo => isToday(todo.dueDate));
    case 'week':
      return todos.filter(todo => isThisWeek(todo.dueDate));
    case 'later':
      return todos.filter(todo => isLater(todo.dueDate));
    default:
      return todos;
  }
};
