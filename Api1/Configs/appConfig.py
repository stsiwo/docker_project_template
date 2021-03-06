from Configs.app import app
from flask_cors import CORS
from Configs.extensions import (
        api, db, jwt, migrate, ma, bcrypt, mail
        )
from commands import (
        seed_cli,
        app_cli
        )


# the order must be kept
def configureApp(config_object="Configs.settings"):

    # config
    app.config.from_object(config_object)

    # debugger (only staging and production)
    app.debug = app.config.get("DEBUG", True)

    app.logger.info("*** app config ***\n")
    for key in app.config:
        app.logger.info('{}: {}'.format(key, app.config.get(key)))

    # commands
    app.cli.add_command(seed_cli)
    app.cli.add_command(app_cli)

    # ygmail config (register and connection)
    import Configs.ygmailConfig
    # import all model class of DataModels directory
    # spec says "import *" is anti-pattern but other developers does
    # not need to know all modules under DataModels.
    # this is for just helping 'migration' can detect any change in data models
    import Infrastructure.DataModels.configureDataModels
    # import all routes
    import Resources.configureRoute

    # set error response handlers
    import exceptions.registerErrorHandlers
    # jwt claim loader
    import Resources.claimLoader
    # aop
    import Aop.registerAops
    # extensions
    # ============================================================
    # IMPORTANT: adding resources must be done before init_app!!!!
    # ============================================================
    api.init_app(app)
    # error message handling by flask restapi so you don't need to write try/except on every endpoint
    # ============================================================
    # IMPORTANT: db.init_app must be before ma.init_app
    # ============================================================
    bcrypt.init_app(app)
    # db must be before ma
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # cores
    # withCredentials in client: only one domain is allowed to communicate
    # CORS(app, origins=[app.config['CLIENT_SPA_URL'] + '/*'])
    CORS(app, origins=[app.config['CLIENT_SPA_URL'] + "/*"])
    # temply available all origin. fix this before production
    # CORS(app, origins=['*'])

    return app


main = configureApp()
