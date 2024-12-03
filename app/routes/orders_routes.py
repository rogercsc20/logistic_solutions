from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint
from app.extensions import db
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
        return Order.query.all()

    @jwt_required()
    @role_required(["manager", "admin"])
    @blp.arguments(OrderSchema)
    @blp.response(201, OrderSchema)
    def post(self, order_data):
        order = Order(**order_data)
        db.session.add(order)
        db.session.commit()
        return order

@blp.route("/orders/<int:order_id>")
class OrderDetail(MethodView):
    @jwt_required()
    @blp.response(200, OrderSchema)
    def get(self, order_id):
        """Get order by ID"""
        order = Order.query.get_or_404(order_id)
        return order

    @jwt_required()
    @role_required(["admin", "manager"])
    @blp.arguments(OrderUpdateSchema)
    @blp.response(200, OrderSchema)
    def put(self, update_data, order_id):
        """Update an order"""
        order = Order.query.get_or_404(order_id)
        for key, value in update_data.items():
            setattr(order, key, value)
        db.session.commit()
        return order

    @jwt_required()
    @role_required(["admin"])
    @blp.response(200, description="Order deleted")
    def delete(self, order_id):
        order = Order.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return {"message" : "Order deleted successfully"}, 200
