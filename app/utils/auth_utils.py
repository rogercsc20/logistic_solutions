from flask_jwt_extended import get_jwt
from flask import jsonify
from functools import wraps

def role_required(required_roles):
    """Decorator to restrict access based on user roles"""
    def wrapper(fn):
        @wraps(fn)
        def decorated_function(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get("role")
            if user_role not in required_roles:
                return jsonify({"message" : "Access denied"}), 403
            return fn(*args, **kwargs)
        return decorated_function
    return wrapper
