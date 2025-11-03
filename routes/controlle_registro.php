<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Datos enviados desde el formulario
    $usuario = $_POST['usuario'] ?? '';
    $contraseña = $_POST['password'] ?? '';
    $email    = $_POST['email'] ?? '';

    // Conexión a la base de datos
    $conexion = mysqli_connect("127.0.0.1", "root", "", "bd_play_list");
    mysqli_set_charset($conexion, "utf8mb4");

    if (!$conexion) {
        die("Error al conectar con la base de datos: " . mysqli_connect_error());
    }

    // Validar si ya existe el usuario o email
    $check = "SELECT * FROM usuario WHERE usuario='$usuario' OR email='$email'";
    $resultado_check = mysqli_query($conexion, $check);

    if (!$resultado_check) {
        die("Error en la consulta: " . mysqli_error($conexion));
    }

    if (mysqli_num_rows($resultado_check) > 0) {
        // Usuario o email ya existe
        header("Location: ../registro.php?error=1");
        exit;
    }

    // Insertar el nuevo usuario
    $insert = "INSERT INTO usuario (usuario, clave, email) VALUES ('$usuario', '$contraseña', '$email')";
    $resultado_insert = mysqli_query($conexion, $insert);

    if (!$resultado_insert) {
        die("Error al registrar usuario: " . mysqli_error($conexion));
    }

    // Registro exitoso, redirigir al login
    header("Location: ../index.php?registro=ok");
    exit;

    // Cerrar conexión
    mysqli_close($conexion);
}
?>

