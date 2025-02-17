from collections import Counter
from datetime import datetime
from functools import reduce

class TransactionAggregator:
    def __init__(self, transactions):
        self.transactions = transactions
    
    @staticmethod
    def date(d):
        """Parsing date  
        
        Keyword arguments:
        `d` -- date string from client side
        Return: new datetime parsed from a string
        """
        
        return datetime.strptime(d, "%Y-%m-%d")
    
    @staticmethod
    def agg(lst, key):
        """Get sum of a dictionary's property across a list of dictionaries
        
        Keyword arguments:
        `lst` -- list of dictionaries
        `key` -- the key of the property to sum
        Return: the sum 
        """
        
        return reduce(lambda acc, curr: acc + curr[key], lst, 0)
    
    def filter_by_customer(self, customer_id):
        """Get transactions by customer id
        
        Keyword arguments:
        `customer_id` -- customer id
        Return: list of the transactions
        """
        
        customer_transactions = filter(lambda t: t['customer_id'] == customer_id, self.transactions)
        return list(customer_transactions)
    
    def filter_by_item(self, item_id):
        """Get transactions by item id
        
        Keyword arguments:
        `item_id` -- item id
        Return: list of transactions that only contain the specified item 
        """
        
        items_transactions = []
        for transaction in self.transactions:
            for item in transaction['items']:
                if item['item_id'] == item_id:
                    transaction['items'] = [item]
                    items_transactions.append(transaction)
        return items_transactions
    
    def filter_by_date(self, start, end):
        """Get transactions in a certain date range
        
        Keyword arguments:
        `start` -- start date
        `end` -- end date
        Return: list of transactions
        """
        
        start = self.date(start)
        end = self.date(end)
        transactions = filter(lambda t: self.date(t['date']) >= start and self.date(t['date']) <= end, self.transactions)
        return list(transactions)
    
    @staticmethod
    def aggregate_total_revenue(transactions):
        """Aggregate on the total amount of the transactions
        
        Keyword arguments:
        `transactions` -- list to aggregate on
        Return: sum of total amount across the list
        """
        
        transactions = sorted(transactions, key=lambda x: x['total_amount'], reverse=True)
        return TransactionAggregator.agg(transactions, 'total_amount')
    
    @staticmethod
    def aggregate_total_item(transactions):
        """Aggregate on the quantity of the items in the transactions
        
        Keyword arguments:
        `transactions` -- list to aggregate on
        Return: quantity of the items
        """

        transactions = sorted(transactions, key=lambda x: x['items'][0]['quantity'], reverse=True)
        return reduce(lambda acc, curr: acc + sum(item['quantity'] for item in curr['items']), transactions, 0)