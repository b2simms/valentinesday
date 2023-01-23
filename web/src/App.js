import './App.css';

function App() {

  const hash = (index) => {
    return (127 * index) % 90;
  }

  let pathNodes = [];
  for (let i = 0; i < 7; i++) {
    pathNodes.push({
      type: 'a'
    });
  }
  pathNodes = pathNodes.map((item, index) => {
    let x = hash(index + 1);
    if (x < 15) {
      x = 15;
    }
    item['left'] = `calc(${x}% - 30px)`;
    return item;
  });

  let currDist = 80;
  pathNodes = pathNodes.map((item, index) => {
    if (index === 0) {
      item['top'] = currDist + "px";
    } else {
      currDist += 150;
      item['top'] = currDist + "px";
    }
    return item;
  })
  currDist += 30;

  const pathEdges = [];
  for (let i = 1; i <= pathNodes.length - 1; i++) {
    const obj = {
      x1: `calc(${pathNodes[i - 1].left} + 30px)`,
      y1: `calc(${pathNodes[i - 1].top} + 30px)`,
      x2: `calc(${pathNodes[i].left} + 30px)`,
      y2: `calc(${pathNodes[i].top} + 30px)`,
    }
    pathEdges.push(obj);
  }

  return (
    <div className="App" style={{ height: (currDist + 120) + "px" }}>
      {pathEdges.map((item, index) => {
        let dashedLine = "";
        if (index === pathEdges.length - 1) {
          dashedLine = "10"
        }
        return <svg width="100%" height={currDist} className="Lines-area"><line strokeWidth="5" strokeDasharray={dashedLine} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} stroke="black" /></svg>
      })}
      {pathNodes.map((item, index) => {
        let shimmerClass = "Click-box";
        if (index === pathEdges.length) {
          shimmerClass += " shimmer"
        }
        return <div>
          <div className="Click-box" style={{ top: item.top, left: item.left, backgroundColor: "#7489ff" }}></div>
          <div className={shimmerClass} style={{ top: item.top, left: item.left }}></div>
        </div>
      })}
    </div >
  );
}

export default App;
