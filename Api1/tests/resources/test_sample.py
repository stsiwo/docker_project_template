from utils.util import printObject
from Infrastructure.DataModels.BlogModel import Blog


def test_s2(blogsSeededFixture, exSession):
    print("executing test sample 2")

    queriedBlog = exSession.query(Blog).all()

    printObject(queriedBlog)

    assert 0


def test_s3(blogsSeededFixture, exSession):
    print("executing test sample 2")

    queriedBlog = exSession.query(Blog).all()

    printObject(queriedBlog)

    assert 0


def test_s4(blogsSeededFixture, exSession):

    queriedBlog = exSession.query(Blog).all()

    printObject(queriedBlog)

    assert 0
