import React, { useState, useEffect } from 'react';
import * as api from "../api";
import '../styles/Modal.scss'; 

const CommentsModal = ({ isOpen, onClose, children }) => {
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null); // Initialize user as null

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await api.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
  }, []);

  console.log("users-->", user)

  if (!isOpen) return null;

  const handleAddComment = () => {
    if (inputValue.trim() && user) { // Only add comment if it's not empty and user is available
      const commentText = `${user.first_name}: ${inputValue}`; // Format comment
      setComments(prevComments => [...prevComments, commentText]);
      setInputValue(''); // Clear input after adding
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className='top-container'>
            <h2>Comments</h2>
            <button onClick={onClose} className="modal-close-button">
                <span>x</span>
            </button>
        </div>
        <div className='content'>
          {children}
          {comments.map((comment, index) => (
            <p key={index}>
              <strong>{comment.split(":")[0]}</strong>: {comment.split(":")[1].trim()}
            </p>
          ))}
        </div>
        <div className='input-box'>
          <input 
            type='text' 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAddComment}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
