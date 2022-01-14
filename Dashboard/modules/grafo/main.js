// Controlador de la vista.

function obtenerColor(porcentaje) {
  let color = "";

  if (porcentaje <= 0) {
    color = color1;
  } else if (porcentaje < 30) {
    color = color2;
  } else if (porcentaje < 60) {
    color = color3;
  } else if (porcentaje < 90) {
    color = color4;
  } else if (porcentaje >= 90) {
    color = color5;
  }

  return color;
}

function readNodes(json) {
  let nodes = [];

  nodes.push({
    id: 0,
    level: 0,
    label: json.name1,
    hidden: true,
    name: 0,
  });

  for (const node of json.nodes) {
    let porcentaje = node.percentage.slice(0, -1) * 1;
    let color = obtenerColor(porcentaje);

    nodes.push({
      id: node.id,
      level: node.level,
      name: node.name,
      label: `${node.label}\n${node.percentage}`,
      hidden: node.level > 1 ? true : false,
      shape: forma1,
      fixed: true,
      color: { background: color },
    });
  }

  return nodes;
}

function readEdges(json) {
  let edges = [];

  for (const edge of json.edges) {
    edges.push({
      from: edge.from,
      to: edge.to,
      hidden: edge.from > 0 ? true : false,
      name: edge.name,
    });
  }

  return edges;
}

function InitMain() {
  var container = document.getElementById("mynetwork");

  var nodes = new vis.DataSet(readNodes(json_ejemplo));
  var edges = new vis.DataSet(readEdges(json_ejemplo));

  console.log("nodes: " + JSON.stringify(readNodes(json_ejemplo)));
  console.log("edges: " + JSON.stringify(readEdges(json_ejemplo)));

  var data = {
    nodes: nodes,
    edges: edges,
  };

  // https://visjs.github.io/vis-network/docs/network/
  var options = {
    width: "1450px", // Podrián llegar desde el archivo de configuración.
    height: "450px", // Podrián llegar desde el archivo de configuración.
    edges: {
      smooth: { type: "straightCross" },
    },
    nodes: {
      borderWidth: 2,
      fixed: { x: false, y: false },
    },
    interaction: {
      hover: true,
    },
    physics: {
      stabilization: true,
      wind: { x: 0, y: 0 },
    },
    layout: {
      improvedLayout: true,
      hierarchical: {
        direction: "DU",
        sortMethod: "hubsize",
        nodeSpacing: 200,
        treeSpacing: 200,
      },
    },
    physics: {
      barnesHut: {
        centralGravity: 0.2,
      },
      maxVelocity: 5,
      minVelocity: 0.47,
      solver: "hierarchicalRepulsion",
    },
    nodes: {
      physics: true,
    },
    interaction: {
      navigationButtons: true,
      keyboard: true,
    },
  };

  var network = new vis.Network(container, data, options);

  network.moveTo({
    position: { x: 0, y: 0 },
    offset: { x: -width / 2, y: -height / 2 },
    scale: 1,
  });

  network.on("stabilizationIterationsDone", function () {
    network.setOptions({ physics: false });
  });

  // Mostrar y/o ocultar nodos.
  InitManageViewOrHideNode(network,nodes,edges);
}
