// localStorage 관리 유틸리티 함수들

const TODOS_KEY = 'todos';
const FOLDERS_KEY = 'folders';

/**
 * localStorage에서 할일 목록 가져오기
 */
export const loadTodos = () => {
  try {
    const todosJson = localStorage.getItem(TODOS_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};

/**
 * localStorage에 할일 목록 저장하기
 */
export const saveTodos = (todos) => {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};

/**
 * localStorage에서 폴더 목록 가져오기
 */
export const loadFolders = () => {
  try {
    const foldersJson = localStorage.getItem(FOLDERS_KEY);
    if (foldersJson) {
      return JSON.parse(foldersJson);
    }
    // 기본 폴더 생성
    const defaultFolders = [
      { id: 'school', name: '학교', color: '#FFE5E5' },
      { id: 'personal', name: '개인', color: '#E5F3FF' },
      { id: 'work', name: '알바', color: '#FFF5E5' }
    ];
    saveFolders(defaultFolders);
    return defaultFolders;
  } catch (error) {
    console.error('Error loading folders:', error);
    return [];
  }
};

/**
 * localStorage에 폴더 목록 저장하기
 */
export const saveFolders = (folders) => {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error('Error saving folders:', error);
  }
};

/**
 * localStorage 초기화 (개발용)
 */
export const clearStorage = () => {
  localStorage.removeItem(TODOS_KEY);
  localStorage.removeItem(FOLDERS_KEY);
};
