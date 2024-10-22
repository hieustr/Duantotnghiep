let currentPage = 1;

document.getElementById('addCustomerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addCustomer();
});

function addCustomer() {
    const customerData = {
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/customers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 201) {
            alert('Khách hàng đã được thêm!');
            clearForm();
            loadCustomers();
        }
    };
    xhr.send(JSON.stringify(customerData));
}

function clearForm() {
    document.getElementById('addCustomerForm').reset();
}

function loadCustomers(page = 1) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/customers?page=${page}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const tableBody = document.getElementById('customerTableBody');
            tableBody.innerHTML = '';
            data.customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer._id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${new Date(customer.registrationDate).toLocaleDateString()}</td>
                    <td>
                        <button onclick="editCustomer('${customer._id}')">Sửa</button>
                        <button onclick="deleteCustomer('${customer._id}')">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            document.getElementById('currentPage').innerText = page;
            currentPage = page;
        }
    };
    xhr.send();
}

function deleteCustomer(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/customers/${id}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert('Khách hàng đã được xóa!');
            loadCustomers(currentPage);
        }
    };
    xhr.send();
}

function changePage(page) {
    if (page < 1) return;
    loadCustomers(page);
}

function searchCustomer() {
    const query = document.getElementById('searchInput').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/customers?search=${query}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const tableBody = document.getElementById('customerTableBody');
            tableBody.innerHTML = '';
            data.customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer._id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${new Date(customer.registrationDate).toLocaleDateString()}</td>
                    <td>
                        <button onclick="editCustomer('${customer._id}')">Sửa</button>
                        <button onclick="deleteCustomer('${customer._id}')">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    };
    xhr.send();
}

// Tải khách hàng khi trang được tải
loadCustomers();
