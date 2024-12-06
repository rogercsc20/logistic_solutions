from marshmallow import Schema, fields, validate, EXCLUDE

class UserSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    role = fields.Str(
        validate=validate.OneOf(["admin", "manager", "user"]),
        missing="user"
    )

class UserLoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)