from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint, abort
from flask import current_app as app
from app.extensions import db
from app.models import Warehouse
from app.models.orders import Order
from app.utils.auth_utils import role_required
from schemas.order_schema import OrderSchema, OrderUpdateSchema


blp = Blueprint("Orders", __name__, description="Operations on orders")

@blp.route("/orders")
class OrderList(MethodView):
    @jwt_required()
    @blp.response(200, OrderSchema(many=True))
    def get(self):
        """List all orders"""
        try:
            orders = Order.query.all()
            app.logger.info(f"Fetched {len(orders)} orders successfully.")
            return orders
        except Exception as e:
            app.logger.error(f"Error fetching orders: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["manager", "admin"])
    @blp.arguments(OrderSchema)
    @blp.response(201, OrderSchema)
    def post(self, order_data):
        """Create a new order"""
        try:
            warehouse = Warehouse.query.get(order_data.get("warehouse_id"))
            if not warehouse:
                app.logger.warning(f"Order creation failed: Warehouse ID {order_data.get('warehouse_id')} not found.")
                abort(404, message="Warehouse not found")

            order = Order(**order_data)
            db.session.add(order)
            db.session.commit()
            app.logger.info(f"Order created successfully with ID {order.id}.")
            return order
        except Exception as e:
            app.logger.error(f"Error creating order: {str(e)}")
            abort(500, message="Internal server error")

@blp.route("/orders/<int:order_id>")
class OrderDetail(MethodView):
    @jwt_required()
    @blp.response(200, OrderSchema)
    def get(self, order_id):
        """Get order by ID"""
        try:
            order = Order.query.get_or_404(order_id)
            app.logger.info(f"Fetched order with ID {order_id}.")
            return order
        except Exception as e:
            app.logger.error(f"Error fetching order ID {order_id}: {str(e)}")
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(OrderUpdateSchema)
    @blp.response(200, OrderSchema)
    def put(self, update_data, order_id):
        """Update an order"""
        try:
            order = Order.query.get_or_404(order_id)

            # Check if delivery status is updated
            new_status = update_data.get("delivery_status")
            if new_status == "Delivered" and order.delivery_status != "Delivered":
                warehouse = Warehouse.query.get(order.warehouse_id)
                if warehouse:
                    warehouse.inventory_status += order.bottles_ordered
                    db.session.add(warehouse)
                    app.logger.info(f"Updated inventory for Warehouse ID {order.warehouse_id} due to delivery.")

            # Update order details
            for key, value in update_data.items():
                setattr(order, key, value)
            db.session.commit()
            app.logger.info(f"Order with ID {order_id} updated successfully.")
            return order
        except Exception as e:
            app.logger.error(f"Error updating order ID {order_id}: {str(e)}")
            db.session.rollback()
            abort(500, message="Internal server error")

    @jwt_required()
    @role_required(["admin"])
    @blp.response(200, description="Order deleted")
    def delete(self, order_id):
        """Delete an order"""
        try:
            order = Order.query.get_or_404(order_id)
            db.session.delete(order)
            db.session.commit()
            app.logger.warning(f"Order with ID {order_id} deleted.")
            return {"message": "Order deleted successfully"}, 200
        except Exception as e:
            app.logger.error(f"Error deleting order ID {order_id}: {str(e)}")
            db.session.rollback()
            abort(500, message="Internal server error")