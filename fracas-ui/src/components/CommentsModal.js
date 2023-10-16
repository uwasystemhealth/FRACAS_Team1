import React, { useState, useEffect } from 'react';
import * as api from "../api";
import '../styles/Modal.scss'; 

const CommentsModal = ({ isOpen, onClose, record_id }) => {
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null); // Initialize user as null
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchComments = async () => {
        try {
            const response = await api.getComments(token, record_id);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching subsystems:", error);
        }
    };
    fetchComments();
  }, [token, record_id]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await api.getCurrentUser(token);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
  }, [token]);

  if (!isOpen) return null;

  const handleAddComment = async () => {
    if (inputValue.trim() && user) {
        const commentText = `${user.first_name}: ${inputValue}`;
        const payload = {
            "commenter": user.user_id,  // Assuming the user object contains the ID of the user
            "comment_text": commentText,
            "record_id": record_id,
            "parent_comment_id": null
        };
        
        try {
            const response = await api.addComment(token, payload);
            if (response.status === 201) {  // If the comment was successfully added
              setComments(prevComments => [...prevComments, response.data]);
              setInputValue('');  // Clear input after adding
          } else {
                console.error("Error adding comment:", response.data);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
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
        {comments.map((comment, index) => {
          const [commenterName, commentContent] = comment.comment_text?.split(':');
          return (
            <p key={comment.comment_id}>
              <strong>{commenterName.trim()}</strong>: {commentContent.trim()}
            </p>
          );
        })}
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
