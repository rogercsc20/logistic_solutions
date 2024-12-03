from app.extensions import db

class RevokedToken(db.Model):
    __tablename__ = "revoked_tokens"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)

    def __init__(self, jti):
        self.jti = jti

    @classmethod
    def is_token_revoked(cls, jti):
        return db.session.query(cls).filter_by(jti=jti).scalar() is not None