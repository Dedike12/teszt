
<?php
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Csak POST kérés engedélyezett."]);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data)) {
    echo json_encode(["success" => false, "error" => "Hibás adatformátum."]);
    exit;
}

if (file_put_contents("requests.json", json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Nem sikerült menteni a fájlt."]);
}
?>
