
eventListeners();

///Add EVent listener

function eventListeners(){
	formulario.addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
	e.preventDefault();
	var formulario = document.querySelector('#formulario'),
		usuario = document.querySelector('#usuario').value,
		password = document.querySelector('#password').value,
		tipo = document.querySelector('#tipo').value;

	if (usuario === '' || password === '') {
		Swal.fire({
		  type: 'error',
		  title: 'Opsss',
		  text: 'Faltan campos obligatorios'
		});
	}else {
		//Ambos campos son correctos
		//DATOS que se envian al servidor
		var datosFormulario = new FormData();
		datosFormulario.append('usuario', usuario);
		datosFormulario.append('password', password);		
		datosFormulario.append('accion', tipo);

		///CRear llmado a AJAX
		var xhr = new XMLHttpRequest();

		//Abrir conexion
		xhr.open("POST", 'inc/modelos/modelo-admin.php', true);

		//OnLoad
		xhr.onload = function(){
			if (this.status === 200) {
				var respuesta = JSON.parse(xhr.responseText);

				//REspuesta correcta
				if (respuesta.respuesta === 'correcto') {
					//Si es nuevo usurio
					if (respuesta.tipo === 'crear') {
						Swal.fire({
							type: 'success',
							title: 'Usuario Creado',
							text: 'El usuario se creo correctamente'
						});						
					} else if (respuesta.tipo === 'login') {
						Swal.fire({
							type: 'success',
							title: 'Login Correcto',
							text: 'Presiona ok para ir al dashboar'
						})
						.then(result =>{
							if (result.value) {
								window.location.href = 'index.php';
							}
						})	
					}
				}else {
					//Hubo un error
					Swal.fire({
						type: 'error',
						title: respuesta.titulo,
						text: respuesta.error
					});	
				}
			}
		}
		//enviar la peticion
		xhr.send(datosFormulario);
	}
}