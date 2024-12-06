from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, api, jwt
from app.routes.client_routes import blp as ClientBlueprint
from app.routes.orders_routes import blp as OrderBlueprint
from app.routes.warehouse_routes import blp as WarehouseBlueprint
from app.routes.user_routes import blp as UserBlueprint
from logging_config import setup_logging



def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.Config")

    CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

    setup_logging(app.logger)

    #Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    jwt.init_app(app)


    #Register blueprints
    api.register_blueprint(ClientBlueprint)
    api.register_blueprint(OrderBlueprint)
    api.register_blueprint(WarehouseBlueprint)
    api.register_blueprint(UserBlueprint)

    return app
