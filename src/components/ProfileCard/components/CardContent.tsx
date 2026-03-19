import React from 'react';
interface CardContentProps {
  name: string;
  title: string;
}
const CardContent: React.FC<CardContentProps> = ({ name, title }) => {
  return (
    <div className="pc-content">
      <div className="pc-details">
        <h3>{name}</h3>
        <p>{title}</p>
      </div>
    </div>);

};
export default CardContent;