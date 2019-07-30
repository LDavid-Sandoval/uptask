<?php
    include 'inc/funciones/sesiones.php';
    include 'inc/funciones/funciones.php';   
    include 'inc/templates/header.php';
    include 'inc/templates/barra.php';
    //obtener el id

    if (isset($_GET['id_proyecto'])) {
        $id_proyecto = $_GET['id_proyecto'];
    } 
?>

<div class="contenedor">
<?php  
      include 'inc/templates/sidebar.php';    
?>

    <main class="contenido-principal">
        <?php  
            $proyecto = obtenerNombreProyecto($id_proyecto);
            if ($proyecto) {
                echo "<h1>Proyecto Actual: ";
                foreach ($proyecto as $nombre) {
                    echo "<span>";
                    echo $nombre['nombre_proyecto'];
                    echo "</span>"; 
                }
                echo "</h1>";?>
            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>
        <?php } else{
                    echo "<h1>Selecciona un proyecto</h1>";
                } ?>

        <h2>Lista de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
                <?php  //obtener tareas del proyecto actual
                    $tareas = obtenerTareasProyecto($id_proyecto);
                    if ($tareas->num_rows > 0) {
                        //Hay tareas
                        foreach ($tareas as $tarea) {?>
                            <li id="tarea:<?php echo $tarea['id']; ?>" class="tarea">
                                <p><?php echo $tarea['nombre'] ?></p>
                                <div class="acciones">
                                    <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : '')?>"></i>
                                    <i class="far fa-trash-alt"></i>
                                </div>
                            </li>  
                     <?php   }
                    } else {
                        echo "<p class ='lista-vacia'>No hay tareas e este proyecto</p>";
                    }
                ?>
            </ul>
        </div>
        <div class="avance">
            <h2>Avance del proyecto</h2>
            <div id="barra-avance" class="barra-avance">
                <div id="porcentaje" class="porcentaje">
                </div>
            </div>
        </div>   
    </main>
</div><!--.contenedor-->

<?php
    include 'inc/templates/footer.php'; 
?>