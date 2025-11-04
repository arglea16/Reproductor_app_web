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
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>
  <h2>Iniciar Sesión</h2>

  <?php if (isset($_GET['error'])): ?>
    <p style="color:red;">Error en la autenticación. Intenta de nuevo.</p>
  <?php endif; ?>

  <form action="routes/controller.php" method="POST">
    <label for="usuario">Usuario:</label><br />
    <input type="text" id="usuario" name="usuario" required /><br /><br />

    <label for="password">Contraseña:</label><br />
    <input type="password" id="password" name="password" required /><br /><br />

    <button type="submit" name="bingresar" class="btn">Entrar</button>
  </form>

  <p>
    ¿No tienes cuenta?
    <a href="registro.php">Regístrate aquí</a>
  </p>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
