from pymongo import MongoClient
from datetime import datetime
import os

class UserModel:
    def __init__(self):
        self.client = MongoClient("mongodb+srv://vedant22211000:vedant@cluster0.tvr7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        self.db = self.client['interview_database']
        self.collection = self.db['user_data']

    def create_user(self, user_data):
        """Create a new user in the database."""
        try:
            # Add timestamp
            user_data['created_at'] = datetime.utcnow()
            
            # Check if user already exists
            existing_user = self.collection.find_one({'uid': user_data['uid']})
            if existing_user:
                return {'success': True, 'message': 'User already exists'}

            # Insert new user
            self.collection.insert_one(user_data)
            return {'success': True, 'message': 'User created successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_user(self, uid):
        """Retrieve user data by UID."""
        try:
            user = self.collection.find_one({'uid': uid}, {'_id': 0})
            return user
        except Exception as e:
            return None