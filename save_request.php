
<?php
header("Content-Type: application/json");
$filename = "requests.json";
$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input["title"]) || !isset($input["type"])) {
    echo json_encode(["success" => false, "error" => "Hiányzó adatok."]);
    exit;
}
$existingData = [];
if (file_exists($filename)) {
    $json = file_get_contents($filename);
    $existingData = json_decode($json, true);
    if (!is_array($existingData)) $existingData = [];
}
$existingData[] = [
    "title" => htmlspecialchars($input["title"]),
    "type" => htmlspecialchars($input["type"]),
    "message" => htmlspecialchars($input["message"] ?? ""),
    "date" => htmlspecialchars($input["date"] ?? date("Y-m-d H:i")),
    "status" => "Feldolgozás alatt"
];
if (file_put_contents($filename, json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Mentési hiba."]);
}
?>
