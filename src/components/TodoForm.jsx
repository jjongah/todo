import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import './TodoForm.css';

const TodoForm = ({ todo, folders, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    memo: '',
    dueDate: '',
    dueTime: '',
    folderId: 'personal'
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        memo: todo.memo || '',
        dueDate: todo.dueDate ? formatDate(todo.dueDate) : '',
        dueTime: todo.dueTime || '',
        folderId: todo.folderId || 'personal'
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }
    if (!formData.dueDate) {
      alert('날짜를 선택해주세요!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{todo ? '할일 수정' : '새 할일 추가'}</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label>제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="할 일을 입력하세요"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>메모</label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="메모를 입력하세요"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>날짜 *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>시간</label>
              <input
                type="time"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>폴더</label>
            <select
              name="folderId"
              value={formData.folderId}
              onChange={handleChange}
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              취소
            </button>
            <button type="submit" className="btn-save">
              {todo ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
