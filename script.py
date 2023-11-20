from flask import *
import json
app = Flask(__name__)


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


@app.route('/')
def main():
    return current_app.send_static_file('index.html')

@app.route('/get_sep_fruits')
def sepFruitsBySup():
    global fruits
    lowestPrices = getLowestPrices()
    print(lowestPrices)
    fruits = [{**f, "cheap": f["price"] == lowestPrices[f["fruit_name"]]} for f in fruits]   # add indicator for cheaper fruits
    # suppliers = list(set(f["supplier"] for f in fruits))    # get unique supplier names
    suppliers = [ "Supplier-1", "Supplier-2"]
    r = []
    for s in suppliers:
        fs = list(filter(lambda f: f["supplier"] == s, fruits))
        r.append({"supplier": s, "fruits": fs })

    return json.dumps(r), 200

def getLowestPrices():
    cheapFruits = {}
    for fruit in fruits:
        f, p = fruit["fruit_name"], float(fruit["price"])
        if f not in cheapFruits or p < cheapFruits[f]:
            cheapFruits[f] = p

    return cheapFruits

@app.route('/add', methods = ['POST'])
def add_fruit():
    data = request.get_json()
    if len(data["fruit_name"].strip()) == 0:
        return jsonify({'error': "Fruit name can't be empty!"}), 400
    if len(data["supplier"].strip()) == 0:
        return jsonify({'error': "Supplier can't be empty!"}), 400
    if len(data["last_updated"].strip()) == 0:
        return jsonify({'error': "Date can't be empty!"}), 400
    try:
        data["inventory_count"]= int(data["inventory_count"])
    except:
        return jsonify({'error': 'Invalid quantity!'}), 400
    try:
        data["price"]= float(data["price"])
    except:
        return jsonify({'error': 'Invalid price!'}), 400

    fruits.append(data)
    return jsonify(request.args), 201

@app.route('/get_sorted_fruits')
def sortFruits():
    order, sup, sortBy = request.args.get("order"), request.args.get("supplier"), request.args.get("sort_by")
    f = list(filter((lambda f: f["supplier"].lower() == sup.lower()), fruits))
    s = sorted(f, key = lambda f: float(f[sortBy]) if sortBy == "price"
        else int(f[sortBy]) if sortBy == "inventory_count" else f[sortBy].lower(), reverse = order == 'desc')

    return jsonify(s), 201

@app.route('/set', methods = ['POST'])
def modify_fruit():
    data = request.get_json()
    global fruits
    try:
        price = float(data["price"])
        count = int(data["inventory_count"])
    except:
        return jsonify({'error': 'Invalid input!'}), 400

    if price < 0:
        return jsonify({'error': 'Price must be >= 0'}), 400
    if count < 0:
        return jsonify({'error': 'Count must be >= 0!'}), 400


    fruits = list(map(lambda f: {**f, "price": price, "inventory_count": count}
            if f["fruit_name"] == data["fruit_name"] and f["supplier"] == data["supplier"] else f, fruits))

    return jsonify(request.args), 201

@app.route('/get_estimate')
def get_estimate():
    nmFruit = request.args['fruit']
    try:
        qtFruit = int(request.args['q'])
    except:
        return jsonify({'error': 'Invalid quantity!'}), 400

    if qtFruit < 0:
        return jsonify({'error': 'Quantity must be >= 0!'}), 400

    r = list(filter((lambda f: f["fruit_name"].lower() == nmFruit.lower()), fruits))
    maxAvailable = sum(f["inventory_count"] for f in r)
    if len(r) == 0:
        return jsonify({'error': "Fruit doesn't exist!"}), 400

    if qtFruit > maxAvailable:
        return jsonify({'error': 'Quantity exceeds limit: ' + str(maxAvailable), 'max': maxAvailable}), 400
    s = sorted(r, key = lambda f: float(f["price"]))
    qb = []
    est = 0
    for fruit in s:
        if qtFruit <= fruit["inventory_count"]:
            qb.append({fruit["supplier"] : qtFruit})
            est += fruit["price"] * qtFruit
            break
        else:
            qb.append({fruit["supplier"] : fruit["inventory_count"]})
            est += fruit["price"] * fruit["inventory_count"]
            qtFruit -= fruit["inventory_count"]

    r = {"qtBreakdown": qb, "estimate": est, "raw": s}

    return jsonify(r), 201


fruits = [
        {
            "fruit_name": "Banana",
            "price": 0.75,
            "last_updated": "2022-Jan-01",
            "inventory_count": 7,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Banana",
            "price": 0.79,
            "last_updated": "2022-Mar-01",
            "inventory_count": 66,
            "supplier": "Supplier-1"
        },
        {
            "fruit_name": "Apple",
            "price": 3.00,
            # "last_updated": "2022-Jan-01",
            "last_updated": "2022-Feb-01",
            "inventory_count": 66,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Apple",
            "price": 1.77,
            "last_updated": "2022-June-02",
            "inventory_count": 13,
            "supplier": "Supplier-1"
        },
        {
            "fruit_name": "Dragon Fruit",
            "price": 9.00,
            "last_updated": "1999-Feb-26",
            "inventory_count": 4,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Dragon Fruit",
            "price": 8.00,
            "last_updated": "2001-Nov-02",
            "inventory_count": 5,
            "supplier": "Supplier-1"
        },
        {
            "fruit_name": "Dragon Fruit",
            "price": 8.00,
            "last_updated": "2001-Nov-02",
            "inventory_count": 5,
            "supplier": "Orkhan Fruits"
        },
        {
            "fruit_name": "Kiwi",
            "price": 0.25,
            "last_updated": "1996-Jan-25",
            "inventory_count": 301,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Kiwi",
            "price": 4.00,
            "last_updated": "2021-Oct-11",
            "inventory_count": 19,
            "supplier": "Supplier-1"
        },
        {
            "fruit_name": "Orange",
            "price": 0.99,
            "last_updated": "2020-Jun-06",
            "inventory_count": 67,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Orange",
            "price": 1.25,
            "last_updated": "2019-Apr-09",
            "inventory_count": 45,
            "supplier": "Supplier-1"
        },
        {
            "fruit_name": "Mango",
            "price": 3.29,
            "last_updated": "2014-Sep-20",
            "inventory_count": 30,
            "supplier": "Supplier-2"
        },
        {
            "fruit_name": "Peaches",
            "price": 2.79,
            "last_updated": "2015-Oct-14",
            "inventory_count": 45,
            "supplier": "Supplier-1"
        }
    ]


@app.route('/get_fruit_names', methods=['GET'])
def get_fruit_names():
    uniq_fruits = list(set(map(lambda f: f["fruit_name"], fruits)))
    return json.dumps(uniq_fruits), 200

@app.route('/get_fruits', methods=['GET'])
def get_fruits():

    return json.dumps([fruits]), 200

if __name__ == '__main__':
    app.run(debug=True)
