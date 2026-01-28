<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  die("405 Not Allowed");
}

/* ---------- UPLOAD SETUP ---------- */
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

$files = [];

/* ---------- FILE HANDLING ---------- */
if (!empty($_FILES['artwork']['name'][0])) {
  foreach ($_FILES['artwork']['tmp_name'] as $i => $tmp) {

    if ($_FILES['artwork']['error'][$i] === UPLOAD_ERR_OK) {

      $name = uniqid() . '_' . basename($_FILES['artwork']['name'][$i]);
      $target = $uploadDir . $name;

      if (move_uploaded_file($tmp, $target)) {
        $files[] = 'uploads/' . $name;
      }
    }
  }
}

/* ---------- COLLECT FORM DATA ---------- */
$data = [
  'department' => $_POST['department'] ?? '',
  'requestor'  => ucwords($_POST['requestor'] ?? ''),
  'importance' => $_POST['importance'] ?? '',
  'project'    => $_POST['project'] ?? '',
  'category'   => $_POST['category'] ?? '',
  'details'    => $_POST['details'] ?? [],
  'files'      => $files
];

/* ---------- SAVE FOR REVIEW ---------- */
$_SESSION['rfq'] = $data;

/* ---------- EMAIL ---------- */
$body  = "<h2>New RFQ Submitted</h2>";
$body .= "<p><b>Department:</b> {$data['department']}</p>";
$body .= "<p><b>Requestor:</b> {$data['requestor']}</p>";
$body .= "<p><b>Importance:</b> {$data['importance']}</p>";
$body .= "<p><b>Category:</b> {$data['category']}</p>";
$body .= "<h3>Details</h3><ul>";

foreach ($data['details'] as $k => $v) {
  $body .= "<li><b>" . ucwords(str_replace('_',' ',$k)) . ":</b> $v</li>";
}

$body .= "</ul>";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: rfq@company.com\r\n";

mail(
  "neng.huang@lns.maersk.com",
  "New RFQ Submission",
  $body,
  $headers
);

/* ---------- REDIRECT ---------- */
header("Location: review.php");
exit;
