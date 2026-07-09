import React from 'react';

const StarRating = ({ rating = 0, onRating, isInteractive = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const starStyle = {
    cursor: isInteractive ? 'pointer' : 'default',
    color: '#ffc107', // Màu vàng của sao
    fontSize: '20px',
    marginRight: '2px',
  };

  const handleStarClick = (star) => {
    if (isInteractive && onRating) {
      onRating(star);
    }
  };

  return (
    <div>
      {stars.map((star) => (
        <span key={star} style={starStyle} onClick={() => handleStarClick(star)}>
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;