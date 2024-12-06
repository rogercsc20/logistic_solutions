from datetime import timedelta
from sqlalchemy import Enum, event
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Session
from app.extensions import db
from app.models.warehouse import Warehouse


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, nullable=False)
    delivery_status = db.Column(db.String(50), default="Pending") #Pending, On_route, Delivered
    bottles_ordered = db.Column(db.Integer, nullable=False)
    delivery_date = db.Column(db.DateTime)
    schedule_payment_date = db.Column(db.DateTime, nullable=True)
    freight_cost = db.Column(db.Float, nullable=False)
    maneuver_cost = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, nullable=False, default=0.0)
    bottle_cost = db.Column(db.Float, nullable=False, default=200.00)
    price_per_bottle = db.Column(db.Float, nullable=False, default=245.00)
    payment_status = db.Column(
        Enum("Pending", "Overdue", "Paid", name="payment_status_enum"),
        default="Pending",
        nullable=False,
    )


    # Foreign ket to warehouse
    warehouse_id = db.Column(db.Integer, db.ForeignKey("warehouses.id"), nullable=False)

    # Relationship with warehouse
    warehouse = db.relationship("Warehouse", back_populates="orders")

    # Calculated fields using hybrid properties
    @hybrid_property
    def boxes_ordered(self):
        return self.bottles_ordered / 12

    @hybrid_property
    def total_price(self):
        base_price = self.bottles_ordered * self.price_per_bottle
        return base_price - self.discount if self.discount > 0 else base_price

    @hybrid_property
    def profit(self):
        gross_profit = self.bottles_ordered * (self.price_per_bottle - self.bottle_cost)
        return gross_profit - self.freight_cost - self.maneuver_cost

    @hybrid_property
    def computed_schedule_payment_date(self):
        """Calculate schedule payment date dynamically if not set."""
        if self.schedule_payment_date:
            return self.schedule_payment_date
        if self.delivery_date:
            return self.delivery_date + timedelta(days=15)
        return None

#Automatically update inventory status
def update_inventory_status_on_insert(mapper, connection, target):
    """Update Inventory when an order is created with 'Delivered' status """
    if target.delivery_status == "Delivered":
        session = Session.object_session(target)
        warehouse = session.query(Warehouse).get(target.warehouse_id)
        if warehouse:
            warehouse.inventory_status += target.bottles_ordered
            session.add(warehouse)

#Automatically update inventory status based on new orders delivered
def update_inventory_status(mapper, connection, target):
    """Update inventory status when order delivery status changes"""
    session = Session.object_session(target)
    warehouse = session.query(Warehouse).get(target.warehouse_id)

    if not warehouse:
        return

    if target.delivery_status == "Delivered":
        warehouse.inventory_status += target.bottles_ordered
    elif target.delivery_status != "Delivered" and target.delivery_status in session.dirty:
        warehouse.inventory_status -= target.bottles_ordered

    session.add(warehouse)

event.listen(Order, "after_insert", update_inventory_status_on_insert)
event.listen(Order, "after_update", update_inventory_status)


