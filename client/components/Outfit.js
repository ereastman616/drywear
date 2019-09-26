import React from 'react';

const Outfit = ({ item, handleClick }) =>  {
  const { top, bottom, shoes } = item;
  return (
    <div className="outfit-block" onClick={() => handleClick(top.id, bottom.id, shoes.id)}>
      <img src={top.image} />
      <img src={bottom.image} className="bottom"/>
      <img src={shoes.image}/>
    </div>
  )
}

export default Outfit;
