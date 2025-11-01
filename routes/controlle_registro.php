<?php
if (!empty($_POST['bregistrar'])) {
    // Validar campos vacíos
    if (empty($_POST['usuario']) || empty($_POST['email']) || empty($_POST['password']) || empty($_POST['password_confirm'])) {
        echo "Por favor, complete todos los campos.";
    } elseif ($_POST['password'] !== $_POST['password_confirm']) {
        echo "Las contraseñas no coinciden.";
    } else {
        $usuario = $_POST['usuario'];
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Validar que el usuario o email no existan ya
        $stmt = $conexion->prepare("SELECT * FROM usuario WHERE usuario = ? OR email = ?");
        $stmt->bind_param("ss", $usuario, $email);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            echo "El usuario o correo ya están registrados.";
        } else {
            // Hashear la contraseña para seguridad
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            // Insertar nuevo usuario
            $stmt = $conexion->prepare("INSERT INTO usuario (usuario, email, clave) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $usuario, $email, $password_hash);

            if ($stmt->execute()) {
                echo "Registro exitoso. Puedes <a href='index.php'>iniciar sesión</a>.";
            } else {
                echo "Error al registrar usuario.";
            }
        }
    }
}
?>
