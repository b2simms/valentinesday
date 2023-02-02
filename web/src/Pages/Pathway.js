import './Pathway.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generatePathNodes, TOP_OFFSET, NODE_RADIUS } from './PathNodes';

function Pathway() {

  const [completedCount, setCompletedCount] = useState(0);
  const [pathNodes, setPathNodes] = useState([]);
  const [pathEdges, setPathEdges] = useState([]);

  const onBoxClick = () => {
    console.log(`onBoxClick`);
    if (completedCount < pathNodes.length - 1) {
      setCompletedCount(completedCount + 1);
      console.log(`completedCount ${completedCount}`);
    } else {
      console.log('All done.')
      console.log(`completedCount ${completedCount}`);
      console.log(pathNodes);
    }
  };

  const updateFavicon = (url) => {
    if (!url) {
      return;
    }
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = url;
  };

  useEffect(() => {
    console.log('run ONCE.');
    axios.get('test1_chess.json')
      .then(result => {
        console.log('API data:');
        console.log(result.data);
        const { nodes, edges } = generatePathNodes(result.data.puzzles);
        updateFavicon(result.data && result.data.faviconUrl);
        setPathNodes(nodes);
        setPathEdges(edges);
      })
  }, []);

  const renderEdges = pEdges => {
    let htmlEdges = [];
    // add edges up to before the current count
    for (let i = 0; i < completedCount - 1; i++) {
      let dashedLine = '';
      // set last node as active
      if (i === completedCount - 1) {
        dashedLine = '10'
      }
      const item = pEdges[i];
      htmlEdges.push(
        <svg
          key={Math.random()}
          width="100%"
          height={(completedCount * TOP_OFFSET) + NODE_RADIUS}
          className="Lines-area">
          <line strokeWidth="5"
            strokeDasharray={dashedLine}
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            stroke="#0009" />
        </svg>)
    }
    return htmlEdges;
  }

  const renderNodes = pNodes => {
    let htmlNodes = [];
    // add edges up to and equalling the current count
    for (let i = 0; i <= completedCount; i++) {
      const item = pNodes[i];
      // set last node as active
      if (i === completedCount) {
        htmlNodes.push(<div key={Math.random()}>
          <div
            className="Neon-box"
            style={{ top: item.top, left: item.left }}
            onClick={() => onBoxClick()}>
            <div className="Neon-bottom blink" style={{ width: "40px", height: "40px", margin: "10px" }}></div>
            <div className="Neon-top"></div>
          </div>
        </div>)
      } else {
        htmlNodes.push(<div key={Math.random()}>
          <div className="Neon-box" style={{ top: item.top, left: item.left }}>
            <div className="Neon-bottom"></div>
          </div>
        </div>)
      }
    }
    return htmlNodes;
  }

  return (
    <div className="App" style={{ marginTop: '120px', height: (completedCount * TOP_OFFSET) + 150 + "px" }}>
      {pathEdges && pathEdges.length > 0 && renderEdges(pathEdges)}
      {pathNodes && pathNodes.length > 0 && renderNodes(pathNodes)}
    </div >
  );
}

export default Pathway;
