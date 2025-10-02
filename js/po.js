// js/po.js — PO & PR Lines (v2) with "Checked Box" + vendor filter + search
(function () {
  const STORAGE_KEY = 'mcl_po_pr_lines_v2';

  // Elements
  const el = {
    page: document.getElementById('page-po'),

    // Filters
    search: document.getElementById('po-search'),
    filterVendor: document.getElementById('po-filter-vendor'),
    resetFilters: document.getElementById('po-reset-filters'),

    // Form
    form: document.getElementById('po-input-form'),
    btnSubmit: document.getElementById('po-form-submit'),
    btnReset: document.getElementById('po-form-reset'),

    // Preview
    previewNote: document.getElementById('preview-note'),
    previewSubject: document.getElementById('preview-subject'),

    // Table
    body: document.getElementById('po-lines-body'),
    count: document.getElementById('po-line-count'),

    // Utility actions
    exportBtn: document.getElementById('po-export'),
    clearBtn: document.getElementById('po-clear'),
    importBtn:  document.getElementById('po-import'),
    importInput: document.getElementById('po-import-input'),
  };

  // State
  let lines = load() || seed();
  let filters = { q: '', vendor: '' };

  // Wire up buttons
  el.importBtn?.addEventListener('click', () => el.importInput?.click());
  el.importInput?.addEventListener('change', handleImportFile);


  // ------- Storage
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }

  // ------- Seed data (remove if not needed)
  function seed() {
    const s = [
      {
        id: uid(),
        pr: 'PR2025-0012',
        po: 'PO2025-1026R.1',
        poRaisedBy: 'NJ Huang',
        description: 'Trolley rental (40 units, weekly)',
        refNo: 'RFQ-TR40-2025',
        deliveryLocation: 'Jurong Warehouse',
        prRequestor: 'Le Creuset Ops',
        attTo: 'Warehouse Team',
        vendor: 'Le Creuset Vendor',
        sent: true
      },
      {
        id: uid(),
        pr: 'PR2025-0098',
        po: 'PO2025-0954',
        poRaisedBy: 'Procurement',
        description: 'SECUNORM 175 safety cutters (50 pcs)',
        refNo: 'RFQ-SC175-50',
        deliveryLocation: 'Tuas DC',
        prRequestor: 'Safety Committee',
        attTo: 'Ops Supervisor',
        vendor: 'Martor',
        sent: false
      },
      {
        id: uid(),
        pr: 'PR2025-0105',
        po: 'PO2025-0105',
        poRaisedBy: 'Admin',
        description: 'Water dispenser maintenance (8 units, 1Y)',
        refNo: 'ALF-MNT-8',
        deliveryLocation: 'HQ Office',
        prRequestor: 'Admin',
        attTo: 'Facilities',
        vendor: 'Alfrex',
        sent: false
      },
    ];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
    return s;
  }

  // ------- Utilities
  function uid() { return 'id-' + Math.random().toString(36).slice(2, 10); }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function buildNote(refNo) {
    const r = (refNo || '').trim();
    return r ? `Your Reference: ${r}` : 'Your Reference: —';
  }
  function buildSubject(pr, po, desc, loc) {
    const parts = [];
    if ((pr || '').trim()) parts.push(`PR – ${pr.trim()}`);
    if ((po || '').trim()) parts.push(`PO – ${po.trim()}`);
    let s = parts.join(' / ');
    if ((desc || '').trim()) s += (s ? ' – ' : '') + desc.trim();
    if ((loc || '').trim())  s += (s ? ' – ' : '') + loc.trim();
    return s || 'PR – — / PO – — – — – —';
  }

  // ------- Rendering
  function render() {
    const list = applyFilters(lines, filters);
    el.body.innerHTML = list.map(rowHtml).join('');
    el.count.textContent = list.length;
    wireRowEvents();
    refreshVendorFilterOptions();
  }

  function rowHtml(line) {
    const note = buildNote(line.refNo);
    const subj = buildSubject(line.pr, line.po, line.description, line.deliveryLocation);
    return `
      <tr data-id="${line.id}">
        <td class="sent-cell" style="padding:0.6rem;border-bottom:1px solid var(--muted-border);text-align:center;">
          <input type="checkbox" data-action="toggle-sent" ${line.sent ? 'checked' : ''} aria-label="PO emailed to vendor">
        </td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.pr)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.po)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.poRaisedBy)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.description)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.refNo)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.deliveryLocation)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.prRequestor)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.attTo)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(line.vendor)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(note)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(subj)}</td>
        <td style="padding:0.4rem;text-align:center;border-bottom:1px solid var(--muted-border);white-space:nowrap;">
          <button data-action="delete" class="delete-order-btn">Delete</button>
        </td>
      </tr>
    `;
  }

  function wireRowEvents() {
    // Delete buttons
    el.body.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        const id = tr?.dataset?.id;
        if (!id) return;
        if (!confirm('Delete this line?')) return;
        lines = lines.filter(x => x.id !== id);
        save();
        render();
      });
    });

    // Toggle "sent" checkbox
    el.body.querySelectorAll('input[data-action="toggle-sent"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const tr = chk.closest('tr');
        const id = tr?.dataset?.id;
        const rec = lines.find(x => x.id === id);
        if (!rec) return;
        rec.sent = !!chk.checked;
        save();
      });
    });
  }

  function applyFilters(list, f) {
    let res = list.slice();
    const q = (f.q || '').toLowerCase().trim();
    if (q) {
      res = res.filter(x =>
        (x.pr || '').toLowerCase().includes(q) ||
        (x.po || '').toLowerCase().includes(q) ||
        (x.description || '').toLowerCase().includes(q)
      );
    }
    if (f.vendor) {
      res = res.filter(x => (x.vendor || '') === f.vendor);
    }
    return res;
  }

  function refreshVendorFilterOptions() {
    const current = el.filterVendor.value;
    const vendors = Array.from(new Set(lines.map(x => (x.vendor || '').trim()).filter(Boolean))).sort();
    const opts = ['<option value="">All Vendors/Suppliers</option>', ...vendors.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)].join('');
    if (el.filterVendor.innerHTML !== opts) {
      el.filterVendor.innerHTML = opts;
      if ([...el.filterVendor.options].some(o => o.value === current)) el.filterVendor.value = current;
    }
  }

  // ------- Form handling
  function getFormValues() {
    const fd = new FormData(el.form);
    const get = (k) => (fd.get(k) || '').toString();
    return {
      pr: get('pr'),
      po: get('po'),
      poRaisedBy: get('poRaisedBy'),
      description: get('description'),
      refNo: get('refNo'),
      deliveryLocation: get('deliveryLocation'),
      prRequestor: get('prRequestor'),
      attTo: get('attTo'),
      vendor: get('vendor'),
    };
  }

  function updatePreview() {
    const v = getFormValues();
    el.previewNote.textContent = buildNote(v.refNo);
    el.previewSubject.textContent = buildSubject(v.pr, v.po, v.description, v.deliveryLocation);
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = getFormValues();

    // All required per spec
    const required = ['pr','po','poRaisedBy','description','refNo','deliveryLocation','prRequestor','attTo','vendor'];
    const missing = required.filter(k => !v[k] || !v[k].trim());
    if (missing.length) {
      alert('Please fill all required fields.');
      return;
    }

    const line = { id: uid(), ...v, sent: false };
    lines.unshift(line);
    save();

    el.form.reset();
    updatePreview();
    render();
  }

  // ------- Export CSV
  function exportCSV() {
    const headers = [
      'Checked (Sent?)','PR','PO','PO Raised By','Description','Ref.No','Delivery Location',
      'PR Requestor','Att.To','Vendor/Supplier','Note to Supplier','Email Subject'
    ];
    const list = applyFilters(lines, filters);
    const rows = list.map(x => [
      x.sent ? 'Yes' : 'No',
      x.pr, x.po, x.poRaisedBy, x.description, x.refNo, x.deliveryLocation,
      x.prRequestor, x.attTo, x.vendor,
      buildNote(x.refNo),
      buildSubject(x.pr, x.po, x.description, x.deliveryLocation)
    ]);
    const csv = [headers, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'po_pr_lines.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }
  function csvCell(v) {
    const s = String(v ?? '');
    return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s.replace(/"/g,'""')}"` : s;
  }

// ---------- Import CSV ----------
async function handleImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text(); // UTF-8
    const rows = parseCSV(text);
    if (!rows.length) { alert('CSV is empty.'); return; }

    // Header mapping (normalize to our keys)
    const header = rows[0].map(h => normalize(h));
    const idx = {
      pr: header.indexOf('pr'),
      po: header.indexOf('po'),
      poraisedby: header.indexOf('poraisedby'),
      description: header.indexOf('description'),
      refno: header.indexOf('refno'),
      deliverylocation: header.indexOf('deliverylocation'),
      prrequestor: header.indexOf('prrequestor'),
      atto: header.indexOf('atto'),
      vendor: header.indexOf('vendor') >= 0 ? header.indexOf('vendor') : header.indexOf('vendorsupplier'),
      sent: header.indexOf('sent'), // optional
    };

    // Basic required checks
    const requiredKeys = ['pr','po','poraisedby','description','refno','deliverylocation','prrequestor','atto','vendor'];
    const missing = requiredKeys.filter(k => idx[k] === -1);
    if (missing.length) {
      alert('Missing required column(s): ' + missing.join(', ') +
            '\n\nExpected headers (case-insensitive):\nPR, PO, PO RAISED BY, DESCRIPTION, REF.NO, DELIVERY LOCATION, PR REQUESTOR, ATT.TO, VENDOR/SUPPLIER, [Sent]');
      return;
    }

    let added = 0, updated = 0, skipped = 0;
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      if (!cells || cells.every(c => !String(c||'').trim())) { skipped++; continue; }

      const rec = {
        id: uid(),
        pr: getCell(cells, idx.pr),
        po: getCell(cells, idx.po),
        poRaisedBy: getCell(cells, idx.poraisedby),
        description: getCell(cells, idx.description),
        refNo: getCell(cells, idx.refno),
        deliveryLocation: getCell(cells, idx.deliverylocation),
        prRequestor: getCell(cells, idx.prrequestor),
        attTo: getCell(cells, idx.atto),
        vendor: getCell(cells, idx.vendor),
        sent: idx.sent !== -1 ? toBool(getCell(cells, idx.sent)) : false,
      };

      // Validate required fields for this row
      const hasAll = requiredKeys.every(k => String(rec[keyMap(k)]||'').trim().length);
      if (!hasAll) { skipped++; continue; }

      // De-dup by PR+PO+REF.NO
      const key = (rec.pr+'|'+rec.po+'|'+rec.refNo).toLowerCase();
      const existingIndex = lines.findIndex(x => (x.pr+'|'+x.po+'|'+x.refNo).toLowerCase() === key);

      if (existingIndex >= 0) { lines[existingIndex] = { ...lines[existingIndex], ...rec, id: lines[existingIndex].id }; updated++; }
      else { lines.unshift(rec); added++; }
    }

    save();
    render();
    e.target.value = '';
    alert(`Import complete.\nAdded: ${added}\nUpdated: ${updated}\nSkipped: ${skipped}`);
  } catch (err) {
    console.error(err);
    alert('Could not import this CSV. Please check the format.');
  }
}

// Helpers for import
function normalize(s) { return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
function getCell(arr, i) { return i >= 0 && i < arr.length ? String(arr[i] ?? '').trim() : ''; }
function toBool(v) {
  const s = String(v||'').trim().toLowerCase();
  return ['1','y','yes','true','sent'].includes(s);
}
function keyMap(k) {
  return ({
    pr: 'pr',
    po: 'po',
    poraisedby: 'poRaisedBy',
    description: 'description',
    refno: 'refNo',
    deliverylocation: 'deliveryLocation',
    prrequestor: 'prRequestor',
    atto: 'attTo',
    vendor: 'vendor',
  })[k];
}

// CSV parser with quotes support
function parseCSV(text) {
  // Normalize newlines and strip BOM
  text = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = [];
  let row = [], cell = '', inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i+1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(cell); cell=''; }
      else if (ch === '\n') { row.push(cell); rows.push(row); row=[]; cell=''; }
      else { cell += ch; }
    }
  }
  row.push(cell); rows.push(row);
  // Trim trailing empty last row if present
  if (rows.length && rows[rows.length-1].every(c => String(c||'').trim()==='')) rows.pop();
  return rows;
}

  // ------- Clear All
  function clearAll() {
    if (!confirm('This will remove ALL lines. Continue?')) return;
    lines = [];
    save();
    render();
  }

  // ------- Events
  ['input','change','keyup'].forEach(ev => {
    el.search?.addEventListener(ev, () => { filters.q = el.search.value; render(); });
  });
  el.filterVendor?.addEventListener('change', () => { filters.vendor = el.filterVendor.value; render(); });
  el.resetFilters?.addEventListener('click', () => {
    filters = { q: '', vendor: '' };
    el.search.value = '';
    el.filterVendor.value = '';
    render();
  });

  el.form?.addEventListener('input', updatePreview);
  el.form?.addEventListener('submit', onSubmit);
  el.btnReset?.addEventListener('click', () => setTimeout(updatePreview, 0));

  el.exportBtn?.addEventListener('click', exportCSV);
  el.clearBtn?.addEventListener('click', clearAll);

  // ------- SPA nav hookup (show page when clicking "POs")
  const navPO = document.getElementById('nav-po');
  navPO?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    el.page.style.display = 'block';
    render();
    document.querySelectorAll('#nav-links a').forEach(a => a.classList.remove('active'));
    navPO.classList.add('active');
  });

  // Initial
  updatePreview();
  if (el.page && getComputedStyle(el.page).display !== 'none') render();
})();
