
// global vars
export const TOP_OFFSET = 150;
export const NODE_RADIUS = 30;
export const LEFT_PADDING = 15;

export const generatePathNodes = (data) => {

  // quick check
  if (!data || data.length === 0) {
    return [];
  }

  // determine offset
  const hash = (index) => {
    return (127 * index) % 90;
  }

  let nodesArr = [];
  for (let i = 0; i < data.length; i++) {
    // add left position
    const getLeftPos = (index) => {
      let x = hash(index + 1);
      if (x < LEFT_PADDING) {
        x = LEFT_PADDING;
      }
      return `calc(${x}% - 30px)`;
    }

    // add top position
    const getTopPos = (index) => {
      return index * TOP_OFFSET + "px";
    }

    nodesArr.push({
      left: getLeftPos(i),
      top: getTopPos(i),
    });
  }

  // after we have the node positions, add the edges
  const pathEdges = [];
  for (let i = 1; i <= nodesArr.length - 1; i++) {
    const obj = {
      x1: `calc(${nodesArr[i - 1].left} + ${NODE_RADIUS}px)`,
      y1: `calc(${nodesArr[i - 1].top} + ${NODE_RADIUS}px)`,
      x2: `calc(${nodesArr[i].left} + ${NODE_RADIUS}px)`,
      y2: `calc(${nodesArr[i].top} + ${NODE_RADIUS}px)`,
    }
    pathEdges.push(obj);
  }

  return {
    nodes: nodesArr,
    edges: pathEdges,
  };
}