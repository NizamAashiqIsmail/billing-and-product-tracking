from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import psycopg2

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")
CORS(app)

# PostgreSQL connection
conn = psycopg2.connect(
    dbname="abusali",
    user="postgres",
    password="nizam2355",
    host="localhost",
    port="5432"
)

@app.route('/')
def index():
    return render_template("billing.html")

# ========== Billing ==========
@app.route('/save-bill', methods=['POST'])
def save_bill():
    data = request.json.get('bill')
    name = data.get('user_name')
    phone = data.get('phone')
    total = data.get('total')

    cur = conn.cursor()
    cur.execute("INSERT INTO bills (user_name, phone, total) VALUES (%s, %s, %s)", (name, phone, total))
    conn.commit()
    cur.close()

    return jsonify({'message': 'Bill saved'})

# ========== Warehouse ==========
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    pid = data.get('pid')
    name = data.get('name')
    quantity = data.get('quantity')
    ptype = data.get('type')

    cur = conn.cursor()
    cur.execute("INSERT INTO warehouse_items (pid, name, quantity, type) VALUES (%s, %s, %s, %s)", (pid, name, quantity, ptype))
    conn.commit()
    cur.close()

    return jsonify({'message': 'Product added'})

# ========== Sales ==========
@app.route('/sales', methods=['POST'])
def add_sale():
    data = request.json
    pid = data.get('pid')
    quantity = data.get('quantity')
    price = data.get('price')

    cur = conn.cursor()
    cur.execute("INSERT INTO sales_records (pid, quantity, price) VALUES (%s, %s, %s)", (pid, quantity, price))
    conn.commit()
    cur.close()

    return jsonify({'message': 'Sale recorded'})

# ========== Downloads ==========
@app.route('/downloads', methods=['POST'])
def add_download():
    data = request.json
    filename = data.get('filename')

    cur = conn.cursor()
    cur.execute("INSERT INTO downloads (filename) VALUES (%s)", (filename,))
    conn.commit()
    cur.close()

    return jsonify({'message': 'Download logged'})

# ========== To-Do ==========
@app.route('/todo', methods=['POST'])
def add_todo():
    data = request.json
    task = data.get('task')

    cur = conn.cursor()
    cur.execute("INSERT INTO todo_list (task) VALUES (%s)", (task,))
    conn.commit()
    cur.close()

    return jsonify({'message': 'Task added'})

@app.route('/todo', methods=['GET'])
def get_todos():
    cur = conn.cursor()
    cur.execute("SELECT id, task FROM todo_list ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()

    todos = [{'id': row[0], 'task': row[1]} for row in rows]
    return jsonify(todos)

if __name__ == '__main__':
    app.run(debug=True)
