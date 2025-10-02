<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Maersk Procurement Portal</title>
  <link rel="stylesheet" href="css/style.css" />
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="js/main.js" defer></script>
  <script src="js/dashboard.js" defer></script>
  <script src="js/rfq.js" defer></script>
  <script src="js/vendors.js" defer></script>
  <script src="js/po.js" defer></script>
  <script src="js/contracts.js" defer></script>
  <script src="js/policies.js" defer></script>
</head>
<body>
  <header>

    <nav class="nav">
      <div class="nav-left">
        <!-- Updated to your provided logo file -->
        <img class="logo" src="images/Maersklogo01.png" alt="Maersk Logo" />
        <span class="brand">MCL SG</span>
      </div>

      <div id="nav-links" class="nav-links">
        <span id="user-label" class="user-label"></span>
        <a href="#" id="nav-dashboard" class="nav-link">Dashboard</a>
        <a href="#" id="nav-rfq" class="nav-link">RFQs</a>
        <a href="#" id="nav-po" class="nav-link">POs</a>
        <a href="#" id="nav-contracts" class="nav-link">Contracts</a>
        <a href="#" id="nav-policies" class="nav-link">Policies</a>
        <a href="#" id="nav-staff" class="nav-link" style="display:none">Procurement Tools</a>
        <a href="#" id="nav-login" class="nav-link">Login</a>
        <a href="#" id="nav-logout" class="nav-link" style="display:none">Logout (<span id="user-label-logout"></span>)</a>
      </div>
    </nav>
    <div id="header-search" class="header-search" style="text-align:center; padding:1rem 0;">
      <input type="text" id="global-search-bar" placeholder="Search RFQs, POs, Vendors, Invoices…" style="width:40%; padding:0.5rem; border-radius:5px; border:1px solid #ccc;" aria-label="Search procurement records" />
      <select id="global-search-scope" style="padding:0.5rem; border-radius:5px; border:1px solid #ccc; margin-left:0.5rem;" aria-label="Filter search by record type">
        <option value="">All</option>
        <option value="rfq">RFQs</option>
        <option value="vendor">Vendors</option>
        <option value="po">Purchase Orders</option>
        <option value="grn">Goods Receipts</option>
        <option value="invoice">Invoices</option>
        <option value="contract">Contracts</option>
      </select>
      <button id="global-search-btn" onclick="window.searchPortal && window.searchPortal()" style="padding:0.5rem 1rem; margin-left:0.5rem;">Search</button>
    </div>
  </header>

<main>
  <!-- ===================== RFQs Page ===================== -->
  <section id="page-rfq" class="page" aria-labelledby="rfq-page-title" style="display:none">
    <div class="page-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
      <h2 id="rfq-page-title" style="margin:0;color:var(--deep-blue);">RFQs</h2>
      <div class="rfq-actions" style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <a href="#rfq-form" id="rfq-submit-link" class="nav-link" style="padding:0.4rem 0.8rem;border-radius:20px;background:var(--maersk-blue);color:#fff;text-decoration:none;">Submit RFQ</a>
      </div>
    </div>

    <!-- ===== Requestor / User Submission Form ===== -->
    <div id="rfq-form" class="card highlight" style="padding:1rem;border-radius:8px;">
      <form id="rfq-input-form" class="rfq-grid">
        <h3 class="span-12" style="margin:0;color:var(--deep-blue);">Requestor Information</h3>

        <label class="field span-4">Name of Department* <small>(e.g., PR)</small>
          <input name="dept" required placeholder="PR" />
        </label>

        <label class="field span-4">Requestor Name* <small>(Title Case)</small>
          <input name="requestor" required placeholder="John Doe Smith" />
        </label>

        <label class="field span-4">Importance
          <select name="importance">
            <option>Urgent</option><option>Moderate</option><option>Low Urgency</option>
          </select>
        </label>

        <label class="field span-12">(Project) Supply &amp; Delivery of
          <input name="project" placeholder="Item / service name & description" />
        </label>

        <div class="span-12" style="display:flex;align-items:center;gap:0.5rem;">
          <input id="rfq-remember" type="checkbox" />
          <label for="rfq-remember" style="margin:0;">Enable cookies for future submissions</label>
        </div>

        <h3 class="span-12" style="margin:0.5rem 0;color:var(--deep-blue);">RFQ Category</h3>

        <label class="field span-4">Category
          <select name="category" id="rfq-category">
            <option value="Consumable" selected>Consumable</option>
          </select>
        </label>

        <label class="field span-8">Consumable Type
          <select name="consumableType" id="rfq-consumable-type">
            <option>Carton Boxes</option>
            <option>Labels</option>
            <option>Tapes</option>
            <option>Packing Fills</option>
            <option>Printing Consumables</option>
            <option>PE/Courier Bags</option>
            <option>Pallets</option>
            <option>Stretch Films</option>
            <option>Paper Mailers</option>
          </select>
        </label>

        <!-- ===== Dynamic Sections (shown/hidden by js/rfq.js) ===== -->

        <!-- Carton Boxes -->
        <fieldset class="rfq-section span-12" data-type="Carton Boxes">
          <legend>Carton Boxes</legend>

          <label class="field span-6">Box Style
            <select name="cb_style">
              <option>RSC</option><option>HSC</option><option>OSC</option><option>FOL</option>
              <option>CSSC</option><option>CSO</option><option>SFF</option>
              <option>Bellows Style Top and Bottom Container</option>
              <option>Integral Divider Container</option>
              <option>FTD</option><option>DSC</option><option>DC</option>
              <option>Octagonal Double Cover Container</option>
              <option>OPF</option><option>One Piece Folder With Air Cell</option>
              <option>FPF</option><option>Wrap - Around Blank</option>
              <option>One Piece Folder With Dust and Truck Flaps</option>
              <option>Roll End Tray</option><option>Display Tray Or High Wall Tray</option>
            </select>
          </label>

          <label class="field span-6">Cardboard Style
            <select name="cb_cardboard">
              <option>Singleface</option><option>Single Wall (SW)</option>
              <option>Double Wall (DW)</option><option>Triple Wall (TW)</option>
            </select>
          </label>

          <div class="span-12" style="display:flex;gap:1rem;align-items:center;">
            <label class="field">Dimension Provided (EX/IN)
              <select name="cb_dim_provided">
                <option>External</option><option>Internal</option>
              </select>
            </label>
            <label class="field" style="flex:1;">Dimensions (L × B × H) in mm
              <input name="cb_dimensions" placeholder="e.g., 100 × 50 × 30" />
            </label>
            <label class="field">Ordering Quantity*
              <input type="number" name="cb_qty" min="1" required />
            </label>
          </div>

          <label class="field span-6">Material*
            <select name="cb_material" required>
              <option>Paperboard</option><option>Duplex</option><option>White Kraft</option>
              <option>Recycled</option><option>Others (type below)</option>
            </select>
          </label>
          <label class="field span-6">If Others, specify
            <input name="cb_material_other" placeholder="Material details" />
          </label>

          <div class="span-12" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <label class="field">Artwork (max 2 files, 5MB ea)
              <input type="file" name="cb_files" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" multiple />
            </label>
            <div class="field">
              <label>Other Questions</label>
              <div class="span-12" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;">
                <label>Weight Capacity
                  <select name="cb_weight">
                    <option>4–7kg</option><option>7–12kg</option><option>12–17kg</option>
                    <option>17–25kg</option><option>25–35kg</option><option>35–40kg</option><option>40–45kg</option>
                  </select>
                </label>
                <label>Stacking of Cartons?
                  <select name="cb_stack_cartons"><option>Yes</option><option>No</option></select>
                </label>
                <label>Stacking of Pallets on Cartons?
                  <select name="cb_stack_pallets"><option>Yes</option><option>No</option></select>
                </label>
                <label class="span-3">Divider required?
                  <select name="cb_divider"><option>Yes</option><option>No</option></select>
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Labels -->
        <fieldset class="rfq-section span-12" data-type="Labels" hidden>
          <legend>Labels</legend>

          <label class="field span-6">Label Type
            <select name="lb_type">
              <option>Paper Labels</option><option>Vinyl Labels (PVC)</option>
              <option>Polyester Labels</option><option>Polypropylene Labels</option>
              <option>Thermal Labels</option><option>Fabric Labels</option>
              <option>Metalized Labels</option><option>Removable Labels</option>
              <option>Fluorescent Labels</option><option>Kraft Labels</option>
              <option>Clear Labels</option><option>BOPP Labels</option>
              <option>Matte Roll Labels</option><option>Silver Foil Labels</option>
              <option>Others (type below)</option>
            </select>
          </label>
          <label class="field span-6">If Others, specify
            <input name="lb_type_other" placeholder="Label type details" />
          </label>

          <label class="field span-6">Layout
            <select name="lb_layout">
              <option>Sheet Form</option><option>Roll Form</option><option>Others</option>
            </select>
          </label>
          <label class="field span-6">Gap Between Labels (mm)
            <input type="number" name="lb_gap" min="0" step="1" />
          </label>

          <div class="span-12" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <label class="field">Dimensions (L × W) mm
              <input name="lb_dim" placeholder="e.g., 50 × 30" />
            </label>
            <label class="field">Colours Required
              <input name="lb_colour" placeholder="e.g., CMYK / Pantone" />
            </label>
            <label class="field">Order Quantity
              <input type="number" name="lb_qty" min="1" />
            </label>
          </div>

          <div class="span-12" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            <label class="field">Adhesive Type
              <select name="lb_adhesive">
                <option>Permanent</option><option>Removable</option><option>Repositionable</option><option>Other</option>
              </select>
            </label>
            <label class="field">If Other, specify
              <input name="lb_adhesive_other" placeholder="Adhesive details" />
            </label>
            <label class="field">Label Finish
              <input name="lb_finish" placeholder="UV, Varnish, Laminate, Soft Touch, …" />
            </label>
          </div>

          <label class="field span-6">Artwork (max 1 file, 10MB)
            <input type="file" name="lb_file" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" />
          </label>

          <label class="field span-6">Durability / Environment
            <input name="lb_env" placeholder="Water/Chemical/UV/Temperature, etc." />
          </label>
        </fieldset>

        <!-- Tapes -->
        <fieldset class="rfq-section span-12" data-type="Tapes" hidden>
          <legend>Tapes</legend>
          <label class="field span-6">Type
            <select name="tp_type">
              <option>Packaging Tape</option><option>Duct Tape</option><option>Masking Tape</option>
              <option>Double-sided Tape</option><option>Customized Tapes</option><option>Others</option>
            </select>
          </label>
          <label class="field span-6">If Others, specify
            <input name="tp_type_other" placeholder="Type details" />
          </label>
          <label class="field span-6">Width × Length
            <input name="tp_dim" placeholder="e.g., 50mm × 66m" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="tp_qty" min="1" />
          </label>
          <label class="field span-12">Artwork (if customized)
            <input type="file" name="tp_art" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" />
          </label>
        </fieldset>

        <!-- Packing Fills -->
        <fieldset class="rfq-section span-12" data-type="Packing Fills" hidden>
          <legend>Packing Fills</legend>
          <label class="field span-6">Type Of Packaging Fill
            <select name="pf_type">
              <option>Foam</option><option>Bubble Wrap</option><option>Paper</option><option>Air Pillow</option><option>Others</option>
            </select>
          </label>
          <label class="field span-6">If Others, specify
            <input name="pf_type_other" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="pf_qty" min="1" />
          </label>
          <label class="field span-6">Other specific requirements
            <input name="pf_req" />
          </label>
        </fieldset>

        <!-- Printing Consumables -->
        <fieldset class="rfq-section span-12" data-type="Printing Consumables" hidden>
          <legend>Printing Consumables</legend>
          <label class="field span-6">Type
            <select name="pc_type">
              <option>Ink Cartridges</option><option>Toner Types</option><option>Others</option>
            </select>
          </label>
          <label class="field span-6">Model / Details
            <input name="pc_model" placeholder="Model of ink/toner or details" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="pc_qty" min="1" />
          </label>
        </fieldset>

        <!-- PE / Courier Bags -->
        <fieldset class="rfq-section span-12" data-type="PE/Courier Bags" hidden>
          <legend>PE / Courier Bags</legend>
          <label class="field span-6">Type of Bag
            <select name="pe_type"><option>Standard PE Bags</option><option>Courier Bags</option><option>Others</option></select>
          </label>
          <label class="field span-6">If Others, specify
            <input name="pe_type_other" />
          </label>
          <label class="field span-6">Material
            <select name="pe_material">
              <option>LDPE</option><option>HDPE</option><option>Mixed Material</option><option>Other</option>
            </select>
          </label>
          <label class="field span-6">If Other, specify
            <input name="pe_material_other" />
          </label>
          <label class="field span-6">Dimensions (L × W) mm
            <input name="pe_dim" />
          </label>
          <label class="field span-6">Thickness (µm)
            <input type="number" name="pe_micron" min="0" />
          </label>
          <label class="field span-6">Closure Type
            <select name="pe_close"><option>Self-Sealing</option><option>Reinforced Seal</option><option>Other</option></select>
          </label>
          <label class="field span-6">If Other, specify
            <input name="pe_close_other" />
          </label>
          <label class="field span-6">Artwork (max 1 file, 10MB)
            <input type="file" name="pe_art" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="pe_qty" min="1" />
          </label>
        </fieldset>

        <!-- Pallets -->
        <fieldset class="rfq-section span-12" data-type="Pallets" hidden>
          <legend>Pallets</legend>
          <label class="field span-6">Pallet Type
            <select name="pl_type"><option>Wooden Pallets</option><option>Plastic Pallets</option><option>Metal Pallets</option><option>Others</option></select>
          </label>
          <label class="field span-6">Treatment
            <input name="pl_treat" placeholder="HT, Fumigation, Coating, Sanitization, Anti-slip, etc." />
          </label>
          <label class="field span-6">Dimensions (L × W × H) mm
            <input name="pl_dim" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="pl_qty" min="1" />
          </label>
        </fieldset>

        <!-- Stretch Films -->
        <fieldset class="rfq-section span-12" data-type="Stretch Films" hidden>
          <legend>Stretch Films</legend>
          <label class="field span-6">Type
            <select name="sf_type"><option>Hand Stretch Film</option><option>Machine Stretch Film</option><option>Specialty Films</option><option>Others</option></select>
          </label>
          <label class="field span-6">Material
            <select name="sf_material"><option>LLDPE</option><option>Blown</option><option>Cast</option><option>Other</option></select>
          </label>
          <label class="field span-6">Dimensions (W cm × L m)
            <input name="sf_dim" />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="sf_qty" min="1" />
          </label>
        </fieldset>

        <!-- Paper Mailers -->
        <fieldset class="rfq-section span-12" data-type="Paper Mailers" hidden>
          <legend>Paper Mailers</legend>
          <label class="field span-4">Type
            <select name="pm_type"><option>Standard Paper Mailers</option><option>Padded Paper Mailers</option><option>Rigid Paper Mailers</option><option>Other</option></select>
          </label>
          <label class="field span-4">Dimensions (L × W) cm
            <input name="pm_dim" />
          </label>
          <label class="field span-4">Flap Style
            <select name="pm_flap"><option>Self-Sealing</option><option>Gummed</option><option>Requires Additional Adhesive</option><option>Other</option></select>
          </label>
          <label class="field span-6">Material
            <select name="pm_material"><option>Kraft Paper</option><option>Recycled Content</option><option>Other</option></select>
          </label>
          <label class="field span-6">Colour
            <input name="pm_colour" placeholder="Colour(s)" />
          </label>
          <label class="field span-6">Artwork (max 2 files, 10MB ea)
            <input type="file" name="pm_art" accept=".pdf,.png,.jpg,.jpeg,.ai,.psd" multiple />
          </label>
          <label class="field span-6">Ordering Quantity
            <input type="number" name="pm_qty" min="1" />
          </label>
        </fieldset>

        <div class="form-actions span-12" style="display:flex;gap:8px;justify-content:flex-end;">
          <button id="rfq-form-reset" type="reset">Reset</button>
          <button id="rfq-form-submit" type="submit" class="cta">Submit RFQ</button>
        </div>
      </form>
    </div>

    <!-- ===== RFQ Information Received Table ===== -->
    <div class="table-wrap rows-12" style="margin-top:1rem;">
      <!-- Filters -->
      <div style="padding:0.6rem;display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
        <input id="rfq-search" type="search" placeholder="Search Request No / Description / Requestor…" style="padding:0.4rem 0.6rem;border:1px solid var(--muted-border);border-radius:6px;min-width:260px;" />
        <select id="rfq-filter-status" style="padding:0.4rem 0.6rem;border:1px solid var(--muted-border);border-radius:6px;">
          <option value="">All Status</option>
          <option>New</option><option>RFQ Sent</option><option>Quoting</option><option>CCT Issued</option><option>Closed</option>
        </select>
        <label>From <input id="rfq-date-from" type="date" /></label>
        <label>To <input id="rfq-date-to" type="date" /></label>
        <button id="rfq-reset-filters">Reset</button>
      </div>

      <table id="rfq-table" style="width:100%;border-collapse:separate;border-spacing:0;min-width:1200px;">
        <thead style="background:var(--soft-blue-50);">
          <tr>
            <th style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--muted-border);">NO</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">REQUESTED DATE</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">Request No</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">Description</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">REQUEST TYPE</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">REQUESTOR</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">BUYER</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">STATUS</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">RFQ SENT DATE</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">CCT SENT DATE</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">PROGRESS</th>
            <th style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--muted-border);white-space:nowrap;">Actions</th>
          </tr>
        </thead>
        <tbody id="rfq-tbody"></tbody>
      </table>
    </div>
  </section>
  <!-- =================== End RFQs Page =================== -->
</main>


<main>
  <!-- ===================== PO & PR Lines Page ===================== -->
  <section id="page-po" class="page" aria-labelledby="po-page-title" style="display:none">
    <div class="page-head" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
      <h2 id="po-page-title" style="margin:0;color:var(--deep-blue);">PO & PR Lines</h2>
      <div class="po-actions" role="group" aria-label="PO actions" style="display:flex;gap:0.5rem;flex-wrap:wrap;">
	<button id="po-import">Import CSV</button>
	<input id="po-import-input" type="file" accept=".csv" style="display:none" />
        <button id="po-export">Export CSV</button>
        <button id="po-clear" class="delete-order-btn" title="Remove all lines">Clear All</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="po-filters" style="margin:1rem 0;display:grid;grid-template-columns:2fr 1fr auto;gap:0.75rem;">
      <input id="po-search" type="search" placeholder="Search PR / PO / Description…" aria-label="Search POs/PRs" />
      <select id="po-filter-vendor" aria-label="Filter by Vendor/Supplier">
        <option value="">All Vendors/Suppliers</option>
      </select>
      <button id="po-reset-filters" type="button">Reset</button>
    </div>

<!-- Input Form -->
<div class="card highlight">
  <form id="po-input-form" class="po-grid">
    <!-- Row 1 -->
    <label class="field span-3">PR
      <input name="pr" placeholder="e.g., PR2025-0012" required />
    </label>
    <label class="field span-3">PO
      <input name="po" placeholder="e.g., PO2025-1234" required />
    </label>
    <label class="field span-3">PO RAISED BY
      <input name="poRaisedBy" placeholder="e.g., NJ Huang" required />
    </label>
    <label class="field span-3">REF.NO
      <input name="refNo" placeholder="e.g., RFQ-7788" required />
    </label>

    <!-- Row 2 -->
    <label class="field span-12">DESCRIPTION
      <input name="description" placeholder="Item / service description…" required />
    </label>

    <!-- Row 3 -->
    <label class="field span-4">DELIVERY LOCATION
      <input name="deliveryLocation" placeholder="e.g., Jurong Warehouse" required />
    </label>
    <label class="field span-4">PR REQUESTOR
      <input name="prRequestor" placeholder="e.g., Alex Tan" required />
    </label>
    <label class="field span-4">ATT.TO
      <input name="attTo" placeholder="e.g., Warehouse Team" required />
    </label>

    <!-- Row 4 -->
    <label class="field span-6">VENDOR/SUPPLIER
      <input name="vendor" placeholder="e.g., Martor" required />
    </label>
    <div class="form-actions span-6">
      <button id="po-form-reset" type="reset">Reset</button>
      <button id="po-form-submit" type="submit" class="cta">Add Line</button>
    </div>
  </form>

  <!-- Live Auto-Generated Preview -->
  <div class="po-preview">
    <div><strong>Note to Supplier:</strong> <span id="preview-note">Your Reference: —</span></div>
    <div><strong>Email Subject:</strong> <span id="preview-subject">PR – — / PO – — – — – —</span></div>
  </div>
</div>

    <!-- Table -->
    <div class="table-wrap rows-12" style="margin-top:1rem;">
      <table id="po-lines-table" style="width:100%;border-collapse:separate;border-spacing:0;min-width:1200px;">
        <thead style="background:var(--soft-blue-50);position:sticky;top:0;">
          <tr>
            <th class="sent" style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--muted-border);">CHECKED BOX</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">PR</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">PO</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">PO RAISED BY</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">DESCRIPTION</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">REF.NO</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">DELIVERY LOCATION</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">PR REQUESTOR</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">ATT.TO</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">VENDOR/SUPPLIER</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">Note to Supplier</th>
            <th style="text-align:left;padding:0.6rem;border-bottom:1px solid var(--muted-border);">Email Subject</th>
            <th style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--muted-border);white-space:nowrap;">Actions</th>
          </tr>
        </thead>
        <tbody id="po-lines-body"></tbody>
      </table>
    </div>

    <div id="po-summary" style="margin-top:0.75rem;color:var(--deep-blue);font-size:0.95rem;">
      Showing <span id="po-line-count">0</span> line(s)
    </div>
  </section>
  <!-- =================== End PO & PR Lines Page =================== -->
</main>


  <!-- Rest of the file stays unchanged -->
</body>
</html>
