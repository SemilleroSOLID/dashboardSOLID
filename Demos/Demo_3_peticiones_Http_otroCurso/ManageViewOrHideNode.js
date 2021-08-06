/**
 * @description Obtiene el nivel de un nodo haciendo la busqueda en los nodos almacenados en el la red
 * @param id del nodo a obtener el nivel
 * @param Nodesjs nodos pertenecientes al modelo
 * @returns nivel del nodo de entrada
 * @author Sebastian Agudelo
 */

function getLevel(_thisNode, Nodesjs) {
  return Nodesjs.get(_thisNode).level;
}

/**
 * @description: todos los nodos secundarios con un nivel superior al padre, recursivamente
 * @param:network objeto gráfico
 * @param:_thisNode: el nodo en el que se hizo clic (nodo principal)
 * @param:_Allnodes: utilizado para contener la matriz de ID de nodo secundario
 * @returns Todos los nodos hijos de _thisNode
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
}

/**
 * @description Obtiene todas las conexiones existentes de un nodo, teniendo
 * en cuenta el name para saber si es del mismo arbol.
 * @param:network objeto gráfico
 * @param:_thisNode: el nodo en el que se hizo clic (nodo principal)
 * @param:_Allnodes: utilizado para contener la matriz de ID de nodo secundario
 * @param Nodesjs nodos pertenecientes al modelo
 * @param Edgesjs Enlaces entre nodos del modelo creado posteriormente
 * @returns nivel del nodo de entrada
 * @author Sebastian Agudelo
 */
function getAllChildsEdges(network, _thisNode, _EdgesN, Nodesjs,Edgesjs) {
  var _Edges = network.getConnectedEdges(_thisNode, "to");
  for (let t = 0; t < _Edges.length; t++) {
    if (Edgesjs.get(_Edges[t]).name == Nodesjs.get(_thisNode).name) {
      _EdgesN.push(_Edges[t]);
    }
  }
  return _EdgesN;
}

/**
 * @description Obtiene todas los Nodos que son hijos de un nodo, pero teniendo en cuenta el name
 * para saber que pertenece al mismo arbol
 * @param:nodesChildAll objeto gráfico
 * @param:nodeRoot: el nodo en el que se hizo clic (nodo principal)
 * @param Nodesjs nodos pertenecientes al modelo
 * @returns Nodos que son del mismo arbol, y que tienen un nivel superior
 * @author Sebastian Agudelo
 */
function nodeChildLevelTop(nodesChildAll, nodeRoot, Nodesjs) {
  var nodesNew = [];
  for (let i = 0; i < nodesChildAll.length; i++) {
    if (
      getLevel(nodesChildAll[i], Nodesjs) > getLevel(nodeRoot, Nodesjs) &&
      Nodesjs.get(nodesChildAll[i]).name == Nodesjs.get(nodeRoot).name
    ) {
      nodesNew.push(nodesChildAll[i]);
    }
  }
  return nodesNew;
}

/**
 * @description Obtiene todas las conexiones que existen entre Todos los
 * nodos Hijos de cualquier Nodo, se elimina la primer conexion pues esta es la que viene
 * del nodo padre de NodeRoot
 * @param:NodesChild Todos los nodos que son hijos de un nodo hasta el ultimo nivel
 * @param:nodeRoot: el nodo en el que se hizo clic (nodo principal)
 * @param Nodesjs nodos pertenecientes al modelo
 * @returns Todas las conexiones que pertenecen a todos los Nodos hijos
 * @author Sebastian Agudelo
 */
function EdgesAllConectToNodesChild(NodesChild, nodeRoot, network, Nodesjs) {
  //se obtiene son las lineas de un solo nodo
  var edgesHijos = getAllChildsEdges(network, nodeRoot, [], Nodesjs,Edgesjs);
  delete edgesHijos[0]; //eliminamos la conexion que viene de abajo
  var EdgesOfAllChild = edgesHijos;
  for (let x = 0; x < NodesChild.length; x++) {
    var response = getAllChildsEdges(network, NodesChild[x], [], Nodesjs,Edgesjs);
    for (let y = 0; y < response.length; y++) {
      EdgesOfAllChild.push(response[y]);
    }
  }
  return EdgesOfAllChild;
}

/**
 * @description Obtiene un nodo de un nivel mas que el raiz para saber si
 * este esta visible o no
 * @param:nodosHijosArray Todos los nodos que son hijos de un nodo hasta el ultimo nivel
 * @param:NodoRaiz: el nodo en el que se hizo clic (nodo principal)
 * @param Nodesjs nodos pertenecientes al modelo
 * @returns True si alguno de los nodos hijos es visible False en otro caso
 * @author Sebastian Agudelo
 */

function isAnyNodeVisible(childNodesChild, nodeRoot, Nodesjs) {
  for (let r = 0; r < childNodesChild.length; r++) {
    if (
      Nodesjs.get(childNodesChild[r]).level ==
      Nodesjs.get(nodeRoot).level + 1
    ) {
      return Nodesjs.get(childNodesChild[r]).hidden;
    }
  }
  return false;
}

/**
 * @description Obtien todos los nodos que son inmediatamente siguientes al nodoRaiz
 * @param:nodeRoot: el nodo en el que se hizo clic (nodo principal)
 * @param Nodesjs nodos pertenecientes al modelo
 * @returns lista de nodos inmediatamnete siguientes al nodoRaiz
 * @author Sebastian Agudelo
 */
function nodesNextNodeId(nodeRoot, network, Nodesjs) {
  var listNodesChilds = getAllChilds(network, nodeRoot, []);
  var listNodesContiguous = [];
  for (let i = 0; i < listNodesChilds.length; i++) {
    if (
      getLevel(listNodesChilds[i], Nodesjs) ==
        getLevel(nodeRoot, Nodesjs) + 1 &&
      Nodesjs.get(nodeRoot).name == Nodesjs.get(listNodesChilds[i]).name
    ) {
      listNodesContiguous.push(listNodesChilds[i]);
    }
  }
  return listNodesContiguous;
}

/**
 * @description actualiza todos los nodos  y conexiones de las dos listas entrantes
 * @param:nodesModify lista de Todas los nodos que se le quieren cambiar el estado de Hidden
 * @param:edgesModify lista de Todas las conexiones que se le quieren cambiar el estado de Hidden
 * @param:state true si se quieren ocultar los nodos y conexiones de las dos listas false en otro caso
 * @param Nodesjs nodos pertenecientes al modelo
 * @param Edgesjs Enlaces entre nodos del modelo creado posteriormente
 * @author Sebastian Agudelo
 */
function modifyListNodesAndEdges(nodesModify, edgesModify, state, Nodesjs,Edgesjs) {
  for (var i = 0; i < nodesModify.length; i++) {
    Nodesjs.update([{ id: nodesModify[i], hidden: state }]);
  }
  for (let e = 0; e < edgesModify.length; e++) {
    Edgesjs.update([{ id: edgesModify[e], hidden: state }]);
  }
}

/**
 * @description metodo para hacer visibles a los nodos y conexiones inmediatamente siguientes
 * @param:NodoRaiz: el nodo en el que se hizo clic (nodo principal)
 * @param Edgesjs Enlaces entre nodos del modelo creado posteriormente
 * @author Sebastian Agudelo
 */

function viewNode(nodeRoot, network, Nodesjs,Edgesjs) {
  //sacamos primero lista de conexiones que interactuan con el evento
  var edgesModify = getAllChildsEdges(network, nodeRoot, [], Nodesjs,Edgesjs);
  var nodesModify = nodesNextNodeId(nodeRoot, network, Nodesjs); //nodos inmendiatamente siguientes al raiz
  modifyListNodesAndEdges(nodesModify, edgesModify, false, Nodesjs,Edgesjs);
}

/**
 * @description metodo para ocultar a los nodos y conexiones inmediatamente siguientes
 * @param nodeRoot: el nodo en el que se hizo clic (nodo principal)
 * @param network interfaz de la vista
 * @param Nodesjs nodos pertenecientes al modelo
 * @param Edgesjs Enlaces entre nodos del modelo creado posteriormente
 * @author Sebastian Agudelo
 */
function hideNodes(nodeRoot, network, Nodesjs,Edgesjs) {
  //obtenemos los que son de nivel superior para saber cuantos tiene
  var nodesModify = nodeChildLevelTop(
    getAllChilds(network, nodeRoot, []),
    nodeRoot,
    Nodesjs
  );
  var edgesModify = EdgesAllConectToNodesChild(
    nodesModify,
    nodeRoot,
    network,
    Nodesjs
  );
  modifyListNodesAndEdges(nodesModify, edgesModify, true, Nodesjs,Edgesjs);
}

/**
 * @description metodo Principal y verificar si se oculta o se muestra unos nodos
 * @param:network objeto gráfico
 * @param:nodeRoot: el nodo en el que se hizo clic (nodo principal)
 * @param Nodesjs nodos pertenecientes al modelo
 * @param Edgesjs Enlaces entre nodos del modelo creado posteriormente
 * @author Sebastian Agudelo
 */
function manageNodesHideOrView(network, nodeRoot, Nodesjs, Edgesjs) {
  var nodeChildsAll = nodeChildLevelTop(
    getAllChilds(network, nodeRoot, []),
    nodeRoot,
    Nodesjs
  );
  if (isAnyNodeVisible(nodeChildsAll, nodeRoot, Nodesjs) == false) {
    console.log("___________Hide____________" + JSON.stringify(Nodesjs));
    hideNodes(nodeRoot, network, Nodesjs,Edgesjs);
  } else {
    console.log("___________view____________" + JSON.stringify(Nodesjs));
    viewNode(nodeRoot, network, Nodesjs,Edgesjs);
  }
  network.fit();
}

/**
 * @description funcion de para iniciar el evento del manejo de ocultamiento ovista de nodos 
 * @param:networkIn objeto gráfico
 * @param:nodesIn: Nodos pertenecientes al modelo
 * @param:edgesIn: Edges pertenecientes al modelo iniciado posteriormente
 * @author Sebastian Agudelo
 */

function InitManageViewOrHideNode(networkIn, nodesIn, edgesIn) {
  this.Edgesjs = edgesIn;
  networkIn.on("click", function (e) {
    // Si se hace click en un nodo.
    if (e.nodes.length != 0) {
      manageNodesHideOrView(networkIn, e.nodes[0], nodesIn, edgesIn);
    }
  });
}
