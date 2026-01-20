import { useState } from 'react';
import './FolderSidebar.css';

const FolderSidebar = ({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  getTodoCountByFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  isOpen,
  onToggle
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  const pastelColors = [
    '#FFE5E5', '#E5F3FF', '#FFF5E5', '#E5FFE5', 
    '#F5E5FF', '#FFE5F5', '#E5FFFF', '#FFFDE5'
  ];

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      onAddFolder({ name: newFolderName.trim(), color: randomColor });
      setNewFolderName('');
      setShowAddForm(false);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setShowAddForm(true);
  };

  const handleSaveEdit = () => {
    if (editingFolder && newFolderName.trim()) {
      onEditFolder(editingFolder.id, { name: newFolderName.trim() });
      setEditingFolder(null);
      setNewFolderName('');
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingFolder(null);
    setNewFolderName('');
  };

  return (
    <>
      <div className={`folder-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>폴더</h2>
          <button className="btn-close-sidebar" onClick={onToggle}>✕</button>
        </div>

        <div className="folder-list">
          <button
            className={`folder-item ${selectedFolder === 'all' ? 'active' : ''}`}
            onClick={() => onSelectFolder('all')}
          >
            <span className="folder-icon">📋</span>
            <span className="folder-name">전체 할일</span>
            <span className="folder-count">
              {folders.reduce((sum, f) => sum + getTodoCountByFolder(f.id), 0)}
            </span>
          </button>

          {folders.map(folder => (
            <div key={folder.id} className="folder-item-wrapper">
              <button
                className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                onClick={() => onSelectFolder(folder.id)}
              >
                <span 
                  className="folder-color" 
                  style={{ backgroundColor: folder.color }}
                ></span>
                <span className="folder-name">{folder.name}</span>
                <span className="folder-count">{getTodoCountByFolder(folder.id)}</span>
              </button>
              <div className="folder-actions">
                <button 
                  className="btn-folder-edit"
                  onClick={() => handleEditFolder(folder)}
                  title="수정"
                >
                  ✏️
                </button>
                <button 
                  className="btn-folder-delete"
                  onClick={() => {
                    if (window.confirm(`"${folder.name}" 폴더를 삭제하시겠습니까? 할일은 개인 폴더로 이동됩니다`)) {
                      onDeleteFolder(folder.id);
                    }
                  }}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="folder-form">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더 이름"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  editingFolder ? handleSaveEdit() : handleAddFolder();
                }
              }}
            />
            <div className="folder-form-actions">
              <button onClick={handleCancel} className="btn-cancel">취소</button>
              <button 
                onClick={editingFolder ? handleSaveEdit : handleAddFolder}
                className="btn-save"
              >
                {editingFolder ? '수정' : '추가'}
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="btn-add-folder" 
            onClick={() => setShowAddForm(true)}
          >
            <span>+</span> 새 폴더
          </button>
        )}
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default FolderSidebar;
