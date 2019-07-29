<?php  

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
	# Codigo para crear los administradores
	$opciones = array(
		'cost' => 12
	);

	$hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
   	include '../funciones/conexion.php'; 

	try{
		$stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
		$stmt->bind_param('ss', $usuario, $hash_password);
		$stmt->execute();
		if ($stmt->affected_rows > 0) {
			$respuesta = array(
			 	'respuesta' => 'correcto',
			 	'id_insertado' => $stmt->insert_id,
			 	'tipo' => $accion
			);
		}else{
			$respuesta = array(
			 	'respuesta' => 'error',
			);
		}
		$stmt->close();
		$conn->close();

	} catch (exeption $e){
		//tomar exepcion
		$respuesta = array(
			'error' => $e->getMessage()
		);	
	}

	echo json_encode($respuesta);
}

if ($accion === 'login') {
		# Logear usuarios
	include '../funciones/conexion.php';
	try{
		//seleccionar <el Administrador de la base de datos
		$stmt = $conn->prepare("SELECT usuario, id, password  FROM usuarios WHERE usuario = ?");
		$stmt->bind_param('s', $usuario);
		$stmt->execute();
		//Loger Usuario
		$stmt->bind_result($nombre_usuario, $id_usuario, $password_usuario);
		$stmt->fetch();
		if ($nombre_usuario) {
			//EL usuario existe verificar el passwor
			if (password_verify($password, $password_usuario)) {
				//Inciar la sesión
				session_start();
				$_SESSION['nombre'] = $nombre_usuario;
				$_SESSION['id'] = $id_usuario;				
				$_SESSION['login'] = true;
				# Login correcto
				$respuesta=array(
					'respuesta'=> 'correcto',
					'tipo' => $accion
				);
			} else {
				//Login incorrecto, enviar error
				$respuesta=array(
					'titulo'=> 'Contraseña incorrecta',
					'error'=> 'Ingresa la contraseña correcta'
				);
			}

		}else{
			$respuesta=array(
				'titulo'=> 'Usuario no existente',
				'error'=> 'Ingresa un usuario valido'
			);
		}
		$stmt->close();
		$conn->close();


	} catch (exeption $e){
		//tomar exepcion
		$respuesta = array(
			'pass' => $e->getMessage()
		);	
	}
	echo json_encode($respuesta);
}
?> 