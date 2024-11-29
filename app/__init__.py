from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_smorest import Api
from routes.client_routes import blp as ClientBlueprint


api = Api()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    #Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)

    #Register blueprints
    api.register_blueprint(ClientBlueprint)

    return app
