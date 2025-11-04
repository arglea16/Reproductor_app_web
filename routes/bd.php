<?php
$host = "127.0.0.1";
$usuario = "root";
$contraseña = "";
$basedatos = "bd_playlist";

// Crear conexión
$conexion = mysqli_connect($host, $usuario, $contraseña, $basedatos);

// Verificar conexión
if (!$conexion) {
    die("Conexión fallida: " . mysqli_connect_error());
}

// Establecer el charset
mysqli_set_charset($conexion, "utf8mb4");
?>

