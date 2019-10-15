from Resources.validators.base.userLoginParser import userLoginParser


def signupValidator():
    parser = userLoginParser()
    parser.add_argument('name', type=str, required=True, help='name is required')
    args = parser.parse_args(strict=True)