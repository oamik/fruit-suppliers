import { getSepFruits } from "./api.js";
import { genTableHtml } from "./template.js";

export const getFruitsContainer = () => document.getElementById("fruits-container");
export const getEstContainer = () => document.getElementById("price-est-container");

const fruits = await getSepFruits() // fruits organized by their suppliers

export function generateTables() {
    fruits.forEach(fruit => {
        const supplierDiv = document.createElement("div");
        supplierDiv.classList.add('container')
        supplierDiv.innerHTML = genTableHtml(fruit)
        getFruitsContainer().appendChild(supplierDiv);
    });
}
