import { useState, useEffect } from 'react';
import { loadTodos, saveTodos, loadFolders, saveFolders } from '../utils/storage';

/**
 * 할일 및 폴더 관리를 위한 커스텀 훅
 */
export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadedTodos = loadTodos();
    const loadedFolders = loadFolders();
    setTodos(loadedTodos);
    setFolders(loadedFolders);
    setIsLoaded(true);
  }, []);

  // 할일 변경 시 localStorage에 저장 (초기 로드 후에만)
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos);
    }
  }, [todos, isLoaded]);

  // 폴더 변경 시 localStorage에 저장 (초기 로드 후에만)
  useEffect(() => {
    if (isLoaded && folders.length > 0) {
      saveFolders(folders);
    }
  }, [folders, isLoaded]);

  // === 할일 관련 함수 ===

  /**
   * 할일 추가
   */
  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      title: todoData.title,
      memo: todoData.memo || '',
      dueDate: todoData.dueDate || null,
      dueTime: todoData.dueTime || '',
      folderId: todoData.folderId || 'personal',
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  /**
   * 할일 수정
   */
  const updateTodo = (id, updatedData) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updatedData } : todo
      )
    );
  };

  /**
   * 할일 삭제
   */
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  /**
   * 할일 완료/미완료 토글
   */
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * 특정 폴더의 할일 개수 가져오기
   */
  const getTodoCountByFolder = (folderId) => {
    return todos.filter(todo => todo.folderId === folderId && !todo.completed).length;
  };

  // === 폴더 관련 함수 ===

  /**
   * 폴더 추가
   */
  const addFolder = (folderData) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: folderData.name,
      color: folderData.color
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  /**
   * 폴더 수정
   */
  const updateFolder = (id, updatedData) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id ? { ...folder, ...updatedData } : folder
      )
    );
  };

  /**
   * 폴더 삭제
   */
  const deleteFolder = (id) => {
    // 해당 폴더의 할일들을 '개인' 폴더로 이동
    setTodos(prev =>
      prev.map(todo =>
        todo.folderId === id ? { ...todo, folderId: 'personal' } : todo
      )
    );
    setFolders(prev => prev.filter(folder => folder.id !== id));
    if (selectedFolder === id) {
      setSelectedFolder('all');
    }
  };

  /**
   * 폴더 ID로 폴더 정보 가져오기
   */
  const getFolderById = (id) => {
    return folders.find(folder => folder.id === id);
  };

  return {
    // 상태
    todos,
    folders,
    selectedFolder,
    selectedCategory,
    
    // 할일 함수
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoCountByFolder,
    
    // 폴더 함수
    addFolder,
    updateFolder,
    deleteFolder,
    getFolderById,
    
    // 선택 상태 변경
    setSelectedFolder,
    setSelectedCategory
  };
};
