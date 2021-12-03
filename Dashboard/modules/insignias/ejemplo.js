function Get_Insignias() {
  objJSON = JSON.parse(json);
  console.log(objJSON);

  pp = objJSON.puntos_puntualidad;
  document.querySelector("#puntualModal .puntos_obtenidos").innerText = pp;
  document.querySelector("#puntualModal .puntos_restantes").innerText = 100 - pp;

  pc = objJSON.puntos_conquista;
  document.querySelector("#conquistadorModal .puntos_obtenidos").innerText = pc;
  document.querySelector("#conquistadorModal .puntos_restantes").innerText = 100 - pc;

  pb = objJSON.puntos_brillantez;
  document.querySelector("#brillanteModal .puntos_obtenidos").innerText = pb;
  document.querySelector("#brillanteModal .puntos_restantes").innerText = 100 - pb;

  pe = objJSON.puntos_estudiante;
  document.querySelector("#estudiosoModal .puntos_obtenidos").innerText = pe;
  document.querySelector("#estudiosoModal .puntos_restantes").innerText = 100 - pe;
}