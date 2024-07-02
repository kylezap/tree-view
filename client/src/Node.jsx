import React from 'react';

function Node({ id, name, parent_id, node_type, number}) {
    return (
      <div className='node'>
        <div className='node-name'>{name}</div>
        <div>{node_type}</div>
        <div ><p>{number}</p></div>
      </div>
    );
  }

export default Node;
