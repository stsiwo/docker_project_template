from utils.util import printObject
from exceptions.EmailServiceException import EmailServiceException
import pytest
from Infrastructure.DataModels.UserModel import User
from Configs.extensions import mail

# POST /user/forgot-password (request for forgot password)
# fp_post01: 400 code for invalid input
# fp_post02: 404 code for no email address is registerd in db
# fp_post03: 500 code for internal email service exception
# fp_post04: 202 code for successfully sending email with password-reset link


@pytest.mark.forgot_password_src
@pytest.mark.forgot_password_src_post
def test_fp_post01_forgot_password_post_endpoint_should_return_400_code_for_invalid_input(client):

    response = client.post(
            '/forgot-password'
            )
    assert response.status_code == 400


@pytest.mark.forgot_password_src
@pytest.mark.forgot_password_src_post
def test_fp_post02_forgot_password_post_endpoint_should_return_404_code_since_no_such_an_email_address_in_db(client, httpHeaders):

    response = client.post(
            '/forgot-password',
            json={
                'email': 'no-exist@email.com'
                },
            headers=httpHeaders)
    assert response.status_code == 404


@pytest.mark.forgot_password_src
@pytest.mark.forgot_password_src_post
def test_fp_post03_forgot_password_post_endpoint_should_return_500_code_since_internal_email_service_exception_is_thrown(client, httpHeaders, patchedYgmailSendFuncWithThrowException, usersSeededFixture, exSession):

    userEmail = usersSeededFixture.email

    response = client.post(
            '/forgot-password',
            json={
                'email': userEmail
                },
            headers=httpHeaders)

    assert response.status_code == 500
    patchedYgmailSendFuncWithThrowException.assert_called


@pytest.mark.forgot_password_src
@pytest.mark.forgot_password_src_post
def test_fp_post04_forgot_password_post_endpoint_should_return_202_code_for_successfully_email_was_sent(client, httpHeaders, usersSeededFixture, exSession):

    userEmail = usersSeededFixture.email

    with mail.record_messages() as outbox:
        response = client.post(
                '/forgot-password',
                json={
                    'email': userEmail
                    },
                headers=httpHeaders)

        printObject(response.data)
        assert response.status_code == 202
        # email assertion
        assert len(outbox) == 1
        assert outbox[0].subject == "Your Password Reset Request"
        assert userEmail in outbox[0].recipients
