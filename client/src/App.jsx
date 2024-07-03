import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  // Initialize state to store nodes

  const [nodes, setNodes] = useState([]);
  const [newFactoryName, setNewFactoryName] = useState('');
  


  // Fetch nodes from the backend when the component mounts

  useEffect(() => {
    fetch('http://localhost:3001/api/nodes/') // Adjust the URL as necessary
      .then(response => response.json())
      .then(data => setNodes(data))
      .catch(error => console.error('Error fetching nodes:', error));
  }, []); 


  // Add new factory nodes

  const addFactoryNode = () => {
    const newFactory = {
      name: newFactoryName,
      node_type: 'factory',
      parent_id: 1,
      number: 1,
    };

    fetch('http://localhost:3001/api/nodes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFactory),
    })
    .then(response => response.json())
    .then(data => {
      setNodes([...nodes, data]); // Assuming the backend returns the newly created node
      setNewFactoryName(''); // Reset input field after successful creation
    })
    .catch(error => console.error('Error adding new factory node:', error));
  };

// Delete nodes

  const deleteNode = async (nodeId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/nodes/${nodeId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the node');
      }
  
      console.log('Node deleted successfully');
      setNodes(nodes.filter(node => node.id !== nodeId));
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  // Organize nodes by parent_id

  const nodesByParentId = nodes.reduce((acc, node) => {
    const parentId = node.parent_id || 'root'; // Treat nodes without a parent_id as root nodes
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(node);
    return acc;
  }, {});

  // Recursive function to render nodes

  const renderNode = (node) => {
    return (
      <div key={node.id}>
        <div className={`node ${node.node_type}`}>
          {node.name}
          {/* Add a delete button for each node */}
          <button className="delete-node-btn" onClick={() => deleteNode(node.id)}>Delete</button>
          {/* Conditionally render input and button for 'root' nodes */}
          {node.node_type === 'root' && (
            <>
              <input
                type="text"
                className="factory-input"
                value={newFactoryName}
                onChange={(e) => setNewFactoryName(e.target.value)}
                placeholder="Enter factory name"
              />
              <button className="add-factory-btn" onClick={addFactoryNode}>Add Factory</button>
            </>
          )}
        </div>
        {/* Check if the node has children and render them */}
        {nodesByParentId[node.id] && (
          <div className="children-container">
            {nodesByParentId[node.id]
              .filter(child => child.node_type === 'factory') 
              .map(child => (
                <div key={child.id} className={`node ${child.node_type}`}>
                  {child.name}
                  {/* Add a delete button for each child node */}
                  <button className="delete-node-btn" onClick={() => deleteNode(child.id)}>Delete</button>
                </div>
              ))}
            {/* Additional check for 'number' nodes */}
            {nodesByParentId[node.id]
              .filter(child => child.node_type === 'number')
              .map(child => (
                <div key={child.id} className={`node ${child.node_type}`}>
                  {child.name}
                  {/* Add a delete button for 'number' nodes */}
                  <button className="delete-node-btn" onClick={() => deleteNode(child.id)}>Delete</button>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Render nodes using the Node component
  return (
    <div className="app">
      {nodesByParentId['root'] && nodesByParentId['root'].map(node => renderNode(node))}
    </div>
  );
}

export default App;