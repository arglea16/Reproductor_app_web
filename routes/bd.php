<?php
$host = "127.0.0.1"; // o el host que uses
$usuario = "root";
$contraseña = "";
$basedatos = "bd_play_list";

// Crear conexión
$conexion = mysqli_connect($host, $usuario, $contraseña, $basedatos);
$conexion-> set_charset("utf8");

// Verificar conexión
if (!$conexion) {
    die("Conexión fallida: " . mysqli_connect_error());
}
echo "Conexión exitosa";
?>
