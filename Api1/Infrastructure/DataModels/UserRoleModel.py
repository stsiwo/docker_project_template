from Configs.extensions import db


roles = db.Table(
        'users_roles',
        db.Column(
            'user_id',
            db.Integer,
            db.ForeignKey('users.id'),
            primary_key=True
        ),
        db.Column(
            'role_id',
            db.Integer,
            db.ForeignKey('roles.id'),
            primary_key=True
            ),
)
