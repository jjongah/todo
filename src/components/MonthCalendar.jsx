import { useState } from 'react';
import './MonthCalendar.css';

const MonthCalendar = ({ todos, folders, getFolderById, onToggle, onEdit, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const getTodosForDay = (year, month, day) => {
    const targetDate = new Date(year, month, day);
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return isSameDay(todo.dueDate, targetDate);
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 달력 그리드용 배열 생성
  const calendarDays = [];
  
  // 이전 달의 빈 칸
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="month-calendar">
      <div className="calendar-header">
        <button className="btn-nav" onClick={goToPreviousMonth}>◀</button>
        <div className="calendar-title">
          <span className="calendar-year-month">{year}년 {monthNames[month]}</span>
          <button className="btn-today" onClick={goToToday}>오늘</button>
        </div>
        <button className="btn-nav" onClick={goToNextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {/* 요일 헤더 */}
        {dayNames.map((day, index) => (
          <div 
            key={day} 
            className={`calendar-day-name ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀 */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          const dayTodos = getTodosForDay(year, month, day);
          const isCurrentDay = isToday(year, month, day);

          return (
            <div 
              key={`day-${day}`} 
              className={`calendar-day ${isCurrentDay ? 'today' : ''}`}
            >
              <div className="day-number">{day}</div>
              <div className="day-todo-list">
                {dayTodos.slice(0, 3).map(todo => {
                  const folder = getFolderById(todo.folderId);
                  return (
                    <div
                      key={todo.id}
                      className={`calendar-todo-item ${todo.completed ? 'completed' : ''}`}
                      style={{ backgroundColor: folder?.color || '#f0f0f0' }}
                      title={todo.title}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggle(todo.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="calendar-todo-checkbox"
                      />
                      <span 
                        className="calendar-todo-title"
                        onClick={() => onEdit(todo)}
                      >
                        {todo.title}
                      </span>
                      <button
                        className="calendar-todo-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('이 할일을 삭제하시겠습니까?')) {
                            onDelete(todo.id);
                          }
                        }}
                        title="삭제"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {dayTodos.length > 3 && (
                  <div className="more-todos">+{dayTodos.length - 3}개 더</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
