function Get(){
  const url = ''
  const http = new XMLHttpRequest()
  
  http.open("GET", url)
  http.onreadystatechange = function(){
  
      if(this.readyState == 4 && this.status == 200){
          var resultado = JSON.parse(this.responseText);
          console.log(resultado.name)
          return resultado;
        }
  }
  http.send()
  return '{}';
}

var json_ejemplo =Get();