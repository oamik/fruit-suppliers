export function genTableHtml({ supplier, fruits }) {
    return `
    <h2 class="sup_name">${supplier}</h2>
    <table class="table table-hover">
        <thead class="table-dark">
            <tr>
                <th scope="col"></th>
                <th scope="col" id="fruit_name">      Fruit           ${sortBtnHtml} </th>
                <th scope="col" id="price">           Price           ${sortBtnHtml} </th>
                <th scope="col" id="last_updated">    Last Updated    ${sortBtnHtml} </th>
                <th scope="col" id="inventory_count"> Count           ${sortBtnHtml} </th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            ${fruits.map(fruit => genRowHtml(fruit)).join('')}
        </tbody>
        <tfoot><tr class="btn-row">
            <td colspan="6" class="border-bottom-0" style="background-color: inherit;">
                <button class="btn btn-primary addFruitBtn"> + NEW FRUIT </button>
            </td></tr></tfoot>
    </table >`;
}

export function genRowHtml({ fruit_name, price, last_updated, inventory_count, cheap }) {
    return `
    <tr class=${cheap ? "table-info" : ''}>
        <td><button class="btn btn-light btn-sm rowEditBtn"> ... </button></td>
        <td class="fruitCell">${fruit_name}</td>
        <td class="priceCell">${price}</td>
        <td class="dateCell">${last_updated}</td>
        <td class="countCell">${inventory_count}</td>
        <td>
            <button class="btn btn-light btn-sm rowCancelBtn d-none"> ✘ </button>
            <button class="btn btn-light btn-sm rowSaveBtn text-dark d-none"> ✔ </button>
        </td>
    </tr>`;
}

const sortBtnHtml = `
    <button type="button" class="btn btn-link btn-sm sortBtn" title="Sort by Column">
        <i class="fa sortBtn" style="color:white">&#xf0dc;</i>
    </button>`;

export const newFruitRowHtml = `
    <td></td>
    <td><input class="fruitVal" type="text" placeholder="Fruit"></td>
    <td><input class="priceVal" type="number" min="0.00" step="0.01" placeholder="Price"></td>
    <td><input class="dateVal" type="date" placeholder="Last Updated"></td>
    <td><input class="countVal" type="number" min="0" placeholder="Count"></td>
    <td>
        <button class="btn btn-secondary btn-sm cancelFruitBtn"> ✘ </button>
        <button class="btn btn-success btn-sm saveFruitBtn"> ✔ </button>
    </td>`;
