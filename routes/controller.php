<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'] ?? '';
    $contraseña = $_POST['password'] ?? '';

    $conexion=mysqli_connect("127.0.0.1","root","","bd_play_list");
    

    if (!$conexion) {
        die("Error al conectar con la base de datos: " . mysqli_connect_error());
    } else {
        echo "Conexión OK<br>";
    }

    $consulta = "SELECT * FROM usuario WHERE usuario='$usuario' AND clave='$contraseña'";

    $resultado = mysqli_query($conexion, $consulta);

    if (!$resultado) {
        die("Error en la consulta: " . mysqli_error($conexion));
    }


    if (mysqli_num_rows($resultado) > 0) {
        $_SESSION['usuario'] = $usuario;
        header("Location: ../inicio.php");
        exit;
    } else {
        header("Location: ../index.php?error=1");
        exit;
    }

    mysqli_free_result($resultado);
    mysqli_close($conexion);
}
?>


