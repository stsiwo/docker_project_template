from Configs.app import app
from Configs.ygmailConfig import yag
from exceptions.EmailServiceException import EmailServiceException
from urllib.parse import urljoin
from utils.util import printObject


class EmailService(object):

    def __init__(self):
        self._client = yag
        pass

    def sendForgotPasswordEmail(self, to: str, token: str) -> None:
        app.logger.info("start email service")
        print("start email service")

        subject = "Password Reset Request"

        clientResetPasswordUrl = urljoin(app.config['CLIENT_SPA_URL'], '/password-reset?token={}'.format(token))

        html = '<a href="{}">Reset Your Password</a>'.format(clientResetPasswordUrl)

        try:
            self._client.send(to=to, subject=subject, contents=html)
        except Exception as e:
            raise EmailServiceException()