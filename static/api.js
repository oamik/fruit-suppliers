export const getFruits = () => {
    return fetch('/get_fruits')
        .then((response) => response.json())
}

export const getSepFruits = () => {
    return fetch('/get_sep_fruits')
        .then((response) => response.json())
}

export const getFruitNames = () => {
    return fetch('/get_fruit_names')
        .then((response) => response.json())
}

export const getSortedFruits = (data) => {
    const params = new URLSearchParams(data).toString()
    return fetch(`/get_sorted_fruits?${params}`)
        .then((response) => response.json())
}

export const getPriceEstimate = (data) => {
    const params = new URLSearchParams(data).toString()
    return fetch(`/get_estimate?${params}`)
        .then((response) => response.json())
        .catch((error) => error.json());
}

export const setFruit = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
}
