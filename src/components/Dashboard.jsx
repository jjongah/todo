import { getDayOfWeek, formatDateKorean, isToday } from '../utils/dateUtils';
import './Dashboard.css';

const Dashboard = ({ todos, folders, getFolderById }) => {
  const today = new Date();
  const todayTodos = todos.filter(todo => isToday(todo.dueDate));
  const completedToday = todayTodos.filter(todo => todo.completed).length;
  const totalToday = todayTodos.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">오늘의 일정</h2>
        <div className="dashboard-date">
          <span className="date-text">{formatDateKorean(today)}</span>
          <span className="day-text">{getDayOfWeek(today)}</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">전체</span>
          <span className="stat-value">{totalToday}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">완료</span>
          <span className="stat-value completed">{completedToday}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">남은 할일</span>
          <span className="stat-value remaining">{totalToday - completedToday}</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>완료율</span>
          <span className="progress-percent">{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="today-todos">
        {todayTodos.length === 0 ? (
          <div className="no-todos">오늘 할 일이 없습니다 ✨</div>
        ) : (
          <div className="todo-items">
            {todayTodos.slice(0, 5).map(todo => {
              const folder = getFolderById(todo.folderId);
              return (
                <div 
                  key={todo.id} 
                  className={`dashboard-todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  <div className="todo-check">
                    {todo.completed ? '✓' : '○'}
                  </div>
                  <div className="todo-info">
                    <span className="todo-title">{todo.title}</span>
                    {todo.dueTime && (
                      <span className="todo-time">⏰ {todo.dueTime}</span>
                    )}
                  </div>
                  {folder && (
                    <span 
                      className="todo-badge" 
                      style={{ backgroundColor: folder.color }}
                    >
                      {folder.name}
                    </span>
                  )}
                </div>
              );
            })}
            {todayTodos.length > 5 && (
              <div className="more-todos">
                +{todayTodos.length - 5}개 더 있습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
