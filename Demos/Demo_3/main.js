function readNodes(json) {
    let nodes = [];

    nodes.push({
        id: 0,
        level: 0,
        label: json.name,
        hidden: true
    });

    for (const node of json.nodes) {
        let color = "";
        let porcentaje = node.percentage.slice(0, -1) * 1;

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

        nodes.push({
            id: node.id,
            level: node.level,
            label: `${node.label}\n${node.percentage}`,
            hidden: (node.level > 1) ? true : false,
            shape: forma1,
            fixed: true,
            color: { background: color }
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
            hidden: (edge.from > 0) ? true : false,
        });
    }

    return edges;
}

var container = document.getElementById('mynetwork');

var nodes = new vis.DataSet(readNodes(json_ejemplo));
var edges = new vis.DataSet(readEdges(json_ejemplo));

var data = {
    nodes: nodes,
    edges: edges
};

var options = {
    width: width + 'px',
    height: height + 'px',
    edges: {
        smooth: { type: "straightCross" },
    },
    nodes: {
        borderWidth: 2, fixed: { x: false, y: false }
    },
    interaction: {
        hover: true
    },
    physics: {
        stabilization: true, wind: { x: 0, y: 0 },
    },
    layout: {
        improvedLayout: true,
        hierarchical: {
            direction: "DU",
            sortMethod: "hubsize",
            nodeSpacing: 200,
            treeSpacing: 200
        }
    },
    physics: {
        barnesHut: {
            centralGravity: 0.2,
        },
        maxVelocity: 5,
        minVelocity: 0.47,
        solver: "hierarchicalRepulsion"
    },
    nodes: {
        "physics": true
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
})

network.on("stabilizationIterationsDone", function () {
    network.setOptions({ physics: false });
});

function ListaIdEdgesEvento(idNodo) {
    var contador = 0;
    CapturaEvento = quienesSonLosHijosLineas(idNodo);
    var nivelInicial = getLevel(idNodo);
    var listaIdEdgesEvento = [];

    for (var i = 0; i < CapturaEvento.length; i++) {
        var nivelNodo = getLevel(edges.get(CapturaEvento[i]).to);
        if (nivelNodo > nivelInicial) {
            listaIdEdgesEvento[contador] = CapturaEvento[i];
            contador++;
        }
    }
    return listaIdEdgesEvento;
}

function getLevel(nodoId) {
    return nodes.get(nodoId).level;
}


function ListaIdNodosEvento(listaIdEdgesEvento2) {
    var listaIdNodosEvento = [];
    for (var i = 0; i < listaIdEdgesEvento2.length; i++) {
        listaIdNodosEvento[i] = edges.get(listaIdEdgesEvento2[i]).to;
    }
    return listaIdNodosEvento;
}

function quienesSonLosHijosLineas(id) {
    var temporal = network.getConnectedEdges(id);
    return temporal;
}

function OcultarNodos(IdNodo) {
    var edgesEvento; //los Id de las conexiones que interactuan 
    var nodesEvento; //Los Id de los nodos que interactuan con el evento

    // Sacamos primero lista de conexiones que interactuan con el evento
    edgesEvento = ListaIdEdgesEvento(IdNodo);
    nodesEvento = ListaIdNodosEvento(edgesEvento);

    // console.log("____lineas____", edgesEvento)
    // console.log("____Nodes____", nodesEvento)

    var inicialLevel = getLevel(nodesEvento);
    var UltimoLevel = getLevel(nodesEvento[nodesEvento.length - 1]);
    // console.log("Ultimo level ", UltimoLevel, " nodoID: ", IdNodo, "  ", getLevel(IdNodo));

    // Primero tenemos que actualizar los nodos Hidden=true
    for (var i = 0; i < nodesEvento.length; i++) {

        console.log("R ", IdNodo, " hijos: ", quienesSonLosHijosLineas(nodesEvento[i]), "true or false:", nodes.get(edges.get(quienesSonLosHijosLineas(nodesEvento[i])[0]).to).hidden)
        if (nodes.get(edges.get(quienesSonLosHijosLineas(nodesEvento[i])[0]).to).hidden == false) {
            console.log("++++antes de recursividad ", nodesEvento);
            OcultarNodos(nodesEvento[i]);
            console.log("-----despues de recursividad ", nodesEvento);
        }

        // console.log("llamado:  ", i, nodesEvento[i], " tienen hijos? ", quienesSonLosHijosLineas(nodesEvento[i]));
        nodes.update([
            { id: nodesEvento[i], hidden: !nodes.get(nodesEvento[i]).hidden },
        ])
    }

    // Como 2 paso tenemos que mostrar las conexiones 
    for (var i = 0; i < edgesEvento.length; i++) {
        var conexionAotro = getLevel(edges.get(edgesEvento[i]).to);
        edges.update([
            { id: edgesEvento[i], hidden: !edges.get(edgesEvento[i]).hidden },
        ]);
    }
    network.fit();
}

/*
 * Obtener todos los nodos secundarios
 * red: objeto gráfico
 * _thisNode: el nodo en el que se hizo clic (nodo principal)
 * _Allnodes: utilizado para contener la matriz de ID de nodo secundario
 */
function getAllChilds(network, _thisNode, _Allnodes) {
    var _nodes = network.getConnectedNodes(_thisNode, "to");
    if (_nodes.length > 0) {
        for (var i = 0; i < _nodes.length; i++) {
            getAllChilds(network, _nodes[i], _Allnodes);
            _Allnodes.push(_nodes[i]);
        }
    }
    return _Allnodes;
};

network.on("click", function (e) {
    if (e.edges.length > 0) {
        OcultarNodos(e.nodes[0]);
    }

    var nodosN = []
    console.log("Los hijos de ", e.nodes[0], "son", getAllChilds(network, e.nodes[0], nodosN));
});
