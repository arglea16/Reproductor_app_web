<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuario</title>
</head>
<body>
    <h2>Crear una cuenta</h2>

    <!-- Mostrar mensaje de error si existe -->
    <?php
    if (isset($_GET['error']) && $_GET['error'] == 1) {
        echo "<p style='color:red;'>El usuario o email ya existe. Intenta con otro.</p>";
    } elseif (isset($_GET['registro']) && $_GET['registro'] == 'ok') {
        echo "<p style='color:green;'>Registro exitoso. Ahora puedes iniciar sesión.</p>";
    }
    ?>

    <form action="routes/controlle_registro.php" method="POST">
        <label for="usuario">Usuario:</label><br>
        <input type="text" id="usuario" name="usuario" required><br><br>

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="password">Contraseña:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <button type="submit" name="bregistrar">Registrarse</button>
    </form>

    <p>¿Ya tienes cuenta? <a href="index.php">Inicia sesión aquí</a></p>
</body>
</html>


