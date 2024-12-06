from marshmallow import Schema, fields, EXCLUDE

class WarehouseSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    address = fields.Str(required=True)
    phone = fields.Str(allow_none=True)
    manager_name = fields.Str(allow_none=True)
    manager_email = fields.Str(allow_none=True)
    manager_phone = fields.Str(allow_none=True)
    invoice_details = fields.Str(allow_none=True)
    inventory_status = fields.Int(default=0)

    client_id = fields.Int(required=True)
    orders = fields.Nested("OrderSchema", exclude=("warehouse",), many=True, dump_only=True)

class WarehouseUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    # Optional fields for updating a warehouse
    address = fields.Str(allow_none=True)
    phone = fields.Str(allow_none=True)
    manager_name = fields.Str(allow_none=True)
    manager_email = fields.Str(allow_none=True)
    manager_phone = fields.Str(allow_none=True)
    invoice_details = fields.Str(allow_none=True)
    inventory_status = fields.Int(allow_none=True)

    client_id = fields.Int(allow_none=True)

