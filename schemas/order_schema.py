from marshmallow import Schema, fields, validate, EXCLUDE

class OrderSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    order_date = fields.DateTime(required=True)
    delivery_status = fields.Str(
        validate=validate.OneOf(["Pending", "On_route", "Delivered"]),
        default="Pending"
    )
    bottles_ordered = fields.Int(required=True)
    delivery_date = fields.DateTime(allow_none=True)
    schedule_payment_date = fields.DateTime(allow_none=True)
    freight_cost = fields.Float(required=True)
    maneuver_cost = fields.Float(required=True)
    discount = fields.Float(default=0.0)
    bottle_cost = fields.Float(required=True, default=200.00)
    price_per_bottle = fields.Float(required=True, default=245.00)
    payment_status = fields.Str(
        validate=validate.OneOf(["Pending", "Overdue", "Paid"]),
        default="Pending"
    )
    warehouse = fields.Nested("WarehouseSchema", exclude=("orders",), dump_only=True)
    warehouse_id = fields.Int(required=True)

    # Calculated fields (dump_only means they are read-only)
    boxes_ordered = fields.Float(dump_only=True)
    total_price = fields.Float(dump_only=True)
    profit = fields.Float(dump_only=True)
    computed_schedule_payment_date = fields.DateTime(dump_only=True)


class OrderUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    delivery_status = fields.Str(
        validate=validate.OneOf(["Pending", "On_route", "Delivered"]),
        required=False
    )
    bottles_ordered = fields.Int(required=False)
    delivery_date = fields.DateTime(allow_none=True)
    schedule_payment_date = fields.DateTime(allow_none=True)
    freight_cost = fields.Float(required=False)
    maneuver_cost = fields.Float(required=False)
    discount = fields.Float(required=False)
    bottle_cost = fields.Float(required=False)
    price_per_bottle = fields.Float(required=False)
    payment_status = fields.Str(
        validate=validate.OneOf(["Pending", "Overdue", "Paid"]),
        required=False
    )
    warehouse_id = fields.Int(required=False)