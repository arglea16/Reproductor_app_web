<?php
// incluir la bd y controladores de las rutas de la consulta
include("routes/bd.php");
include("routes/controller.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Formulario de Inicio de Sesión</title>
</head>
<body>
  <h2>Iniciar Sesión</h2>
  <form action="" method="POST">
    <label for="usuario">Usuario:</label><br />
    <input type="text" id="usuario" name="usuario" required /><br /><br />

    <label for="contrasena">Contraseña:</label><br />
    <input type="password" id="contraseña" name="password" required /><br /><br />

    <button type="submit" name="bingresar">Entrar</button>
  </form>

  <p>
    ¿No tienes cuenta?
    <a href="registro.php">Regístrate aquí</a>
  </p>
</body>
</html>

