import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState([]);
  const [newFactoryName, setNewFactoryName] = useState("");
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editedNodeName, setEditedNodeName] = useState("");
  const [numberRanges, setNumberRanges] = useState({});
  const [rootId, setRootId] = useState(null); // State to store root node ID

  const apiUrl = import.meta.env.BASE_URL + "api/nodes";

  useEffect(() => {
    console.log("API URL:", apiUrl);
    fetch(`${apiUrl}`)
      .then((response) => response.json())
      .then((data) => {
        setNodes(data);
        const rootNode = data.find((node) => node.node_type === "root");
        if (rootNode) {
          setRootId(rootNode.id); // Set the root node ID
        }
      })
      .catch((error) => console.error("Error fetching nodes:", error));
  }, [apiUrl]);

  const addFactoryNode = () => {
    if (!rootId) {
      console.error("Root node ID not found");
      return;
    }

    const newFactory = {
      name: newFactoryName,
      node_type: "factory",
      parent_id: rootId, // Use root node ID as parent_id
      number: 1,
    };

    fetch(`${apiUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFactory),
    })
      .then((response) => response.json())
      .then((data) => {
        setNodes([...nodes, data]);
        setNewFactoryName("");
      })
      .catch((error) => console.error("Error adding new factory node:", error));
  };

  const deleteNode = async (nodeId) => {
    try {
      const response = await fetch(`${apiUrl}/${nodeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the node");
      }

      console.log("Node deleted successfully");
      setNodes(nodes.filter((node) => node.id !== nodeId));
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const updateNodeName = async (nodeId, updatedName) => {
    try {
      const response = await fetch(`${apiUrl}/${nodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the node name");
      }

      const updatedNode = await response.json();
      setNodes(nodes.map((node) => (node.id === nodeId ? updatedNode : node)));
      setEditingNodeId(null);
      setEditedNodeName("");
    } catch (error) {
      console.error("Error updating node name:", error);
    }
  };

  const generateRandomNumbers = async (nodeId) => {
    const { min, max, count } = numberRanges[nodeId];
    if (!min || !max || !count) return;

    const numbers = [];
    for (let i = 0; i < Math.min(count, 15); i++) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.push(randomNum);
    }

    try {
      // Delete existing number nodes with the specified parent ID
      await fetch(`${apiUrl}/deleteByParentId/${nodeId}`, {
        method: "DELETE",
      });

      // Create new number nodes
      const response = await fetch(`${apiUrl}/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parentId: nodeId, nodes: numbers }),
      });

      const newNodes = await response.json();
      setNodes((prevNodes) => [
        ...prevNodes.filter(
          (node) => node.parent_id !== nodeId || node.node_type !== "number"
        ),
        ...newNodes,
      ]);
    } catch (error) {
      console.error("Error generating random nodes:", error);
    }
  };

  const handleRangeChange = (nodeId, field, value) => {
    setNumberRanges({
      ...numberRanges,
      [nodeId]: {
        ...numberRanges[nodeId],
        [field]: Number(value),
      },
    });
  };

  const nodesByParentId = nodes.reduce((acc, node) => {
    const parentId = node.parent_id || "root";
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(node);
    return acc;
  }, {});

  const renderNode = (node) => {
    const isEditing = editingNodeId === node.id;
    return (
      <div key={node.id}>
        <div className={`node ${node.node_type}`}>
          {node.node_type === "root" && (
            <>
              <input
                type="text"
                className="factory-input"
                value={newFactoryName}
                onChange={(e) => setNewFactoryName(e.target.value)}
                placeholder="Enter factory name"
              />
              <button className="add-factory-btn" onClick={addFactoryNode}>
                Add Factory
              </button>
            </>
          )}
          {node.node_type === "factory" && (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedNodeName}
                    onChange={(e) => setEditedNodeName(e.target.value)}
                  />
                  <button
                    onClick={() => updateNodeName(node.id, editedNodeName)}
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingNodeId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {node.name}
                  <button
                    onClick={() => {
                      setEditingNodeId(node.id);
                      setEditedNodeName(node.name);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
              <button
                className="delete-node-btn"
                onClick={() => deleteNode(node.id)}
              >
                Delete
              </button>

              <input
                type="number"
                placeholder="Min"
                value={numberRanges[node.id]?.min || ""}
                onChange={(e) =>
                  handleRangeChange(node.id, "min", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Max"
                value={numberRanges[node.id]?.max || ""}
                onChange={(e) =>
                  handleRangeChange(node.id, "max", e.target.value)
                }
              />
              <select
                value={numberRanges[node.id]?.count || ""}
                onChange={(e) => handleRangeChange(node.id, "count", e.target.value)}
              >
                <option value="" hidden disabled selected>
                  Choose how many numbers
                </option>
                {[...Array(15).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <button onClick={() => generateRandomNumbers(node.id)}>
                Generate Numbers
              </button>
            </>
          )}
        </div>
        {nodesByParentId[node.id] && (
          <div className="children-container">
            {nodesByParentId[node.id]
              .filter((child) => child.node_type === "factory")
              .map(renderNode)}
            <div className="number-nodes-container">
              {nodesByParentId[node.id]
                .filter((child) => child.node_type === "number")
                .map((numberNode) => (
                  <div className="number-node" key={numberNode.id}>
                    {numberNode.number} {/* Display the node.number property */}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <h1>Node Tree</h1>
      <div className="app">
        {nodesByParentId["root"] && nodesByParentId["root"].map(renderNode)}
      </div>
    </>
  );
}

export default App;
