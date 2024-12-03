from pyexpat.errors import messages

from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from app.models.warehouse import Warehouse
from app.utils.auth_utils import role_required
from schemas.warehouse_schema import WarehouseSchema, WarehouseUpdateSchema
from app.extensions import db

blp = Blueprint("Warehouse", __name__, description="Operations on warehouses")

@blp.route("/warehouses")
class WarehouseList(MethodView):
    @jwt_required()
    @blp.response(200, WarehouseSchema(many=True))
    def get(self):
        """list all warehouses"""
        return Warehouse.query.all()

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(WarehouseSchema)
    @blp.response(201, WarehouseSchema)
    def post(self, warehouse_data):
        """Create a new warehouse"""
        warehouse_duplicate = Warehouse.query.filter(Warehouse.address == warehouse_data["address"]).first()
        if warehouse_duplicate:
            abort(400, message="Warehouse with that location already exists")

        warehouse = Warehouse(**warehouse_data)
        db.session.add(warehouse)
        db.session.commit()
        return warehouse

@blp.route("/warehouses/<int:warehouse_id>")
class WarehouseDetail(MethodView):
    @jwt_required()
    @blp.response(200, WarehouseSchema)
    def get(self, warehouse_id):
        """Get warehouse by id"""
        warehouse = Warehouse.query.get_or_404(warehouse_id)
        return warehouse

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(WarehouseUpdateSchema)
    @blp.response(200, WarehouseSchema)
    def put(self, update_data, warehouse_id):
        """Update a warehouse"""
        warehouse = Warehouse.query.get_or_404(warehouse_id)
        for key, value in update_data.items():
            setattr(warehouse, key, value)
        db.session.commit()
        return warehouse

    @jwt_required()
    @role_required(["admin"])
    @blp.response(200, description="Warehouse deleted")
    def delete(self, warehouse_id):
        warehouse = Warehouse.query.get_or_404(warehouse_id)
        db.session.delete(warehouse)
        db.session.commit()
        return {"message" : "Warehouse deleted"}, 200