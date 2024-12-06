from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt


def role_required(allowed_roles):
    """Decorator to restrict access based on user roles."""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get JWT claims
            claims = get_jwt()

            # Check if 'role' is in claims
            if 'role' not in claims:
                return jsonify({"message": "Missing role information"}), 403

            # Check if user's role is in the allowed roles
            if claims["role"] not in allowed_roles:
                return jsonify({"message": "Permission denied"}), 403

            return func(*args, **kwargs)

        return wrapper

    return decorator
