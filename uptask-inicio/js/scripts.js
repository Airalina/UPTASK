eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');


function eventListeners() {

    //Document Ready
    document.addEventListener('DOMContentLoaded', function(){
            actualizarProgreso();

        });



    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    //boton para nueva tarea
    if (document.querySelector('.nueva-tarea') !== null) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }
    //botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();

    //crea un inpuut para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);
    //selecciona id del nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener('keypress', function (e) {
        // console.log(e);
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoDb(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    })

}

function guardarProyectoDb(nombreProyecto) {
    //crear llamada ajax
    var xhr = new XMLHttpRequest();
    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    //carga
    xhr.onload = function () {
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;
            //comprobar la respuesta
            if (resultado === 'correcto') {
                //exitoso
                if (tipo === 'crear') {
                    //se creo  nuevo proyecto inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                            <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                           ${proyecto}
                        </a>
                        `;
                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);
                    //enviar alerta
                    swal({
                            title: 'Proyecto Creado',
                            text: 'El proyecto: ' + proyecto + ' se creó correctamente',
                            type: 'success'
                        })
                        //redireccionar a otra url
                        .then(resultado => {
                            // redireccionar a la nueva URL
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })


                } else {
                    //se actualizo o elimino
                }
            } else {
                //error
                swal({
                    title: 'Error',
                    text: 'Hubo un error',
                    type: 'error'
                })
            }
        }
    }
    //enviar el request 
    xhr.send(datos);

}
//agregar nueva tarea

function agregarTarea(e) {
    e.preventDefault();

    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el campo tenga algo escrito

    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
            type: 'error'
        })
    } else {
        // la tarea tiene algo, insertar en PHP

        // crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // crear formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);


        // ejecutarlo y respuesta
        xhr.onload = function () {
            if (this.status === 200) {
                // todo correcto
                var respuesta = JSON.parse(xhr.responseText);
                // asignar valores

                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    // se agregó correctamente
                    if (tipo === 'crear') {
                        // lanzar la alerta
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente'
                        });

                        // seleccionar el parrafo con la lista vacia

                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // construir el template
                        var nuevaTarea = document.createElement('li');

                        // agregamos el ID
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        // agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // construir el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                       `;

                        // agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();
                         //actualizar el progreso
                          actualizarProgreso();
                    }
                } else {
                    // hubo un error
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    })
                }
            }
        }
        // Enviar la consulta
        xhr.send(datos);
    }
}

//cambia el estado de las tareas o las elimina

function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Estas seguro?',
            text: "Esta operacion es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borralo!',
            cancelButtonText: 'cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //borrar de la base de datos
                eliminarTareaBD(tareaEliminar);
                //borrar del html
                tareaEliminar.remove();

                Swal.fire(
                    'Borrado!',
                    'La tarea ha sido eliminada',
                    'success'
                )
            }
        })

    }

}
// completa o descompleta la tarea
function cambiarEstadoTarea(tarea, estado) {
    //console.log(tarea.parentElement.parentElement.id.split(':'));
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    //llamado a ajax
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    //console.log(estado);

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    // onload
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            actualizarProgreso();

        }
    }
    //enviar la peticion
    xhr.send(datos);
}
//elimina las tareas de la base de datos
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    //llamado a ajax
    var xhr = new XMLHttpRequest();
    //informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    //console.log(estado);

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    // onload
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
          
            //comprobar que hay tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = '<p class="lista-vacia"> No hay tareas en el proyecto </p>';
            }
            //actualizar el progreso
            actualizarProgreso();
        }
    }
    //enviar la peticion
    xhr.send(datos);

}
//actualiza el avance del proyecto
function actualizarProgreso() {
    //console.log('progreso');
    //obtrener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');
    //obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');
    //determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length)*100);
    
    ///asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

//MOSTRAR UNA ALERTA AL LLEGAR A 100%
if(avance === 100){
    swal({
        type: 'success',
        title: 'Proyecto ha sido completado!',
        text: 'Ya no tienes mas tareas pendientes!  '
    });

}


}



