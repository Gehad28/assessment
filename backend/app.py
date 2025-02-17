from flask import Flask, request
from flask_cors import CORS
import json
from aggregation import TransactionAggregator

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def transactions_list():
    with open('data.json') as f:
        data = json.load(f)
    return data

@app.route("/filter", methods=['POST'])
def filter_transactions():
    group_by = request.args.get('group_by')
    filters = request.get_json()
    aggregator = TransactionAggregator(transactions_list())

    if group_by == 'customer_id':
        customer_id = int(filters['customer_id'])
        transactions = aggregator.filter_by_customer(customer_id)
        total_amount = aggregator.aggregate_total_revenue(transactions)
        return json.dumps({ 'transactions': transactions, 'val': {'total_amount': total_amount} })
    elif group_by == 'item_id':
        item_id = int(filters['item_id'])
        transactions = aggregator.filter_by_item(item_id)
        quantity = aggregator.aggregate_total_item(transactions)
        return json.dumps({ 'transactions': transactions, 'val': {'quantity': quantity} })
    elif group_by == 'date_range':
        start = filters['date_range']['start_date']
        end = filters['date_range']['end_date']
        transactions = aggregator.filter_by_date(start, end)
        total_amount = aggregator.aggregate_total_revenue(transactions)
        return json.dumps({ 'transactions': transactions, 'val': {'total_amount': total_amount} })
    return json.dumps({ 'message': 'Not Found' })