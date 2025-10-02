// js/rfq.js — RFQ Submission + Received List (localStorage)
(function () {
  const STORAGE_KEY = 'mcl_rfq_list_v1';

  // Elements
  const el = {
    page: document.getElementById('page-rfq'),

    // Form
    form: document.getElementById('rfq-input-form'),
    remember: document.getElementById('rfq-remember'),
    cat: document.getElementById('rfq-category'),
    sub: document.getElementById('rfq-consumable-type'),

    // Received filters
    search: document.getElementById('rfq-search'),
    fStatus: document.getElementById('rfq-filter-status'),
    fFrom: document.getElementById('rfq-date-from'),
    fTo: document.getElementById('rfq-date-to'),
    fReset: document.getElementById('rfq-reset-filters'),

    // Table
    tbody: document.getElementById('rfq-tbody'),
  };

  // State
  let rfqs = load();
  let filters = { q: '', status: '', from: '', to: '' };

  // ---------- Storage
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(rfqs)); }

  // ---------- Utils
  const nowISO = () => new Date().toISOString();
  function ymd(d) { const dt = new Date(d); return dt.toISOString().slice(0,10); }
  function uid() { return 'RFQ-' + Date.now().toString(36).toUpperCase().slice(-6); }
  function titleCase(s){ return String(s||'').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }

  // ---------- Dynamic sections
  function updateSections() {
    const type = el.sub.value;
    document.querySelectorAll('#rfq-input-form .rfq-section').forEach(fs => {
      fs.hidden = fs.getAttribute('data-type') !== type;
    });
  }

  // ---------- Remember requestor (cookies/localStorage)
  const PREF_KEY = 'mcl_rfq_pref';
  function loadPrefs() {
    try {
      const p = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      if (!p) return;
      if (p.dept) el.form.dept.value = p.dept;
      if (p.requestor) el.form.requestor.value = p.requestor;
      if (p.importance) el.form.importance.value = p.importance;
      el.remember.checked = !!p.remember;
    } catch {}
  }
  function maybeSavePrefs() {
    if (!el.remember.checked) { localStorage.removeItem(PREF_KEY); return; }
    const pref = {
      remember: true,
      dept: el.form.dept.value.trim(),
      requestor: titleCase(el.form.requestor.value.trim()),
      importance: el.form.importance.value,
    };
    localStorage.setItem(PREF_KEY, JSON.stringify(pref));
  }

  // ---------- Submit
  function onSubmit(e) {
    e.preventDefault();

    // Required basics
    const dept = el.form.dept.value.trim();
    const requestor = titleCase(el.form.requestor.value.trim()); // enforce Title Case
    const importance = el.form.importance.value;
    const project = el.form.project.value.trim();

    if (!dept || !requestor) { alert('Department and Requestor Name are required.'); return; }

    const category = el.cat.value;
    const type = el.sub.value;

    // Collect type-specific values & validate file rules
    const filesOK = validateFiles(type);
    if (!filesOK) return;

    const description = buildDescription(type);
    if (!description) { alert('Please fill the required fields in the selected section.'); return; }

    const rfq = {
      id: uid(),
      createdAt: nowISO(),
      dept, requestor, importance, project,
      category, type,
      description,
      buyer: '',             // editable later
      status: 'New',         // default
      rfqSentDate: '',       // editable later
      cctSentDate: '',       // editable later
    };

    rfqs.unshift(rfq);
    save();
    maybeSavePrefs();
    el.form.reset();
    updateSections(); // collapse sections after reset
    render();
    alert('RFQ submitted.');
  }

  // Build a human-readable description per type (minimal but useful)
  function buildDescription(type) {
    const f = el.form;
    switch (type) {
      case 'Carton Boxes': {
        const qty = f.cb_qty.value;
        const mat = f.cb_material.value;
        if (!qty || !mat) return '';
        const dims = f.cb_dimensions.value || '';
        const style = f.cb_style.value;
        return `Carton Box — ${style}, ${mat}${dims ? ', ' + dims + ' mm' : ''}, Qty ${qty}`;
      }
      case 'Labels': {
        const t = f.lb_type.value;
        const dim = f.lb_dim.value || '';
        const qty = f.lb_qty.value || '';
        return `Labels — ${t}${dim ? ', ' + dim + ' mm' : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Tapes': {
        const t = f.tp_type.value;
        const dim = f.tp_dim.value || '';
        const qty = f.tp_qty.value || '';
        return `Tapes — ${t}${dim ? ', ' + dim : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Packing Fills': {
        const t = f.pf_type.value;
        const qty = f.pf_qty.value || '';
        return `Packing Fills — ${t}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Printing Consumables': {
        const t = f.pc_type.value;
        const m = f.pc_model.value || '';
        const qty = f.pc_qty.value || '';
        return `Printing Consumables — ${t}${m ? ', ' + m : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'PE/Courier Bags': {
        const t = f.pe_type.value;
        const dim = f.pe_dim.value || '';
        const micron = f.pe_micron.value || '';
        const qty = f.pe_qty.value || '';
        return `PE/Courier Bags — ${t}${dim ? ', ' + dim + ' mm' : ''}${micron ? ', ' + micron + 'µm' : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Pallets': {
        const t = f.pl_type.value;
        const dim = f.pl_dim.value || '';
        const qty = f.pl_qty.value || '';
        return `Pallets — ${t}${dim ? ', ' + dim + ' mm' : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Stretch Films': {
        const t = f.sf_type.value;
        const dim = f.sf_dim.value || '';
        const qty = f.sf_qty.value || '';
        return `Stretch Films — ${t}${dim ? ', ' + dim : ''}${qty ? ', Qty ' + qty : ''}`;
      }
      case 'Paper Mailers': {
        const t = f.pm_type.value;
        const dim = f.pm_dim.value || '';
        const qty = f.pm_qty.value || '';
        return `Paper Mailers — ${t}${dim ? ', ' + dim + ' cm' : ''}${qty ? ', Qty ' + qty : ''}`;
      }
    }
    return '';
  }

  // File validations per type
  function validateFiles(type) {
    const f = el.form;
    const err = (m) => { alert(m); return false; };
    const within = (files, maxCount, maxMB) => {
      if (!files) return true;
      const fa = files instanceof FileList ? Array.from(files) : [];
      if (fa.length > maxCount) return err(`Please upload up to ${maxCount} file(s).`);
      for (const file of fa) {
        if (file.size > maxMB * 1024 * 1024) return err(`File "${file.name}" exceeds ${maxMB}MB.`);
      }
      return true;
    };

    switch (type) {
      case 'Carton Boxes':    return within(f.cb_files.files, 2, 5);
      case 'Labels':          return within(f.lb_file.files, 1, 10);
      case 'Tapes':           return within(f.tp_art.files, 1, 10);
      case 'PE/Courier Bags': return within(f.pe_art.files, 1, 10);
      case 'Paper Mailers':   return within(f.pm_art.files, 2, 10);
      default: return true;
    }
  }

  // ---------- Received list (render + filters)
  function progress(status) {
    return ({'New':10,'RFQ Sent':30,'Quoting':50,'CCT Issued':80,'Closed':100})[status] || 0;
  }

  function render() {
    const list = applyFilters(rfqs, filters);
    el.tbody.innerHTML = list.map((rfq, idx) => rowHtml(rfq, idx, list.length)).join('');
    wireRowEvents();
  }

  function applyFilters(list, f) {
    let res = list.slice();
    const q = (f.q || '').toLowerCase().trim();
    if (q) {
      res = res.filter(x =>
        (x.id || '').toLowerCase().includes(q) ||
        (x.description || '').toLowerCase().includes(q) ||
        (x.requestor || '').toLowerCase().includes(q)
      );
    }
    if (f.status) res = res.filter(x => x.status === f.status);
    if (f.from) res = res.filter(x => ymd(x.createdAt) >= f.from);
    if (f.to) res = res.filter(x => ymd(x.createdAt) <= f.to);
    return res;
  }

  function rowHtml(r, _i, total) {
    const pct = progress(r.status);
    const reqDate = ymd(r.createdAt);
    return `
      <tr data-id="${r.id}">
        <td style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--muted-border);">${total - _i}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${reqDate}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${r.id}</td>
        <td class="col-desc" style="padding:0.6rem;border-bottom:1px solid var(--muted-border);max-width:520px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.description || r.project || '')}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.type || r.category)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.requestor)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.buyer || '')}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.status)}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.rfqSentDate || '')}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);">${escapeHtml(r.cctSentDate || '')}</td>
        <td style="padding:0.6rem;border-bottom:1px solid var(--muted-border);min-width:160px;">
          <div style="height:10px;background:#e9eef3;border-radius:6px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:var(--maersk-blue);"></div>
          </div>
        </td>
        <td style="text-align:center;padding:0.4rem;border-bottom:1px solid var(--muted-border);white-space:nowrap;">
          <button data-action="edit">Edit</button>
          <button data-action="delete" class="delete-order-btn">Delete</button>
        </td>
      </tr>
    `;
  }

  function escapeHtml(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function wireRowEvents() {
    el.tbody.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr'); const id = tr?.dataset?.id;
        if (!id) return;
        if (!confirm('Delete this RFQ?')) return;
        rfqs = rfqs.filter(x => x.id !== id);
        save(); render();
      });
    });
    el.tbody.querySelectorAll('button[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => openEdit(btn.closest('tr')?.dataset?.id));
    });
  }

  // Simple inline editor (prompt-based to keep code short). Replace with modal if you like.
  function openEdit(id) {
    const r = rfqs.find(x => x.id === id); if (!r) return;
    const buyer = prompt('Buyer:', r.buyer || '') ?? r.buyer;
    const status = prompt('Status (New, RFQ Sent, Quoting, CCT Issued, Closed):', r.status) ?? r.status;
    const rfqSentDate = prompt('RFQ Sent Date (YYYY-MM-DD):', r.rfqSentDate || '') ?? r.rfqSentDate;
    const cctSentDate = prompt('CCT Issued Date (YYYY-MM-DD):', r.cctSentDate || '') ?? r.cctSentDate;
    Object.assign(r, { buyer, status, rfqSentDate, cctSentDate });
    save(); render();
  }

  // ---------- Events
  el.form?.addEventListener('submit', onSubmit);
  el.form?.requestor?.addEventListener('blur', () => { el.form.requestor.value = titleCase(el.form.requestor.value); });
  el.sub?.addEventListener('change', updateSections);
  el.cat?.addEventListener('change', updateSections);
  el.remember?.addEventListener('change', maybeSavePrefs);

  ['input','change','keyup'].forEach(ev => {
    el.search?.addEventListener(ev, ()=>{ filters.q = el.search.value; render(); });
  });
  el.fStatus?.addEventListener('change', ()=>{ filters.status = el.fStatus.value; render(); });
  el.fFrom?.addEventListener('change', ()=>{ filters.from = el.fFrom.value; render(); });
  el.fTo?.addEventListener('change', ()=>{ filters.to = el.fTo.value; render(); });
  el.fReset?.addEventListener('click', ()=>{
    filters = { q:'', status:'', from:'', to:'' };
    if (el.search) el.search.value = '';
    if (el.fStatus) el.fStatus.value = '';
    if (el.fFrom) el.fFrom.value = '';
    if (el.fTo) el.fTo.value = '';
    render();
  });

  // Hook nav
  const navRFQ = document.getElementById('nav-rfq');
  navRFQ?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    el.page.style.display = 'block';
    render();
    document.querySelectorAll('#nav-links a').forEach(a => a.classList.remove('active'));
    navRFQ.classList.add('active');
  });

  // Init
  loadPrefs();
  updateSections();
  if (el.page && getComputedStyle(el.page).display !== 'none') render();
})();
