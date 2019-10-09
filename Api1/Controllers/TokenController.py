from flask import request, jsonify
from flask_jwt_extended import (
    jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)


def configureTokenController(app):
    @app.route('/token/auth', methods=['POST'])
    def login():
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if username != 'test' or password != 'test':
            return jsonify({'login': False}), 401

        # Create the tokens we will be sending back to the user
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)

        # Set the JWTs and the CSRF double submit protection cookies
        # in this response
        resp = jsonify({'login': True})
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        return resp, 200

    @app.route('/token/refresh', methods=['POST'])
    @jwt_refresh_token_required
    def refresh():
        # Create the new access token
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)

        # Set the access JWT and CSRF double submit protection cookies
        # in this response
        resp = jsonify({'refresh': True})
        set_access_cookies(resp, access_token)
        return resp, 200

    @app.route('/token/remove', methods=['POST'])
    def logout():
        resp = jsonify({'logout': True})
        unset_jwt_cookies(resp)
        return resp, 200

    @app.route('/api/example', methods=['GET'])
    @jwt_required
    def protected():
        username = get_jwt_identity()
        return jsonify({'hello': 'from {}'.format(username)}), 200
