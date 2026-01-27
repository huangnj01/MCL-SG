function loadCategoryForm() {
  const cat = document.getElementById('category').value;
  const target = document.getElementById('dynamic-form');

  switch(cat) {
    case 'carton':
      target.innerHTML = `
        <h3>Carton Box Details</h3>
        <label>Box Style</label><input name="payload[box_style]">
        <label>Cardboard Type</label>
        <select name="payload[board]">
          <option>Singleface</option>
          <option>SW</option>
          <option>DW</option>
          <option>TW</option>
        </select>
        <label>Dimensions (L×W×H mm)</label><input name="payload[dimensions]">
        <label>Order Quantity*</label><input name="payload[qty]" required>
        <label>Artwork (Max 2 files, 5MB each)</label>
        <input type="file" name="artwork[]" multiple>
      `;
      break;
    case 'labels':
      target.innerHTML = `
        <h3>Label Details</h3>
        <label>Label Type</label><input name="payload[label_type]">
        <label>Dimensions (mm)</label><input name="payload[size]">
        <label>Order Quantity</label><input name="payload[qty]">
        <label>Artwork (1 file max 10MB)</label>
        <input type="file" name="artwork[]">
      `;
      break;
    // Add other categories similarly
    default:
      target.innerHTML = '';
  }
}
