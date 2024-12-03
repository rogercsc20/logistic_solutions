from flask.views import MethodView
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity
from flask_smorest import Blueprint
from app.extensions import db
from app.models.revoked_token import RevokedToken
from app.models.user import User
from schemas.user_schema import UserSchema, UserLoginSchema
from app.utils.auth_utils import role_required
from datetime import timedelta

blp = Blueprint("Users", __name__, description="Operations on users")

@blp.route("/register")
class RegisterUser(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        """Register a new user"""
        if User.query.filter_by(username=user_data["username"]).first():
            return {"message" : "Username already exists"}, 400

        if User.query.filter_by(email=user_data["email"]).first():
            return {"message" : "Email already registered"}, 400

        new_user = User(
            username=user_data["username"],
            email=user_data["email"],
            role=user_data["role"]
        )
        new_user.set_password(user_data["password"])
        db.session.add(new_user)
        db.session.commit()
        return {"message" : "User registered successfully"}, 201

@blp.route("/login")
class LoginUser(MethodView):
    @blp.arguments(UserLoginSchema)
    def post(self, login_data):
        """Login user and return JWT"""
        user = User.query.filter_by(username=login_data["username"]).first()
        if not user or not user.check_password(login_data["password"]):
            return {"message" : "invalid credentials"}, 401

        #Generate JWT
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "email" : user.email,
                "role" : user.role
            },
            expires_delta=timedelta(minutes=15)
        )
        refresh_token = create_refresh_token(
            identity=str(user.id),
            expires_delta=timedelta(days=7)
        )
        return {"access token" : access_token, "refresh token" : refresh_token}, 200

@blp.route("/logout")
class LogoutUser(MethodView):
    @jwt_required()
    def post(self):
        """Log out user"""
        jti = get_jwt()["jti"]
        revoked_token = RevokedToken(jti=jti)
        db.session.add(revoked_token)
        db.session.commit()
        return {"message" : "Successfully logged out"}, 200

@blp.route("/refresh")
class RefreshToken(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        """Issue a new access token"""
        user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=str(user_id))
        return {"access_token" : new_access_token}, 200

@blp.route("/all")
class AllUsers(MethodView):
    @jwt_required()
    @role_required(["admin"])
    def get(self):
        """Admin only: Get all users"""
        users = User.query.all()
        user_schema = UserSchema(many=True)
        return user_schema.dump(users), 200