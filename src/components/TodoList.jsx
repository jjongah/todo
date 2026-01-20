import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ todos, folders, getFolderById, onToggle, onEdit, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="empty-icon">📝</div>
        <p>할 일이 없습니다</p>
        <span>새로운 할 일을 추가해보세요!</span>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          folder={getFolderById(todo.folderId)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
