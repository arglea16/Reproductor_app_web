<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Conexión a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "bd_playlist");
mysqli_set_charset($conexion, "utf8mb4");

if (!$conexion) {
    die(json_encode(["error" => "Error de conexión: " . mysqli_connect_error()]));
}

if (isset($_GET['q'])) {
    $q = mysqli_real_escape_string($conexion, $_GET['q']);

    // Buscar todas las canciones relacionadas
    $sql = "SELECT * FROM sound WHERE name LIKE '%$q%' OR artista LIKE '%$q%'";
    $result = mysqli_query($conexion, $sql);

    $songs = [];
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            // Rutas relativas a la raíz pública
            $soundFileServer = __DIR__ . '/../media/' . $row['pach_sound'] . '.mp3';
            $jsSoundPath = '/media/' . $row['pach_sound'] . '.mp3';
            $imgFile = !empty($row['pach_img']) ? '/img/' . $row['pach_img'] : null;

            // Solo agregar si el archivo existe en el servidor
            if (file_exists($soundFileServer)) {
                $songs[] = [
                    "id" => $row['id'],
                    "title" => $row['name'],
                    "artist" => $row['artista'],
                    "pach_sound" => $jsSoundPath,
                    "pach_img" => $imgFile
                ];
            }
        }

        if (count($songs) > 0) {
            echo json_encode(["success" => true, "songs" => $songs]);
        } else {
            echo json_encode(["success" => false, "message" => "No hay archivos de sonido disponibles."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No se encontró ninguna canción."]);
    }
} else {
    echo json_encode(["error" => "Parámetro 'q' no recibido."]);
}

mysqli_close($conexion);
?>




