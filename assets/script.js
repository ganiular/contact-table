let contacts = [];

async function getContacts() {
    let res = await fetch('contact_table.php', { method: 'GET' })
    return res.json();
}

async function postContact(body) {
    let res = await fetch('contact_table.php', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    return res.json();
}

async function deleteContact(rowId) {
    let res = await fetch('contact_table.php?delete=' + rowId, { method: 'POST' });
    let result = await res.json();
    if (result.success) {
        contacts = contacts.filter((item) => item.id != rowId);
        let searchKey = $('#search').val();
        search(searchKey, contacts);
    }
}

function sortBy(name, contacts, ascending = true) {
    if (ascending) {
        let i = contacts.sort((a, b) => a[name] > b[name] ? 1 : -1)
    } else {
        contacts.sort((a, b) => a[name] > b[name] ? -1 : 1)
    }
    return contacts
}

function editContact(rowId) {
    let item = contacts.find((item) => item.id == rowId);
    let form = document.forms[0];
    form.name.value = item.name;
    form.phone.value = item.phone;
    form.email.value = item.email;
    form.action = "contact_table.php?edit=" + item.id;
}

function search(key) {
    let filtered = []
    key = key.toLowerCase();
    for (var i in contacts) {
        for (var j in contacts[i]) {
            if (contacts[i][j].toLowerCase().search(key) > -1) {
                filtered.push(contacts[i])
                break;
            }
        }
    }
    writeTable(filtered);
}

function writeTable(contacts) {
    $("tbody").empty();
    for (var i of contacts) {
        $("tbody").append(`
<tr id="${i.id}">
    <td>${i.name}</td>
    <td>${i.phone}</td>
    <td>${i.email}</td>
    <td>
        <button onclick="editContact(${i.id})">Edit</button><button onclick="deleteContact(${i.id})">Delete</button>
    </td>
</tr>
        `);
    }
}

$(document).ready(async function () {
    contacts = await getContacts();
    let sortedColumn = null;
    sortBy('name', contacts, true);
    writeTable(contacts);
    $('th[column]').click(function (params) {
        let h = this;
        let column = h.getAttribute('column');
        let ths = document.querySelectorAll('th');
        ths.forEach((th) => th !== this ? th.className = '' : null);
        if (h.classList.replace('sort-asc', 'sort-desc')) {
            writeTable(sortBy(column, contacts, false))
        } else if (h.classList.replace('sort-desc', 'sort-asc')) {
            writeTable(sortBy(column, contacts, true))
        } else {
            h.classList.add('sort-asc');
            writeTable(sortBy(column, contacts, true))
        }
        sortedColumn = column;
    });
    $('#search').on('input', function (event) {
        search(this.value, contacts);
    });
});