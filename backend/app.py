from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
from bson.json_util import dumps
from datetime import datetime
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

def format_timestamp(timestamp_obj):
    if "$date" in timestamp_obj:
        timestamp_str = timestamp_obj["$date"]
        timestamp_datetime = datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        formatted_timestamp = timestamp_datetime.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_timestamp
    else:
        return None  # Handle

@app.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    try:
        # Retrieve the order details from the request
        data = request.get_json()
        
        # Calculate the total amount based on the order
        total_amount = int(data['amount'] * 100)
       
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

        # Check if an ID is provided in the request
        address_id = address_data.get('id')
        
        if address_id:
            
            # Update operation: Check if the provided ID exists in the 'addresses' collection
            existing_address = mongo.db.addresses.find_one({'_id': ObjectId(address_id), 'user_id': current_user_id})

            if existing_address:
                # Update the existing address document
                updated_address = {
                    'user_id': current_user_id,
                    'nickname': address_data.get('nickname'),
                    'address': address_data.get('address'),
                    'city': address_data.get('city'),
                    'state': address_data.get('state'),
                    'zipcode': address_data.get('zipcode'),
                }

                mongo.db.addresses.update_one({'_id': ObjectId(address_id)}, {'$set': updated_address})

                return jsonify({'message': 'Address updated successfully'}), 200
            else:
                return jsonify({'message': 'No address with the provided ID exists'}), 404
        else:
            # Create operation: Insert a new address document
            new_address = {
                'user_id': current_user_id,
                'nickname': address_data.get('nickname'),
                'address': address_data.get('address'),
                'city': address_data.get('city'),
                'state': address_data.get('state'),
                'zipcode': address_data.get('zipcode'),
            }

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
        orders = mongo.db.orders.find({'user_id': current_user_id})

        # Convert the cursor to a list of dictionaries
        orders_list = list(orders)
        for order in orders_list:
            if 'created_timestamp' in order:
                order['created_timestamp'] = order['created_timestamp'].strftime('%Y-%m-%d %H:%M:%S')

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

# Endpoint to add/update/get categories
@app.route('/categories', methods=['GET', 'PUT'])
@jwt_required()
def categories():
    if request.method == 'GET':
        categories = list(mongo.db.categories.find({}, {'_id': 1, 'name': 1}))
        # Use dumps to convert MongoDB documents to JSON-serializable format

        # Convert ObjectId to string in each document
        for category in categories:
            category['id'] = str(category.pop('_id', None))

        serialized_categories = dumps(categories)
        return serialized_categories, 200
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if not isinstance(data, list):
                return jsonify({'message': 'Invalid input format!'}), 400

            for item in data:
                category_id = item.get('id')
                category_name = item.get('name')

                if not category_name:
                    return jsonify({'message': 'Category name is required!'}), 400

                existing_category = mongo.db.categories.find_one({'name': category_name})

                if existing_category and existing_category['_id'] != ObjectId(category_id):
                    return jsonify({'message': 'Category with the same name already exists!'}), 400

                if category_id:
                    mongo.db.categories.update_one({'_id': ObjectId(category_id)}, {'$set': {'name': category_name}})
                else:
                    new_category = {'name': category_name}
                    mongo.db.categories.insert_one(new_category)

            return jsonify({'message': 'Categories added/updated successfully!'}), 200

        except Exception as e:
            return jsonify({'message': str(e)}), 500


# Endpoint to add/update/get products
@app.route('/products', methods=['GET', 'PUT'])
@jwt_required()
def products():
    if request.method == 'GET':
        products = list(mongo.db.products.find({}, {'_id': 1, 'name': 1, 'desc': 1, 'price': 1, 'categoryId': 1, 'imageURL': 1}))
       
        # Convert ObjectId to string in each document
        for product in products:
            product['id'] = str(product.pop('_id', None))

        # Use dumps to convert MongoDB documents to JSON-serializable format
        serialized_products = dumps(products)
    
        return serialized_products, 200
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if not isinstance(data, list):
                return jsonify({'message': 'Invalid input format!'}), 400

            for item in data:
                product_id = item.get('id')
                product_name = item.get('name')
                product_desc = item.get('description')
                product_price = item.get('price')
                product_category_id = item.get('categoryId')
                product_image_url = item.get('imageURL')

                if not product_name or not product_desc or not product_price or not product_category_id:
                    return jsonify({'message': 'Product name, description, price, and categoryId are required!'}), 400

                existing_product = mongo.db.products.find_one({'name': product_name})

                if existing_product and existing_product['_id'] != ObjectId(product_id):
                    return jsonify({'message': 'Product with the same name already exists!'}), 400

                if product_id:
                    mongo.db.products.update_one({'_id': ObjectId(product_id)}, {
                        '$set': {
                            'name': product_name,
                            'desc': product_desc,
                            'price': product_price,
                            'categoryId': product_category_id,
                            'imageURL': product_image_url
                        }
                    })
                else:
                    new_product = {
                        'name': product_name,
                        'desc': product_desc,
                        'price': product_price,
                        'categoryId': product_category_id,
                        'imageURL': product_image_url
                    }
                    mongo.db.products.insert_one(new_product)

            return jsonify({'message': 'Products added/updated successfully!'}), 200

        except Exception as e:
            return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
