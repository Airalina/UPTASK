<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];
//echo json_encode($_POST);

if ($accion === 'crear') {

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //Consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s',$proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto

            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //tomar la excepcion en caso de erorr

        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
    // echo json_encode($respuesta);
}