from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from flask import current_app as app
from flask_smorest.error_handler import ErrorSchema

from app.extensions import db
from app.models import Client
from app.utils.auth_utils import role_required
from schemas.client_schema import ClientSchema, ClientUpdateSchema


blp = Blueprint("Clients", __name__, description="Operations on clients")


@blp.route("/clients")
class ClientList(MethodView):
    @jwt_required()
    @blp.response(200, ClientSchema(many=True))
    def get(self):
        """List all clients"""
        try:
            clients = Client.query.order_by(Client.id.asc()).all()
            app.logger.info("Fetched all clients")
            return clients
        except Exception as e:
            app.logger.error(f"Error fetching clients: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(ClientSchema)
    @blp.response(201, ClientSchema)
    @blp.alt_response(400, schema=ErrorSchema)
    def post(self, client_data):
        """Create a new client"""
        duplicate_client = Client.query.filter(
            (Client.name == client_data["name"]) |
            (Client.email == client_data["email"])
        ).first()

        if duplicate_client:
            conflict_field = "name" if duplicate_client.name == client_data["name"] else "email"
            app.logger.warning(
                f"Attempted to add an existing client with {conflict_field}: {client_data[conflict_field]}"
            )
            abort(400, message=f"Client with this {conflict_field} already exists")


        try:
            client = Client(**client_data)
            db.session.add(client)
            db.session.commit()
            app.logger.info(f"New client created successfully: {client.name}")
            return client
        except Exception as e:
            # Handle unexpected exceptions
            app.logger.error(f"Error creating client: {str(e)}")
            abort(500, message="Internal server error")

@blp.route("/clients/<int:client_id>")
class ClientDetail(MethodView):
    @jwt_required()
    @blp.response(200, ClientSchema)
    def get(self, client_id):
        """Get client by id"""
        try:
            client = Client.query.get_or_404(client_id)
            app.logger.info("Client retrieved by ID")
            return client
        except Exception as e:
            app.logger.error(f"Error while fetching client: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(ClientUpdateSchema)
    @blp.response(200, ClientSchema)
    def put(self, update_data, client_id):
        """Update a client"""
        try:
            client = Client.query.get_or_404(client_id)
            for key, value in update_data.items():
                setattr(client, key, value)
            db.session.commit()
            app.logger.info(f"Client {client.name} updated successfully")
            return client
        except Exception as e:
            app.logger.error(f"Error updating client ID {client_id}: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin"])
    def delete(self, client_id):
        """Delete a client"""
        try:
            client = Client.query.get_or_404(client_id)
            db.session.delete(client)
            db.session.commit()
            app.logger.warning(f"Client {client.name} deleted successfully")
            return {"message" : "Client deleted"}, 200
        except Exception as e:
            app.logger.error(f"Error deleting client ID {client_id}: {str(e)}")
            abort(50, message="Internal server error")

