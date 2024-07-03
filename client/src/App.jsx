import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Initialize state to store nodes
  const [nodes, setNodes] = useState([]);
  const [newFactoryName, setNewFactoryName] = useState('');
  const [editingNodeId, setEditingNodeId] = useState(null); // Track which node is being edited
  const [editedNodeName, setEditedNodeName] = useState(''); // Track the edited node name

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

  // Update node name
  const updateNodeName = async (nodeId, updatedName) => {
    try {
      const response = await fetch(`http://localhost:3001/api/nodes/${nodeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updatedName }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to update the node name');
        
      }

      const updatedNode = await response.json();
      setNodes(nodes.map(node => (node.id === nodeId ? updatedNode : node)));
      setEditingNodeId(null);
      setEditedNodeName('');
    } catch (error) {
      console.error('Error updating node name:', error);
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
    const isEditing = editingNodeId === node.id;
    return (
      <div key={node.id}>
        <div className={`node ${node.node_type}`}>
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
          {node.node_type === 'factory' && (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedNodeName}
                    onChange={(e) => setEditedNodeName(e.target.value)}
                  />
                  <button onClick={() => updateNodeName(node.id, editedNodeName)}>Save</button>
                  <button onClick={() => setEditingNodeId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {node.name}
                  <button onClick={() => { setEditingNodeId(node.id); setEditedNodeName(node.name); }}>Edit</button>
                </>
              )}
              <button className="delete-node-btn" onClick={() => deleteNode(node.id)}>Delete</button>
            </>
          )}
        </div>
        {nodesByParentId[node.id] && (
          <div className="children-container">
            {nodesByParentId[node.id]
              .filter(child => child.node_type === 'factory')
              .map(renderNode)}
              <div>
                {nodesByParentId[node.id]
              .filter(child => child.node_type === 'number')
              .map(renderNode)}
              </div>
            
          </div>
        )}
      </div>
    );
  };

  // Render nodes using the Node component
  return (
    <>
      <h1>Node Tree</h1>
      <div className="app">
        {nodesByParentId['root'] && nodesByParentId['root'].map(renderNode)}
      </div>
    </>
  );
}

export default App;
