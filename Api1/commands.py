from Configs.app import app
from flask.cli import AppGroup
from Configs.extensions import db
from Infrastructure.DataModels.RoleModel import Role
from Infrastructure.DataModels.TagModel import Tag
from Infrastructure.DataModels.UserModel import User
from Infrastructure.DataModels.BlogModel import Blog
from click import ClickException
from tests.data.generators.BlogGenerator import generateBlogModelV2


seed_cli = AppGroup('seed')
app_cli = AppGroup('app')


def check_if_exists(model, **kwargs):
    return db.session.query(model).filter_by(**kwargs).first()


@seed_cli.command('roles')
def add_roles():
    if check_if_exists(Role, name='admin') is None:
        db.session.add(Role(name='admin'))
        db.session.add(Role(name='member'))
        db.session.commit()


@seed_cli.command('tags')
def add_tags():
    if check_if_exists(Tag, name='ui') is None:
        db.session.add(Tag(name='ui'))
        db.session.add(Tag(name='frontend'))
        db.session.add(Tag(name='backend'))
        db.session.add(Tag(name='css'))
        db.session.add(Tag(name='sql'))
        db.session.add(Tag(name='python'))
        db.session.add(Tag(name='typescript'))
        db.session.add(Tag(name='react'))
        db.session.add(Tag(name='angular'))
        db.session.add(Tag(name='sqlalchemy'))
        db.session.add(Tag(name='php'))
        db.session.add(Tag(name='laravel'))
        db.session.add(Tag(name='flask'))
        db.session.add(Tag(name='django'))
        db.session.add(Tag(name='oop'))
        db.session.add(Tag(name='designpattern'))
        db.session.add(Tag(name='nodejs'))
        db.session.add(Tag(name='csharp'))
        db.session.add(Tag(name='autofac'))
        db.session.add(Tag(name='unittesting'))
        db.session.add(Tag(name='mock'))
        db.session.add(Tag(name='pytest'))
        db.session.add(Tag(name='webpack'))
        db.session.add(Tag(name='js'))
        db.session.commit()


@seed_cli.command('test-users')
def add_test_users():
    if check_if_exists(User, name='test member') is None:
        roles = db.session.query(Role).all()

        if len(roles) == 0:
            raise ClickException("run 'flask seed roles' first")

        memberRole = [role for role in roles if role.name == 'member']
        adminRole = [role for role in roles if role.name == 'admin']

        db.session.add(
                User(
                    name="test member",
                    email="test@member.com",
                    password="test_member",
                    roles=memberRole
                    )
                )

        # admin
        db.session.add(
                User(
                    name="test admin",
                    email="test@admin.com",
                    password="test_admin",
                    roles=adminRole
                    )
                )

        db.session.add(
                User(
                    name="test member1",
                    email="test@member1.com",
                    password="test_member1",
                    roles=memberRole
                    )
                )
        db.session.add(
                User(
                    name="test member2",
                    email="test@member2.com",
                    password="test_member2",
                    roles=memberRole
                    )
                )
        db.session.add(
                User(
                    name="test member3",
                    email="test@member3.com",
                    password="test_member3",
                    roles=memberRole
                    )
                )
        db.session.add(
                User(
                    name="test member4",
                    email="test@member4.com",
                    password="test_member4",
                    roles=memberRole
                    )
                )

        db.session.add(
                User(
                    name="test member5",
                    email="test@member5.com",
                    password="test_member5",
                    roles=memberRole
                    )
                )

        db.session.commit()


@seed_cli.command('test-blogs')
def add_test_blogs():
    if check_if_exists(Blog, id="1") is None:
        memberUser = db.session.query(User).filter(User.name == 'test member').first()
        adminUser = db.session.query(User).filter(User.name == 'test admin').first()
        memberUser1 = db.session.query(User).filter(User.name == 'test member1').first()

        for i in range(100):
            db.session.add(generateBlogModelV2(user=memberUser))

        for i in range(100):
            db.session.add(generateBlogModelV2(user=adminUser))

        for i in range(3):
            db.session.add(generateBlogModelV2(user=memberUser1))

        db.session.commit()


@seed_cli.command('delete-blogs')
def delete_test_blogs():
    db.session.query(Blog).delete()
    db.session.commit()


@app_cli.command('show-config')
def show_config():
    print(app.config)
