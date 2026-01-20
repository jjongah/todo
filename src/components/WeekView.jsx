import { useState } from 'react';
import './WeekView.css';
import { formatDateKorean } from '../utils/dateUtils';

const WeekView = ({ todos, folders, getFolderById, onToggle, onEdit, onDelete }) => {
  const getDayName = (dayIndex) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
  };

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 월요일 시작
    return new Date(now.setDate(diff));
  };

  const getWeekDays = () => {
    const start = getStartOfWeek();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
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

  const getTodosForDay = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return isSameDay(todo.dueDate, date);
    });
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const weekDays = getWeekDays();

  return (
    <div className="week-view">
      <div className="week-grid">
        {weekDays.map((date, index) => {
          const dayTodos = getTodosForDay(date);
          const isCurrentDay = isToday(date);

          return (
            <div 
              key={index} 
              className={`week-day-box ${isCurrentDay ? 'today' : ''}`}
            >
              <div className="day-header">
                <span className="day-name">{getDayName(date.getDay())}</span>
                <span className="day-date">{date.getDate()}</span>
              </div>
              
              <div className="day-todos">
                {dayTodos.length === 0 ? (
                  <div className="no-todos-day">할 일 없음</div>
                ) : (
                  dayTodos.map(todo => {
                    const folder = getFolderById(todo.folderId);
                    return (
                      <div 
                        key={todo.id} 
                        className={`day-todo-item ${todo.completed ? 'completed' : ''}`}
                        style={{ 
                          borderLeftColor: folder?.color || '#ddd',
                          borderLeftWidth: '4px',
                          borderLeftStyle: 'solid'
                        }}
                      >
                        <div className="todo-item-header">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggle(todo.id);
                            }}
                            className="day-todo-checkbox"
                          />
                          <span 
                            className="day-todo-title"
                            onClick={() => onEdit(todo)}
                          >
                            {todo.title}
                          </span>
                          <button
                            className="day-todo-delete"
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
                        {todo.dueTime && (
                          <span className="day-todo-time">⏰ {todo.dueTime}</span>
                        )}
                        {folder && (
                          <span 
                            className="day-todo-folder"
                            style={{ backgroundColor: folder.color }}
                          >
                            {folder.name}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
