function toggleDropdown(id) {
  document.querySelectorAll('.dropdown-panel').forEach(el => {
    if (el.id !== id) el.style.display = 'none';
  });
  const dropdown = document.getElementById(id);
  dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex';
}

let productDatabase = {};

function showProductDetails(productType) {
  const content = document.getElementById("content-area");
  if (!productDatabase[productType]) productDatabase[productType] = [];

  const productListHTML = productDatabase[productType].map((item, index) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ccc;">${item.pid}</td>
      <td style="padding: 10px; border: 1px solid #ccc;">${item.name}</td>
      <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">
        <button onclick="removeProductItem('${productType}', ${index})" style="border: none; background: none; cursor: pointer;">🗑️</button>
      </td>
    </tr>
  `).join("");

  content.innerHTML = `
    <h2>${productType} Items</h2>
    <form id="productForm" onsubmit="addProductItem(event, '${productType}')" style="margin-bottom: 20px;">
      <input type="text" id="pid" placeholder="Product ID" required class="add-product-input" />
      <input type="text" id="pname" placeholder="Name" required class="add-product-input" />
      <input type="number" id="quantity" placeholder="Quantity" required class="add-product-input" />
      <button type="submit" class="add-product-btn">Add Item</button>
    </form>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ccc;">Product ID</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Name</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
          <th style="padding: 10px; border: 1px solid #ccc;">Remove</th>
        </tr>
      </thead>
      <tbody>${productListHTML}</tbody>
    </table>
  `;
}

function addProductItem(event, productType) {
  event.preventDefault();
  const pid = document.getElementById("pid").value.trim();
  const pname = document.getElementById("pname").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value.trim());

  if (!pid || !pname || isNaN(quantity)) {
    alert("Please fill all fields correctly.");
    return;
  }

  productDatabase[productType].push({ pid, name: pname, quantity });
  showProductDetails(productType);
}

function removeProductItem(productType, index) {
  productDatabase[productType].splice(index, 1);
  showProductDetails(productType);
}

function showSalesChart() {
  const content = document.getElementById('content-area');
  content.innerHTML = `<canvas id="salesChart" width="600" height="400"></canvas>`;
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales (₹)',
        data: [12000, 15000, 11000, 18000, 22000],
        backgroundColor: '#74aaff',
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

let productCounts = {
  'Aluminium': 0,
  'Steel': 0,
  'Wood': 0,
  'Electronics': 0
};

function showWarehouse() {
  const content = document.getElementById('content-area');

  const productHTML = Object.entries(productCounts).map(([name, count]) => `
    <div class="product-row" id="row-${name}">
      <span class="product-name">${name}</span>
      <div class="product-controls">
        <button onclick="updateCount('${name}', -1)">–</button>
        <span id="${name}-count">${count}</span>
        <button onclick="updateCount('${name}', 1)">+</button>
        <button onclick="removeProduct('${name}')">🗑️</button>
      </div>
    </div>
  `).join('');

  const addForm = `
    <div class="add-product-container">
      <input id="newProductInput" type="text" class="add-product-input" placeholder="New Product Name" />
      <button onclick="addProduct()" class="add-product-btn">Add Product</button>
    </div>
  `;

  content.innerHTML = `<h2>Warehouse Inventory</h2>${productHTML}${addForm}`;
}

function updateCount(product, delta) {
  if (!(product in productCounts)) return;
  productCounts[product] += delta;
  if (productCounts[product] < 0) productCounts[product] = 0;
  document.getElementById(`${product}-count`).textContent = productCounts[product];
}

function addProduct() {
  const input = document.getElementById("newProductInput");
  const newProduct = input.value.trim();
  if (!newProduct || productCounts[newProduct]) {
    alert("Enter a valid or unique product name");
    return;
  }
  productCounts[newProduct] = 0;
  showWarehouse();
  input.value = "";
}

function removeProduct(name) {
  delete productCounts[name];
  showWarehouse();
}

let files = [
  { name: 'Report_January.pdf', url: 'downloads/Report_January.pdf' },
  { name: 'SalesData_March.xlsx', url: 'downloads/SalesData_March.xlsx' },
  { name: 'Inventory_List.csv', url: 'downloads/Inventory_List.csv' },
  { name: 'Summary_Notes.docx', url: 'downloads/Summary_Notes.docx' }
];

function showDownloads() {
  const content = document.getElementById('content-area');

  const fileList = files.map((file, index) => `
    <div class="product-row" style="margin-bottom: 10px;">
      <span class="product-name">${file.name}</span>
      <div class="product-controls">
        <a href="${file.url}" download class="add-product-btn" style="text-decoration:none;">Download</a>
        <button onclick="removeFile(${index})">🗑️</button>
      </div>
    </div>
  `).join('');

  const uploadSection = `
    <div class="custom-file-upload">
      <label for="file-upload" class="add-product-btn">Choose File</label>
      <input type="file" id="file-upload" />
      <button onclick="uploadFile()" class="add-product-btn">Upload</button>
    </div>
  `;

  content.innerHTML = `<h2>Downloadable Files</h2>${fileList}${uploadSection}`;
}

function removeFile(index) {
  files.splice(index, 1);
  showDownloads();
}

function uploadFile() {
  const input = document.getElementById('file-upload');
  if (input.files.length === 0) {
    alert('Please select a file to upload');
    return;
  }

  const file = input.files[0];
  const fileUrl = URL.createObjectURL(file);
  files.push({ name: file.name, url: fileUrl });
  showDownloads();
  input.value = '';
}
let todos = [];

function showTodo() {
  const content = document.getElementById('content-area');

  const todoItems = todos.map((task, index) => `
    <div class="product-row" style="margin-bottom: 10px;">
      <input type="checkbox" onchange="toggleTodo(${index})" ${task.done ? 'checked' : ''} />
      <span class="product-name" style="text-decoration: ${task.done ? 'line-through' : 'none'}; margin-left: 10px;">
        ${task.text}
      </span>
      <div class="product-controls">
        <button onclick="removeTodo(${index})">🗑️</button>
      </div>
    </div>
  `).join('');

  const addTodoForm = `
    <div class="add-product-container">
      <input id="newTodoInput" type="text" class="add-product-input" placeholder="New Task" />
      <button onclick="addTodo()" class="add-product-btn">Add Task</button>
    </div>
  `;

  content.innerHTML = `<h2>To-Do List</h2>${todoItems}${addTodoForm}`;
}
function addTodo() {
  const input = document.getElementById("newTodoInput");
  const taskText = input.value.trim();

  if (!taskText) {
    alert("Please enter a task.");
    return;
  }

  // Save to backend
  fetch('http://localhost:5000/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: taskText })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    todos.push({ text: taskText, done: false }); // Update local list
    showTodo(); // Refresh UI
    input.value = "";
  })
  .catch(error => {
    console.error('Error adding to-do:', error);
  });
}


function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  showTodo();
}

function removeTodo(index) {
  todos.splice(index, 1);
  showTodo();
}
window.onload = showTodo;

