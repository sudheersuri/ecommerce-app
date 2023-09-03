from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
from bson.json_util import dumps
import datetime

import os
import stripe

app = Flask(__name__)
load_dotenv()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    if mongo.db.users.find_one({'email': email}):
        return jsonify(message="Email already taken"), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({'username':username,'email': email, 'password': hashed_password})

    return jsonify(message="User registered successfully"), 200

# User login
@app.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    
    email = data['email']
    password = data['password']

    user = mongo.db.users.find_one({'email': email})

    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify(message="Invalid credentials"), 401

    access_token = create_access_token(identity=str(user['_id']))
    return jsonify(access_token=access_token,username=user['username']), 200


@app.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    try:
        # Retrieve the order details from the request
        data = request.get_json()
        
        # Calculate the total amount based on the order
        # This is just an example; adjust it to your use case
        total_amount = data['amount']
   
        # Create a PaymentIntent with the calculated total amount
        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            payment_method_types=["card"],
            currency='cad',  # Replace with your desired currency code
        )

        # Create an order document in the database
        current_user_id = get_jwt_identity()
        shipping_address = data.get('shipping_address')  # Get the address_id from the request
        items = data.get('items', [])  # Get the items from the request
        status = 'paid'  # You can set the initial status as needed
        created_timestamp = datetime.datetime.utcnow()

        order_data = {
            'user_id': current_user_id,
            'shipping_address': shipping_address,
            'items': items,
            'status': status,
            'total': total_amount,
            'created_timestamp': created_timestamp,
        }

        # Insert the order document into the database
        mongo.db.orders.insert_one(order_data)

        return jsonify({'clientSecret': payment_intent.client_secret})

    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 500

# Endpoint to get all addresses for a given user ID
@app.route('/get_addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    try:
        # Get the user identity from the JWT token
        current_user_id = get_jwt_identity()

        # Query the 'addresses' collection for addresses associated with the user ID
        addresses = mongo.db.addresses.find({'user_id': current_user_id})

        # Convert the addresses to a list
        addresses_list = list(addresses)

        # Convert ObjectId to string in each document
        for address in addresses_list:
            address['id'] = str(address.pop('_id', None))

        # Convert the addresses to a JSON response
        addresses_json = dumps(addresses_list)

        return addresses_json, 200

    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500
    
# Endpoint to save an address for a user
@app.route('/save_address', methods=['POST'])
@jwt_required()  # Requires authentication via JWT
def save_address():
    try:
        # Get the user ID from the JWT payload
        current_user_id = get_jwt_identity()

        # Get the address data from the request
        address_data = request.get_json()

        # Create a new address document
        new_address = {
            'user_id': current_user_id,
            'nickname': address_data.get('nickname'),
            'address': address_data.get('address'),
            'city': address_data.get('city'),
            'state': address_data.get('state'),
            'zipcode': address_data.get('zipcode'),
        }

        # Insert the address document into the 'addresses' collection
        mongo.db.addresses.insert_one(new_address)

        return jsonify({'message': 'Address saved successfully'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    try:
        # Query the 'addresses' collection for addresses associated with the user ID
        orders = mongo.db.orders.find({'user_id': current_user_id}, {"_id": 0})

        # Convert the cursor to a list of dictionaries
        orders_list = list(orders)

         # Convert ObjectId to string in each document
        for order in orders_list:
            order['id'] = str(order.pop('_id', None))

        # Serialize the list to JSON using dumps
        return dumps(orders_list), 200
    
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 500

def calculate_total_amount(items):
    # Calculate the total amount based on the items in the order
    # You may adjust this logic based on your product pricing
    total = sum(item['price'] * item['quantity'] for item in items)
    return int(total * 100)  # Convert to cents

if __name__ == '__main__':
    app.run(debug=True)
