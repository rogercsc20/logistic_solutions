"""initial here

Revision ID: f4614805dcde
Revises: 
Create Date: 2024-12-06 04:53:33.805878

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f4614805dcde'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('clients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=80), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name')
    )
    op.create_table('revoked_tokens',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('jti')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=256), nullable=False),
    sa.Column('role', sa.Enum('admin', 'manager', 'user', name='role_enum'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('warehouses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=150), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('manager_name', sa.String(length=80), nullable=True),
    sa.Column('manager_email', sa.String(length=80), nullable=True),
    sa.Column('manager_phone', sa.String(length=20), nullable=True),
    sa.Column('invoice_details', sa.String(length=255), nullable=True),
    sa.Column('inventory_status', sa.Integer(), nullable=True),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('address')
    )
    op.create_table('orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('order_date', sa.DateTime(), nullable=False),
    sa.Column('delivery_status', sa.String(length=50), nullable=True),
    sa.Column('bottles_ordered', sa.Integer(), nullable=False),
    sa.Column('delivery_date', sa.DateTime(), nullable=True),
    sa.Column('schedule_payment_date', sa.DateTime(), nullable=True),
    sa.Column('freight_cost', sa.Float(), nullable=False),
    sa.Column('maneuver_cost', sa.Float(), nullable=False),
    sa.Column('discount', sa.Float(), nullable=False),
    sa.Column('bottle_cost', sa.Float(), nullable=False),
    sa.Column('price_per_bottle', sa.Float(), nullable=False),
    sa.Column('payment_status', sa.Enum('Pending', 'Overdue', 'Paid', name='payment_status_enum'), nullable=False),
    sa.Column('warehouse_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['warehouse_id'], ['warehouses.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('orders')
    op.drop_table('warehouses')
    op.drop_table('users')
    op.drop_table('revoked_tokens')
    op.drop_table('clients')
    # ### end Alembic commands ###
