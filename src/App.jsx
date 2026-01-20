import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { filterTodosByCategory } from './utils/dateUtils';
import Dashboard from './components/Dashboard';
import CategoryTabs from './components/CategoryTabs';
import FolderSidebar from './components/FolderSidebar';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import WeekView from './components/WeekView';
import MonthCalendar from './components/MonthCalendar';
import './App.css';

function App() {
  const {
    todos,
    folders,
    selectedFolder,
    selectedCategory,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoCountByFolder,
    addFolder,
    updateFolder,
    deleteFolder,
    getFolderById,
    setSelectedFolder,
    setSelectedCategory
  } = useTodos();

  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 필터링된 할일 목록
  const getFilteredTodos = () => {
    let filtered = todos;

    // 폴더별 필터링
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(todo => todo.folderId === selectedFolder);
    }

    // 카테고리별 필터링 (나중에 탭의 경우 달력에서 모든 날짜를 보여주므로 필터링 안함)
    if (selectedCategory !== 'later') {
      filtered = filterTodosByCategory(filtered, selectedCategory);
    }

    // 완료되지 않은 것을 먼저, 날짜순 정렬
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return b.createdAt - a.createdAt;
    });
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowTodoForm(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleSaveTodo = (todoData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
    } else {
      addTodo(todoData);
    }
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  const handleCancelForm = () => {
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="app">
      <header className="app-header">
        <button 
          className="btn-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1 className="app-title">할일 관리</h1>
        <button className="btn-add-todo" onClick={handleAddTodo}>
          + 할일 추가
        </button>
      </header>

      <div className="app-container">
        <FolderSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          getTodoCountByFolder={getTodoCountByFolder}
          onAddFolder={addFolder}
          onEditFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="app-main">
          <Dashboard
            todos={todos}
            folders={folders}
            getFolderById={getFolderById}
          />

          <div className="todos-section">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {selectedCategory === 'today' && (
              <>
                <div className="todos-header">
                  <h2 className="todos-title">
                    {selectedFolder === 'all' 
                      ? '오늘 할일' 
                      : `${getFolderById(selectedFolder)?.name || '할일'} - 오늘`}
                  </h2>
                  <span className="todos-count">
                    {filteredTodos.length}개
                  </span>
                </div>

                <TodoList
                  todos={filteredTodos}
                  folders={folders}
                  getFolderById={getFolderById}
                  onToggle={toggleTodo}
                  onEdit={handleEditTodo}
                  onDelete={deleteTodo}
                />
              </>
            )}

            {selectedCategory === 'week' && (
              <WeekView
                todos={filteredTodos}
                folders={folders}
                getFolderById={getFolderById}
                onToggle={toggleTodo}
                onEdit={handleEditTodo}
                onDelete={deleteTodo}
              />
            )}

            {selectedCategory === 'later' && (
              <MonthCalendar
                todos={filteredTodos}
                folders={folders}
                getFolderById={getFolderById}
                onToggle={toggleTodo}
                onEdit={handleEditTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </main>
      </div>

      {showTodoForm && (
        <TodoForm
          todo={editingTodo}
          folders={folders}
          onSave={handleSaveTodo}
          onCancel={handleCancelForm}
        />
      )}

      <button 
        className="btn-floating-add" 
        onClick={handleAddTodo}
        title="할일 추가"
      >
        +
      </button>
    </div>
  );
}

export default App;
