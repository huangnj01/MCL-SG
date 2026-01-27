<?php
session_start();
$data = $_SESSION['rfq'] ?? null;

if (!$data) {
  die("No RFQ data found.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RFQ Submitted Successfully</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="print.css">

<style>
  body {
    font-family: Arial, sans-serif;
    background: #f5f7fa;
    margin: 0;
    padding: 20px;
  }

  .container {
    max-width: 900px;
    margin: auto;
    background: #fff;
    padding: 30px;
    border-radius: 6px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }

  .success {
    text-align: center;
    border-bottom: 2px solid #003b5c;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }

  .success-icon {
    font-size: 60px;
    color: #28a745;
  }

  h1 {
    color: #003b5c;
    margin: 10px 0;
  }

  h2 {
    color: #003b5c;
    margin-top: 30px;
  }

  section {
    margin-bottom: 25px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }

  .thumb {
    width: 180px;
    height: 180px;
    object-fit: contain;
    border: 1px solid #000;
    margin: 5px;
  }

  .actions {
    margin-top: 30px;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 12px 18px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
  }

  .btn-primary {
    background: #003b5c;
    color: #fff;
  }

  .btn-secondary {
    background: #6c757d;
    color: #fff;
  }

  .btn-print {
    background: #198754;
    color: #fff;
  }

  @media print {
    body {
      background: #fff;
    }
    .actions {
      display: none;
    }
    .container {
      box-shadow: none;
      padding: 0;
    }
  }
</style>
</head>

<body>

<div class="container">

  <!-- ✅ SUCCESS MESSAGE -->
  <div class="success">
    <div class="success-icon">✔</div>
    <h1>RFQ Submitted Successfully</h1>
    <p>Your Request for Quotation has been sent to the Procurement team.</p>
    <p>Please review the details below before printing or saving as PDF.</p>
  </div>

  <!-- 📌 REQUESTOR INFO -->
  <section>
    <h2>Requestor Information</h2>
    <p><strong>Department:</strong> <?= htmlspecialchars($data['department']) ?></p>
    <p><strong>Requestor:</strong> <?= htmlspecialchars($data['requestor']) ?></p>
    <p><strong>Importance:</strong> <?= htmlspecialchars($data['importance']) ?></p>
    <p><strong>Project / Description:</strong><br>
      <?= nl2br(htmlspecialchars($data['project'])) ?>
    </p>
  </section>

  <!-- 📦 RFQ DETAILS -->
  <section>
    <h2>RFQ Category: <?= htmlspecialchars($data['category']) ?></h2>
    <table>
      <?php foreach ($data['details'] as $k => $v): ?>
        <tr>
          <th><?= htmlspecialchars(ucwords(str_replace('_',' ',$k))) ?></th>
          <td><?= htmlspecialchars($v) ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  </section>

  <!-- 🖼 ATTACHMENTS -->
  <section>
    <h2>Attachments</h2>
    <?php if (!empty($data['files'])): ?>
      <?php foreach ($data['files'] as $file): ?>
        <img src="<?= htmlspecialchars($file) ?>" class="thumb">
      <?php endforeach; ?>
    <?php else: ?>
      <p>No attachments submitted.</p>
    <?php endif; ?>
  </section>

  <!-- 🔘 ACTION BUTTONS -->
  <div class="actions">
    <button onclick="window.print()" class="btn btn-print">Print / Save as PDF</button>
    <a href="index.html" class="btn btn-primary">Submit Another RFQ</a>
  </div>

</div>

</body>
</html>
