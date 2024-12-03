"""Added role to user

Revision ID: 04b086c4a11c
Revises: 80a012203686
Create Date: 2024-12-02 02:22:40.978520

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM

# revision identifiers, used by Alembic.
revision = '04b086c4a11c'
down_revision = '80a012203686'
branch_labels = None
depends_on = None

def upgrade():
    # Define the ENUM type
    role_enum = ENUM('admin', 'manager', 'user', name='role_enum', create_type=False)
    role_enum.create(op.get_bind(), checkfirst=True)

    # Add the USING clause to convert existing data to the new ENUM type
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.execute("""
            ALTER TABLE users ALTER COLUMN role TYPE role_enum
            USING role::text::role_enum
        """)
    # ### end Alembic commands ###


def downgrade():
    # Revert the ENUM type to VARCHAR
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.execute("""
            ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20)
            USING role::text
        """)
    # Drop the ENUM type
    op.execute("DROP TYPE role_enum")
    # ### end Alembic commands ###
