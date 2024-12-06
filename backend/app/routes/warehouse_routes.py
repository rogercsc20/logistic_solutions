from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from flask import current_app as app, request
from flask_smorest.error_handler import ErrorSchema

from app.models import Client
from app.models import Warehouse
from app.utils.auth_utils import role_required
from schemas.warehouse_schema import WarehouseSchema, WarehouseUpdateSchema
from app import db

blp = Blueprint("Warehouse", __name__, description="Operations on warehouses")

@blp.route("/warehouses")
class WarehouseList(MethodView):
    @jwt_required()
    @blp.response(200, WarehouseSchema(many=True))
    def get(self):
        """list all warehouses with filtering"""
        try:
            # Query parameters
            client_id = request.args.get("client_id")
            manager_name = request.args.get("manager_name")
            location = request.args.get("location")
            sort_by = request.args.get("sort_by", "created_at")
            order = request.args.get("order", "asc")
            search = request.args.get("search")
            page = int(request.args.get("page", 1))
            page_size = int(request.args.get("page_size", 10))

            # Build query dynamically
            query = Warehouse.query
            if client_id:
                query = query.filter(Warehouse.client_id == client_id)
            if manager_name:
                query = query.filter(Warehouse.manager_name.ilike(f"%{manager_name}%"))
            if location:
                query = query.filter(Warehouse.address.ilike(f"%{location}%"))
            if search:
                query = query.filter(
                    Warehouse.manager_name.ilike(f"%{search}%") |
                    Warehouse.address.ilike(f"%{search}%")
                )
            if sort_by and hasattr(Warehouse, sort_by):
                if order == "desc":
                    query = query.order_by(getattr(Warehouse, sort_by).desc())
                else:
                    query = query.order_by(getattr(Warehouse, sort_by))

            # Pagination
            warehouses = query.paginate(page=page, per_page=page_size).items
            return warehouses
        except Exception as e:
            app.logger.error(f"Error fetching warehouses: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(WarehouseSchema)
    @blp.response(201, WarehouseSchema)
    @blp.alt_response(400, schema=ErrorSchema)
    def post(self, warehouse_data):
        """Create a new warehouse"""
        try:
            warehouse_duplicate = Warehouse.query.filter(Warehouse.address == warehouse_data["address"]).first()
            if warehouse_duplicate:
                app.logger.warning("Attempt to create a warehouse with duplicate address.")
                abort(400, message="Warehouse with that location already exists")

            client_id = warehouse_data.get("client_id")
            if not Client.query.get(client_id):
                app.logger.warning(f"Attempt to create a warehouse with non-existent client ID: {client_id}")
                abort(404, message="Client ID doesn't exist")

            warehouse = Warehouse(**warehouse_data)
            db.session.add(warehouse)
            db.session.commit()
            app.logger.info(f"Warehouse created successfully: {warehouse.id}")
            return warehouse
        except Exception as e:
            app.logger.error(f"Error creating warehouse: {str(e)}")
            db.session.rollback()
            abort(500, message="An error occurred while creating the warehouse.")


@blp.route("/warehouses/<int:warehouse_id>")
class WarehouseDetail(MethodView):
    @jwt_required()
    @blp.response(200, WarehouseSchema)
    def get(self, warehouse_id):
        """Get warehouse by id"""
        try:
            warehouse = Warehouse.query.get_or_404(warehouse_id)
            app.logger.info(f"Fetched warehouse with ID: {warehouse_id}")
            return warehouse
        except Exception as e:
            app.logger.error(f"Error fetching warehouse ID {warehouse_id}: {str(e)}")
            abort(500, message="An error occurred while fetching the warehouse.")

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(WarehouseUpdateSchema)
    @blp.response(200, WarehouseSchema)
    def put(self, update_data, warehouse_id):
        """Update a warehouse"""
        try:
            warehouse = Warehouse.query.get_or_404(warehouse_id)
            for key, value in update_data.items():
                setattr(warehouse, key, value)
            db.session.commit()
            app.logger.info(f"Warehouse with ID {warehouse_id} updated successfully.")
            return warehouse
        except Exception as e:
            app.logger.error(f"Error updating warehouse ID {warehouse_id}: {str(e)}")
            db.session.rollback()
            abort(500, message="An error occurred while updating the warehouse.")

    @jwt_required()
    @role_required(["admin"])
    @blp.response(200, description="Warehouse deleted")
    def delete(self, warehouse_id):
        """Delete a warehouse"""
        try:
            warehouse = Warehouse.query.get_or_404(warehouse_id)
            db.session.delete(warehouse)
            db.session.commit()
            app.logger.warning(f"Warehouse with ID {warehouse_id} deleted successfully.")
            return {"message": "Warehouse deleted successfully"}, 200
        except Exception as e:
            app.logger.error(f"Error deleting warehouse ID {warehouse_id}: {str(e)}")
            db.session.rollback()
            abort(500, message="An error occurred while deleting the warehouse.")
