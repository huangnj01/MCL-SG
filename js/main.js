// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const pages = {
    po: document.getElementById('page-po'),
    // Add other pages here if you have them:
    // dashboard: document.getElementById('page-dashboard'),
    // rfq: document.getElementById('page-rfq'),
    // invoices: document.getElementById('page-invoices'),
    // contracts: document.getElementById('page-contracts'),
    // policies: document.getElementById('page-policies'),
  };

  function showPage(key) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    pages[key] && (pages[key].style.display = 'block');
    // nav active state
    document.querySelectorAll('#nav-links a').forEach(a => a.classList.remove('active'));
    const nav = document.getElementById(`nav-${key}`);
    nav && nav.classList.add('active');
  }

  // Hook POs nav
  const navPO = document.getElementById('nav-po');
  navPO?.addEventListener('click', (e) => { e.preventDefault(); showPage('po'); });

  // Default page (optional): show dashboard if you have one
  // showPage('dashboard');
});
