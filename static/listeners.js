import * as api from "./api.js";
import { getFruitsContainer } from "./utils.js"
import { newFruitRowHtml, genRowHtml } from "./template.js";

export function setEventListeners() {
    getFruitsContainer().addEventListener('click', function (e) {
        let L = e.target.classList
        if (L.contains('rowCancelBtn')) { handleRowCancel() }
        else if (e.target.classList.contains('rowSaveBtn')) { handleRowSave(e) }
        else if (e.target.classList.contains('rowEditBtn')) { handleRowEdit(e) }
        else if (e.target.classList.contains('addFruitBtn')) { handleAddFruit(e) }
        else if (e.target.classList.contains('cancelFruitBtn')) { handleCancelFruit() }
        else if (e.target.classList.contains('saveFruitBtn')) { handleSaveFruit(e) }
        else if (e.target.classList.contains('sortBtn')) { handleSort(e) }
    })
}

function handleRowCancel() {
    const row = document.querySelector('#inEdit')
    if (row) {
        row.previousElementSibling.classList.remove('d-none')
        row.remove()
    }
}

async function handleRowSave(e) {
    const row = e.target.closest('#inEdit')
    let data = {
        "supplier": row.closest('.container').querySelector('.sup_name').innerText,
        "fruit_name": row.querySelector('.fruitCell').innerText,
        "last_updated": row.querySelector('.dateCell').innerText,
        "price": row.querySelector('.priceVal').value,
        "inventory_count": row.querySelector('.countVal').value
    }
    const r = await api.setFruit('/set', data)
    const summary = document.querySelector("#est-result")
    if (r.error) {
        summary.innerHTML = `<li style="color: red;">Error: ${r.error}</li>`
        return
    } else { window.location.href = '/' }
}

function handleRowEdit(e) {
    handleRowCancel()   // to close possibly open edit row mode
    handleCancelFruit()    // to close possibly open add row mode in another table
    const tr = e.target.closest('tr')
    let inputRow = tr.cloneNode(true)
    inputRow.id = "inEdit"
    const priceCell = inputRow.querySelector('.priceCell')
    const curPrice = priceCell.innerText
    priceCell.innerHTML = `<td><input class="priceVal" type="number" value="${curPrice}" step="0.01" placeholder="Price"></td>`
    const countCell = inputRow.querySelector('.countCell')
    const curCount = countCell.innerText
    countCell.innerHTML = `<input class="countVal" type="number" value="${curCount}" placeholder="Count"></td>`
    inputRow.querySelector('.rowEditBtn').classList.add('d-none')
    inputRow.querySelector('.rowCancelBtn').classList.remove('d-none')
    inputRow.querySelector('.rowSaveBtn').classList.remove('d-none')
    tr.classList.add('d-none')
    tr.parentNode.insertBefore(inputRow, tr.nextSibling)
}

function handleAddFruit(e) {
    handleRowCancel()   // to close posiibly open edit mode
    handleCancelFruit()    // to close possibly open add row mode in another table
    let addRow = document.createElement('tr')
    addRow.id = 'addRow'
    addRow.innerHTML = newFruitRowHtml
    e.target.closest('table').querySelector('tbody').appendChild(addRow)
    e.target.classList.add('d-none')
}

function handleCancelFruit() {
    let addRow = document.querySelector('#addRow')
    if (addRow) {
        const addFruitBtn = addRow.closest('.table').querySelector('.addFruitBtn')
        addFruitBtn.classList.remove('d-none')
        addRow.remove()
    }
}

async function handleSaveFruit(e) {
    let data = {
        "fruit_name": e.target.closest('table').querySelector('.fruitVal').value,
        "price": e.target.closest('table').querySelector('.priceVal').value,
        "last_updated": e.target.closest('table').querySelector('.dateVal').value,
        "inventory_count": e.target.closest('table').querySelector('.countVal').value,
        "supplier": e.target.closest('.container').querySelector('.sup_name').innerText
    }
    const r = await api.setFruit('/add', data)
    const summary = document.querySelector("#est-result")
    if (r.error) {
        summary.innerHTML = `<li style="color: red;">Error: ${r.error}</li>`
        return
    } else { window.location.href = '/' }
}

async function handleSort(e) {
    const sup = e.target.closest('.container').querySelector('.sup_name').innerText
    const sortBy = e.target.closest('th').id
    let order = 'asc'

    let lastOrdered = sessionStorage.getItem(sup)
    if (lastOrdered) {
        let info = JSON.parse(lastOrdered)
        order = info["sort_by"] == sortBy && info["order"] == 'asc' ? 'desc' : 'asc'
    }

    let data = {
        "supplier": sup,
        "sort_by": sortBy,
        "order": order
    }
    sessionStorage.setItem(data["supplier"], JSON.stringify(data))

    const r = await api.getSortedFruits(data)
    e.target.closest('.container').querySelector('tbody').innerHTML = r.map(f => genRowHtml(f)).join('')
}
