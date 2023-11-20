import { getFruitNames, getPriceEstimate } from "./api.js";
import { getEstContainer } from "./utils.js";

const fruitNames = await getFruitNames()

function genEstimateBarHtml() {
    return `
    <h2 class="sup_name">Price Estimate</h2>
    <table class="table table-hover">
        <thead class="table-dark">
            <tr>
                <th scope="col" id="fruit"> Fruit </th>
                <th scope="col" id="q"> Quantity </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <select id="estFruit">
                        ${fruitNames.map(fruitName => genOptionHtml(fruitName)).join('')}
                    </select>
                </td>
                <td><input id="estQuantity" class="countVal" type="number" min="0" placeholder="Count"></td>
            </tr>
        </tbody>
        <tfoot><tr><td colspan="2" class="border-bottom-0" style="background-color: inherit;">
            <button class="btn btn-primary estBtn"> GET PRICE </button>
        </td></tr></tfoot>
    </table>
    <ul id="est-result"></ul>`;
}

function genListItems({ estimate, qtBreakdown }) {
    return `
    <li>Estimated total: $${estimate}</li>
    ${qtBreakdown.map(item => `<li>${item[Object.keys(item)]} from ${Object.keys(item)}</li>`).join('')}
    `
}

function genOptionHtml(fruitName) {
    return `<option value="${fruitName}">${fruitName}</option>`;
}

export function genEstimateBar() {
    const estimateDiv = document.createElement("div");
    estimateDiv.classList.add('estContainer')
    estimateDiv.innerHTML = genEstimateBarHtml()
    getEstContainer().appendChild(estimateDiv);
}

export function setEstimateListener() {
    const estimateBtn = document.querySelector('.estBtn')
    estimateBtn.addEventListener('click', async function () {
        let data = {
            "fruit": document.querySelector('#estFruit').value,
            "q": document.querySelector('#estQuantity').value
        }
        const summary = document.querySelector("#est-result")
        const r = await getPriceEstimate(data)
        if (r.error) {
            summary.innerHTML = `<li style="color: red;">Error: ${r.error}</li>`
            return
        }
        summary.innerHTML = genListItems(r)
    })
}
