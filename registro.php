<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Registro de Usuario</title>
</head>
<body>
  <h2>Regístrate</h2>
  <form action="" method="POST">
    <?php 
      include("routes/bd.php");
      include("routes/controlle_registro.php");
    ?>
    <label for="usuario">Usuario:</label><br />
    <input type="text" id="usuario" name="usuario" required /><br /><br />

    <label for="email">Correo electrónico:</label><br />
    <input type="email" id="email" name="email" required /><br /><br />

    <label for="password">Contraseña:</label><br />
    <input type="password" id="password" name="password" required /><br /><br />

    <label for="password_confirm">Confirmar contraseña:</label><br />
    <input type="password" id="password_confirm" name="password_confirm" required /><br /><br />

    <button type="submit" name="bregistrar">Registrar</button>
  </form>

  <p>
    ¿Ya tienes cuenta?
    <a href="index.php">Inicia sesión aquí</a>
  </p>
</body>
</html>
