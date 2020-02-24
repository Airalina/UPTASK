
eventListeners();

function eventListeners(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}
 function validarRegistro(e) {
     e.preventDefault();
    
     var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

     //console.log(usuario+ " "+ password);
     if(usuario === '' || password === ''){
         //la vadilacion fallo
        Swal.fire({
            type: 'error',
            title: 'Error...',
            text: 'Ambos campos son obligatorios!'
           
          })
     } else {
       //ambos campos son correctos, mandar ejecutar ajax

       //datos que se envian al servidor
       var datos = new FormData();
       datos.append('usuario', usuario);
       datos.append('password', password);
       datos.append('accion', tipo);
      //  console.log(datos.get('usuario'));

      //llamado a Ajax
      var xhr = new XMLHttpRequest();

      //abrir la conexion
      xhr.open('POST','inc/modelos/modelo-admin.php', true);

      //retorno de datos
      xhr.onload = function(){
        if(this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            
            console.log(respuesta);
            // Si la respuesta es correcta
            if(respuesta.respuesta === 'correcto') {
                // si es un nuevo usuario
                if(respuesta.tipo === 'crear') {
                    swal({
                        title: 'Usuario Creado',
                        text: 'El usuario se creó correctamente',
                        type: 'success'
                    });
                } else if (respuesta.tipo === 'login') {
                    swal({
                        title: 'Login Correcto',
                        text: 'Presiona Ok para abrir el dashboard',
                        type: 'success'
                    })
                    .then(resultado => {
                        if(resultado.value){
                            window.location.href = 'index.php';
                        }
                        
                    })

                } 
            } 
                else {
                // Hubo un error
                swal({
                    title: 'Error',
                    text: 'Hubo un error',
                    type: 'error'
                })
            }
        }
    }
      
        //Enviar la peticion
        xhr.send(datos);
       
     }
     
 }