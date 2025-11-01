<?php 
// si el botom de ingresar es precionado 
if (!empty($_POST["bingresar"])) {
    if (empty($_POST["usuario"]) || empty($_POST["password"])) {
        echo "Por favor, llene todos los campos";
    } else {
        $usuario = $_POST["usuario"];
        $clave = $_POST["password"];

        $stmt = $conexion->prepare("SELECT * FROM usuario WHERE usuario = ? AND clave = ?");
        $stmt->bind_param("ss", $usuario, $clave);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($datos = $resultado->fetch_object()) {
            header("Location: inicio.php");
            exit();
        } else {
            echo "Acceso denegado";
        }
    }
}
?>
