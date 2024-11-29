from app import db

class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(20))
    manager_name = db.Column(db.String(80))
    manager_email = db.Column(db.String(80))
    manager_phone = db.Column(db.String(20))
    invoice_details = db.Column(db.String(255))
    inventory_status = db.Column(db.Integer, default=0) #Bottles left in stock

    #Foreign key linking to Client
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False)

    #Relationship with Client
    client = db.relationship("Client", back_populates="warehouses")

    #Relationship with Order
    orders = db.relationship("Order", backpopulates="warehouse")
