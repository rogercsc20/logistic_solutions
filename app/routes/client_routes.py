from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from app.extensions import db
from app.models.client import Client
from app.utils.auth_utils import role_required
from schemas.client_schema import ClientSchema, ClientUpdateSchema
from datetime import timedelta


blp = Blueprint("Clients", __name__, description="Operations on clients")


@blp.route("/clients")
class ClientList(MethodView):
    @jwt_required()
    @blp.response(200, ClientSchema(many=True))
    def get(self):
        """List all clients"""
        return Client.query.all()

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(ClientSchema)
    @blp.response(201, ClientSchema)
    def post(self, client_data):
        """Create a new client"""
        duplicate_client = Client.query.filter(
            (Client.name == client_data["name"]) |
            (Client.email == client_data["email"])
        ).first()

        if duplicate_client:
            conflict_field = "name" if duplicate_client.name == client_data["name"] else "email"
            abort(400, message=f"Client with this {conflict_field} already exists")

        client = Client(**client_data)
        db.session.add(client)
        db.session.commit()
        return client

@blp.route("/clients/<int:client_id>")
class ClientDetail(MethodView):
    @jwt_required()
    @blp.response(200, ClientSchema)
    def get(self, client_id):
        """Get client by id"""
        client = Client.query.get_or_404(client_id)
        return client

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(ClientUpdateSchema)
    @blp.response(200, ClientSchema)
    def put(self, update_data, client_id):
        """Update a client"""
        client = Client.query.get_or_404(client_id)
        for key, value in update_data.items():
            setattr(client, key, value)
        db.session.commit()
        return client

    @jwt_required()
    @role_required(["admin"])
    def delete(self, client_id):
        """Delete a client"""
        client = Client.query.get_or_404(client_id)
        db.session.delete(client)
        db.session.commit()
        return {"message" : "Client deleted"}, 200

