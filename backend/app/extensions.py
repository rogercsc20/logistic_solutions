from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_smorest import Api
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
migrate = Migrate()
api = Api()
jwt = JWTManager()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    from .models.revoked_token import RevokedToken
    jti = jwt_payload["jti"]
    return RevokedToken.is_token_revoked(jti)

