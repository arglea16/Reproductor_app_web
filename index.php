<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inicio de Sesión</title>
</head>
<body>
  <h2>Iniciar Sesión</h2>

 <?php if (isset($_GET['error'])): ?>
    <p style="color:red;">Error en la autenticación. Intenta de nuevo.</p>
  <?php endif; ?>

  <form action="routes/controller.php" method="POST">
    <label for="usuario">Usuario:</label><br />
    <input type="text" id="usuario" name="usuario" required /><br /><br />

    <label for="contraseña">Contraseña:</label><br />
    <input type="password" id="password" name="password" required /><br /><br />

    <button type="submit" name="bingresar">Entrar</button>
  </form>

  <p>
    ¿No tienes cuenta?
    <a href="registro.php">Regístrate aquí</a>
  </p>
</body>
</html>
