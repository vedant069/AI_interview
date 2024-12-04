from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any
import os

class FeedbackModel:
    def __init__(self):
        self.client = MongoClient("mongodb+srv://vedant22211000:vedant@cluster0.tvr7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        self.db = self.client['interview_database']
        self.collection = self.db['user']

    def save_feedback(self, user_id: str, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save feedback and maintain only last 3 records per user."""
        try:
            # Add timestamp and user_id
            feedback_data['user_id'] = user_id
            feedback_data['created_at'] = datetime.utcnow()

            # Insert new feedback
            self.collection.insert_one(feedback_data)

            # Get all feedback for this user, sorted by date
            user_feedbacks = list(self.collection.find(
                {'user_id': user_id},
                {'_id': 1}
            ).sort('created_at', -1))

            # If more than 3 records exist, delete the oldest ones
            if len(user_feedbacks) > 5:
                old_feedback_ids = [f['_id'] for f in user_feedbacks[3:]]
                self.collection.delete_many({'_id': {'$in': old_feedback_ids}})

            return {'success': True, 'message': 'Feedback saved successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_user_feedback(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve last 3 feedback records for a user."""
        try:
            feedbacks = list(self.collection.find(
                {'user_id': user_id},
                {'_id': 0}  # Exclude MongoDB _id from results
            ).sort('created_at', -1).limit(3))
            
            # Convert datetime objects to strings for JSON serialization
            for feedback in feedbacks:
                feedback['created_at'] = feedback['created_at'].isoformat()
            
            return feedbacks
        except Exception as e:
            return []