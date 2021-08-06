
var json_ejemplo={} ;

function Get(){
  const url = 'https://raw.githubusercontent.com/SemilleroSOLID/dashboardSOLID/main/Demos/Demo_3_peticiones_Http/exampleJson.json'
  const http = new XMLHttpRequest()
  
  http.open('GET',url);
  
  http.onreadystatechange = function(){
    console.log('status '+this.readyState);
      if(this.readyState == 4 && this.status == 200){
          var resultado = JSON.parse(this.responseText);
          console.log(resultado.name);
          json_ejemplo=resultado;
          
          InitMain();
          PonerTitulo(resultado.name);
        }
  } 
  console.log("## Error");
  http.send();
  json_ejemplo="{}";
}

function PonerTitulo(name){
  txt = document.getElementById("title");
  txt.innerHTML=name;

}