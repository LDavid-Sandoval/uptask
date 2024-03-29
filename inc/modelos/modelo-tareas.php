<?php  

	$accion = $_POST['accion'];
	$id_proyecto = (int) $_POST['id_proyecto'];
	$tarea = $_POST['tarea'];
	$estado = (int)$_POST['estado'];
	$id_tarea = (int) $_POST['id'];


	if ($accion === 'crear') {

		include '../funciones/conexion.php'; 

		try{
			$stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?) ");
			$stmt->bind_param('si', $tarea,$id_proyecto);
			$stmt->execute();
			if ($stmt->affected_rows > 0) {
				$respuesta = array(
				 	'respuesta' => 'correcto',
				 	'id_insertado' => $stmt->insert_id,
				 	'tipo' => $accion,
				 	'tarea' => $tarea
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

	if ($accion === 'actualizar') {
	include '../funciones/conexion.php';

		try{
			$stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
			$stmt->bind_param('ii', $estado, $id_tarea);
			$stmt->execute();
			if ($stmt->affected_rows > 0) {
				$respuesta = array(
				 	'respuesta' => 'correcto',
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

	if ($accion === 'eliminar') {
	include '../funciones/conexion.php'; 
		try{
			$stmt = $conn->prepare("DELETE from tareas WHERE id = ? ");
			$stmt->bind_param('i', $id_tarea);
			$stmt->execute();
			if ($stmt->affected_rows > 0) {
				$respuesta = array(
				 	'respuesta' => 'correcto',
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

?>