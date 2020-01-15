"""empty message

Revision ID: 28be733e0bbc
Revises: 
Create Date: 2020-01-13 00:02:23.567096

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '28be733e0bbc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('roles',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=1000), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('name', sa.VARCHAR(length=1000), nullable=False),
    sa.PrimaryKeyConstraint('name')
    )
    op.create_table('users',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('email', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('password', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('avatarUrl', sa.VARCHAR(length=1000), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('blogs',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('subtitle', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('mainImageUrl', sa.VARCHAR(length=1000), nullable=True),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('clap', sa.Integer(), server_default='0', nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['userId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('blog_image',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('path', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('blogId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['blogId'], ['blogs.id'], ),
    sa.PrimaryKeyConstraint('path')
    )
    op.create_table('blogs_tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('blog_id', sa.Integer(), nullable=True),
    sa.Column('tag_name', sa.VARCHAR(length=1000), nullable=True),
    sa.ForeignKeyConstraint(['blog_id'], ['blogs.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['tag_name'], ['tags.name'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('created_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_date', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('deleted', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.VARCHAR(length=1000), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('blogId', sa.Integer(), nullable=False),
    sa.Column('authorId', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['authorId'], ['users.id'], ),
    sa.ForeignKeyConstraint(['blogId'], ['blogs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('comments')
    op.drop_table('blogs_tags')
    op.drop_table('blog_image')
    op.drop_table('users_roles')
    op.drop_table('blogs')
    op.drop_table('users')
    op.drop_table('tags')
    op.drop_table('roles')
    # ### end Alembic commands ###