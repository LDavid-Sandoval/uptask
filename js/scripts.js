eventListeners();

var listaProyectos = document.querySelector('ul#proyectos');




function eventListeners(){

	//document Ready
	document.addEventListener('DOMContentLoaded', function (){
		actualizaProgreso();
	});

	//Boton crear nuevo Proyecto
	document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

	//boton nueva tarea
	if (document.querySelector('.nueva-tarea') !== null) {
		document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
	}

	//botones para las acciones de las tareas
	document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e){
	e.preventDefault();

	//input nuevo proy
	var nuevoProyecto = document.createElement('li');

	//Input Nuevo Proyecto
	nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
	listaProyectos.appendChild(nuevoProyecto);

	//Seleccinar Proyecto
	var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

	//al presionar enter crear el proyecto
	inputNuevoProyecto,addEventListener('keypress', function(e) {
		var tecla =e.which;

		if(tecla === 13){
			guardarProyectoDB(inputNuevoProyecto.value);
			listaProyectos.removeChild(nuevoProyecto);
		}
	});
}

function guardarProyectoDB(nombreProyecto){
	//DAtos por FOMRDATA
	var datos = new FormData();
	datos.append('proyecto', nombreProyecto);
	datos.append('accion','crear');

	//LLAMADO
	var xhr = new XMLHttpRequest();

	//abrir conexión
	xhr.open('POST', 'inc/modelos/modelo-proyectos.php',true);
	//onLoad
	xhr.onload = function(){
		if (this.status === 200) {
		//obtener datos Respuesta
			var respuesta = JSON.parse(xhr.responseText);
			var proyecto = respuesta.nombre_proyecto,
				id_proyecto = respuesta.id_insertado,
				tipo = respuesta.tipo,
				resultado = respuesta.respuesta;

			///Comprobar la insercion
			if (resultado === 'correcto') {
				//Exitoso
				if (tipo === 'crear') {
				//Se creo un nuevo Proyecto
				//inyectar HTML
					var nuevoProyecto = document.createElement('li');
					nuevoProyecto.innerHTML= `
						<a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
							${proyecto}
						</a>
					`;
					//agragar HTML
					listaProyectos.appendChild(nuevoProyecto);
					//enviar alerta
					Swal.fire({
						type: 'success',
						title: 'Proyecto Creado',
						text: 'El proyecto: '+ proyecto +' se creo correctamente'
					})
					//Redireccionar a la nueva url
					.then(result =>{
						if (result.value) {
							window.location.href = 'index.php?id_proyecto=' + id_proyecto; 
						}
					})

				} else {
					//SE actualizo o elimino
				}

			}else {
				//hubo un error
				Swal.fire({
					type: 'error',
					title: 'Ooops',
					text: 'Hubo un error!'
				});	
			}

		}
	}
	xhr.send(datos);
}

//agregar una nueva tarea

function agregarTarea(e){
	e.preventDefault();
	var nombreTarea =document.querySelector('.nombre-tarea').value;
	//validar campo
	if (nombreTarea === '') {
		Swal.fire({
			type: 'error',
			title: 'Error',
			text: 'No has agregado una tarea'
		});
	} else {
		//insertar en PHP
		var datos = new FormData();
		datos.append('tarea', nombreTarea);
		datos.append('accion','crear');
		datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

		//llamado a AJAX
		var xhr = new XMLHttpRequest();
		//abrir conexión
		xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
		//ejecutar respuesta
		xhr.onload = function(){
			if (this.status === 200) {
				var respuesta = JSON.parse(xhr.responseText);
				var resultado = respuesta.respuesta,
					tarea = respuesta.tarea,
					id_insertado = respuesta.id_insertado,
					tipo = respuesta.tipo;
				if (resultado === 'correcto') {
					if (tipo === 'crear') {
						Swal.fire({
							type: 'success',
							title: 'Tarea Creada',
							text: 'La tarea "' +tarea + '" se creó correctamente'
						});
						//Seleccionar lista vacia
						var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
						if (parrafoListaVacia.length > 0) {
							document.querySelector('.lista-vacia').remove();
						}

						//construir en el template
						var nuevaTarea = document.createElement('li');

						//agregamos el ID
						nuevaTarea.id = 'tarea:' +id_insertado;

						//agregar la clase tarea
						nuevaTarea.classList.add('tarea');

						//Construir HTML
						nuevaTarea.innerHTML = `
							<p>${tarea}</p>
							<div class="acciones">
								<i class="far fa-check-circle"></i>
								<i class="far fa-trash-alt"></i>
							</div>
						`;
						//agregarlo al DOM
						var listado = document.querySelector('.listado-pendientes ul');
						listado.appendChild(nuevaTarea);
						//Limpiar el formulario
						document.querySelector('.agregar-tarea').reset();
						//actualizar progreso
						actualizaProgreso();
					}
				} else{
					Swal.fire({
						type: 'error',
						title: 'Lo sentimos',
						text: 'Hubo un error al crear ' + tarea
					});						
				}
			}
		}
		//enviar datos
		xhr.send(datos);
	}
}


//EStado Tareas borrar o cambiar

function accionesTareas(e){
	e.preventDefault();
	if (e.target.classList.contains('fa-check-circle')) {
		if (e.target.classList.contains('completo')) {
			e.target.classList.remove('completo');
			cambiarEstadoTarea(e.target, 0);
		} else {
			e.target.classList.add('completo');
			cambiarEstadoTarea(e.target,1);
		}
	}
	if (e.target.classList.contains('fa-trash-alt')) {
		Swal.fire({
			title: '¿Estas Segur@ de eliminar esta tarea?',
			text: "Esta accion no se puede deshacer",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, deseo Borrar!',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.value) {
			//BORRAR DE html
			var tareaEliminar = e.target.parentElement.parentElement;
			tareaEliminar.remove();
		  	//borrar de la base de Datos
		  	eliminarTareaBD(tareaEliminar);
		    Swal.fire(
		      'Eliminada!',
		      'La tarea se elimino correctamente',
		      'success'
		    )
		  }
		})
	}
}


//ESTADO deTAREAS

function cambiarEstadoTarea(tarea, estado){
	var idTarea = tarea.parentElement.parentElement.id.split(':');

	//llamado JAX
	var xhr = new XMLHttpRequest();

	//información
	var datos = new FormData();
	datos.append('id', idTarea[1]);
	datos.append('accion','actualizar');
	datos.append('estado', estado);

	//abrir la conexión
	xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
	//onload
	xhr.onload = function(){
		if (this.status === 200) {
			JSON.parse(xhr.responseText);
			//actualizar progreso
			actualizaProgreso();
		}
	}
	xhr.send(datos);
}

//eliminarBase deDAtos
function eliminarTareaBD(tarea){

	var idTarea = tarea.id.split(':');

	//llamado JAX
	var xhr = new XMLHttpRequest();

	//información
	var datos = new FormData();
	datos.append('id', idTarea[1]);
	datos.append('accion','eliminar');

	//abrir la conexión
	xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
	//onload
	xhr.onload = function(){
		if (this.status === 200) {
			JSON.parse(xhr.responseText);
			actualizaProgreso();
			//comprobar tareas restantes
			var listaTareasRestante =document.querySelectorAll('li.tarea');
			if (listaTareasRestante.length === 0) {
				document.querySelector('.listado-pendientes ul').innerHTML = "<p class ='lista-vacia'>No hay tareas e este proyecto</p>";
			}
			//actualizar progreso
			actualizaProgreso();
		}
	}
	xhr.send(datos);
}


//actualiza Progreso

function actualizaProgreso(){

	const tareas =document.querySelectorAll('li.tarea');
	//obtener tareas comletadas
	const tareasCompletas =document.querySelectorAll('i.completo');
	//definir avance
	var avance = Math.round(((tareasCompletas.length) / (tareas.length))*100);

	const porcentaje = document.querySelector('#porcentaje');
	porcentaje.style.width = avance+'%';

	if (avance === 100) {
		Swal.fire({
		  position: 'center',
		  type: 'success',
		  title: 'Proyecto Terminado',
		  text: 'Ya no tienes tareas pendientes',
		  showConfirmButton: false,
		  timer: 2500
		})
	}
}












