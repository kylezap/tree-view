import React from 'react';
import './App.css';
import Node from './Node';
import { useEffect, useState } from 'react';

function App() {
  // Initialize state to store nodes
  const [nodes, setNodes] = useState([]);

  // Fetch nodes from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:3001/api/nodes/') // Adjust the URL as necessary
      .then(response => response.json())
      .then(data => setNodes(data))
      .catch(error => console.error('Error fetching nodes:', error));
  }, []); // The empty array ensures this effect runs only once after the initial render

  // Render nodes using the Node component
  return (
    <div className="app">
      {nodes.map(node => (
        <Node key={node.id} id={node.id} name={node.name} parent_id={node.parent_id}  />
      ))}
    </div>
  );
}

export default App;

// // Mock data for the tree structure
// const treeData = {
//   id: 'root',
//   name: 'Root Node',
//   children: [
//     { id: '1', name: 'Child 1', children: [{ id: '3', name: 'Grandchild 1' }] },
//     { id: '2', name: 'Child 2', children: [{ id: '3', name: 'Grandchild 1' }, { id: '3', name: 'Grandchild 1' }] },
//   ],
// };

// // Recursive function to render nodes
// function renderNode(node) {
//   return (
//     <div key={node.id}>
//       <div className="node">{node.name}</div>
//       {node.children && (
//         <div className="children-container">
//           {node.children.map(child => renderNode(child))}
//         </div>
//       )}
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="app">
//       {/* Render the root node separately */}
//       <div className="node">{treeData.name}</div>

//       {/* Container for children */}
//       <div className="children-container">
//         {treeData.children.map(child => renderNode(child))}
//       </div>
//     </div>
//   );
// }

// export default App;