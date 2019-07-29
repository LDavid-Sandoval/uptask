<?php  
	function obtenerPaginaActual(){
		$archivo =basename($_SERVER['PHP_SELF']);
		$pagina = str_replace(".php", "", $archivo);
		return $pagina;
	}

obtenerPaginaActual();


/*Consultas*/
//obter proyectos

function obtenerProyectos(){
	include 'conexion.php';
	try{
		return $conn->query('SELECT id, nombre_proyecto FROM proyectos');
	} catch(Exeption $e){
		echo "error! : " . $e->getMessage();
		return false;
	}

}

function obtenerNombreProyecto($id = null){
	include 'conexion.php';
	try{
		return $conn->query("SELECT nombre_proyecto FROM proyectos WHERE id={$id}");
	} catch(Exeption $e){
		echo "error! : " . $e->getMessage();
		return false;
	}
}

//obtener las tareas del proy

function obtenerTareasProyecto($id = null){
	include 'conexion.php';
	try{
		return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
	} catch(Exeption $e){
		echo "error! : " . $e->getMessage();
		return false;
	}	
}


?>