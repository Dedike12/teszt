
<?php
header("Content-Type: application/json; charset=utf-8");
$filename = "requests.json";
if (!file_exists($filename)) {
    echo json_encode([]);
    exit;
}
$json = file_get_contents($filename);
$data = json_decode($json, true);
if (!is_array($data)) {
    echo json_encode([]);
    exit;
}
$data = array_reverse($data);
echo json_encode($data, JSON_UNESCAPED_UNICODE);
?>
