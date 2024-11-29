from flask.views import MethodView
from flask_smorest import Blueprint
from app import db
from models.client import Client
from schemas import ClientSchema, ClientUpdateSchema

blp = Blueprint("Clients", __name__, description="Operations on clients")

@blp.route("/clients")
class ClientList(MethodView):
    @blp.response(200, ClientSchema(many=True))
    def get(self):
        """List all clients"""
        return Client.query.all()

    @blp.arguments(ClientSchema)
    @blp.response(201, ClientSchema)
    def post(self, client_data):
        """Create a new client"""
        client = Client(**client_data)
        db.session.add(client)
        db.session.commit()
        return client

@blp.route("/clients/<int:client_id>")
class ClientDetail(MethodView):
    @blp.response(200, ClientSchema)
    def get(self, client_id):
        """Get client by id"""
        client = Client.query.get_or_404(client_id)
        return client

    @blp.arguments(ClientUpdateSchema)
    @blp.response(200, ClientSchema)
    def put(self, update_data, client_id):
        """Update a client"""
        client = Client.query.get_or_404(client_id)
        for key, value in update_data.items():
            setattr(client, key, value)
        db.session.commit()
        return client

    def delete(self, client_id):
        """Delete a client"""
        client = Client.query.get_or_404(client_id)
        db.session.delete(client)
        db.session.delete(client)
        db.session.commit()
        return {"message" : "Client deleted"}, 200

