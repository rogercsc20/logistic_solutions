from marshmallow import Schema, fields

class ClientSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    phone = fields.Str()

class ClientUpdateSchema(Schema):
    name = fields.Str()
    email = fields.Email()
    phone = fields.Str()