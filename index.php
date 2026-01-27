<?php
// Remember department & requestor
$dept = $_COOKIE['dept'] ?? '';
$requestor = $_COOKIE['requestor'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Submit RFQ</title>
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="assets/js/form.js" defer></script>
</head>
<body>
<form action="submit.php" method="POST" enctype="multipart/form-data">

<h2>Requestor Information</h2>
<label>Department*</label>
<input name="department" required value="<?= htmlspecialchars($dept) ?>">

<label>Requestor Name*</label>
<input name="requestor" required value="<?= htmlspecialchars($requestor) ?>">

<label>Importance</label>
<select name="importance">
  <option>Urgent</option>
  <option>Moderate</option>
  <option>Low</option>
</select>

<label>Project / Supply Description</label>
<textarea name="project"></textarea>

<label>RFQ Category</label>
<select name="category" id="category" onchange="loadCategoryForm()">
  <option value="">Select</option>
  <option value="carton">Carton Boxes</option>
  <option value="labels">Labels</option>
  <option value="tapes">Tapes</option>
  <option value="pebags">PE / Courier Bags</option>
  <option value="others">Others</option>
</select>

<div id="dynamic-form"></div>

<label>
  <input type="checkbox" name="remember"> Remember my details
</label>

<button type="submit">Submit RFQ</button>
</form>
</body>
</html>
