import { formatDateKorean } from '../utils/dateUtils';
import './TodoItem.css';

const TodoItem = ({ todo, folder, onToggle, onEdit, onDelete }) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    if (window.confirm('이 할일을 삭제하시겠습니까?')) {
      onDelete(todo.id);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-main">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        
        <div className="todo-content">
          <div className="todo-title">{todo.title}</div>
          {todo.memo && <div className="todo-memo">{todo.memo}</div>}
          <div className="todo-meta">
            {todo.dueDate && (
              <span className="todo-date">
                📅 {formatDateKorean(todo.dueDate)}
                {todo.dueTime && ` ${todo.dueTime}`}
              </span>
            )}
            {folder && (
              <span 
                className="todo-folder" 
                style={{ backgroundColor: folder.color }}
              >
                {folder.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="todo-actions">
        <button className="btn-edit" onClick={handleEdit}>수정</button>
        <button className="btn-delete" onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
};

export default TodoItem;
