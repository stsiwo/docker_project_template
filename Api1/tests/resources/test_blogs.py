from utils.util import printObject, decodeResponseByteJsonToDictionary
from Infrastructure.DataModels.UserModel import User
from Infrastructure.DataModels.BlogModel import Blog
import pytest
import os


@pytest.mark.blogs_src
@pytest.mark.blogs_src_get
def test_b01_blogs_get_endpoint_should_return_404_since_no_blogs_data(client):

    response = client.get('/blogs')
    assert 404 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_get
def test_b02_blogs_get_endpoint_should_return_202(client, blogsSeededFixture):

    response = client.get('/blogs')
    assert 200 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_get
def test_b03_blogs_get_endpoint_should_return_202_and_blogs_json(client, blogsSeededFixture):

    response = client.get('/blogs')
    assert 200 == response.status_code

    data = decodeResponseByteJsonToDictionary(response.data)

    assert data is not None

    for blog in data['data']:
        assert blog['id'] is not None


@pytest.mark.blogs_src
@pytest.mark.blogs_src_get
def test_b04_blogs_get_endpoint_should_return_202_and_blogs_json_with_user_dependencies(client, blogsSeededFixture):

    response = client.get('/blogs')
    assert 200 == response.status_code

    data = decodeResponseByteJsonToDictionary(response.data)

    assert data is not None

    for blog in data['data']:
        assert blog['user']['id'] is not None


@pytest.mark.blogs_src
@pytest.mark.blogs_src_get
def test_b041_blogs_get_endpoint_should_return_queried_blogs(client, blogsSeededFixture):

    response = client.get('/blogs?limit=30&page=1&tags=js&tags=webpack')
    assert 200 == response.status_code

    data = decodeResponseByteJsonToDictionary(response.data)

    assert data is not None

    for blog in data['data']:
        assert blog['id'] is not None


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b05_blogs_put_endpoint_should_return_401_code_since_unauthorized_access(client, database, application, multipartHttpHeaders):

    response = client.put('/blogs/1')
    assert 401 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b06_blogs_put_endpoint_should_allow_authed_user_to_get_404_code_since_target_blog_does_not_exist(authedClient, database, application, multipartHttpHeaders, testBlogDataWithMainImage):

    csrf_token = [cookie.value for cookie in authedClient.cookie_jar if cookie.name == 'csrf_access_token'][0]
    multipartHttpHeaders['X-CSRF-TOKEN'] = csrf_token

    response = authedClient.put(
            '/blogs/{}'.format(12342),
            data=testBlogDataWithMainImage,
            headers=multipartHttpHeaders
            )

    assert 404 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b07_blogs_put_endpoint_should_allow_authed_user_to_get_400_code_since_input_is_invalid(authedClient, database, application, multipartHttpHeaders):

    csrf_token = [cookie.value for cookie in authedClient.cookie_jar if cookie.name == 'csrf_access_token'][0]
    multipartHttpHeaders['X-CSRF-TOKEN'] = csrf_token

    response = authedClient.put(
            '/blogs/{}'.format(12342),
            data={
                'content': 'updated_title'
                },
            headers=multipartHttpHeaders
            )

    assert 400 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b08_blogs_put_endpoint_should_allow_authed_user_to_get_200_code(authedClientWithBlogSeeded, database, application, multipartHttpHeaders, testBlogData):

    blogId = None

    with application.app_context():
        blog = database.session.query(Blog).join(Blog.user).filter(User.email == 'test@test.com').first()
        blogId = blog.id

    csrf_token = [cookie.value for cookie in authedClientWithBlogSeeded.cookie_jar if cookie.name == 'csrf_access_token'][0]
    multipartHttpHeaders['X-CSRF-TOKEN'] = csrf_token

    response = authedClientWithBlogSeeded.put(
            '/blogs/{}'.format(blogId),
            data=testBlogData,
            headers=multipartHttpHeaders
            )

    assert 200 == response.status_code


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b09_blogs_put_endpoint_should_allow_authed_user_to_return_updated_blog(authedClientWithBlogSeeded, database, application, multipartHttpHeaders):

    blogId = None

    with application.app_context():
        blog = database.session.query(Blog).join(Blog.user).filter(User.email == 'test@test.com').first()
        blogId = blog.id

    csrf_token = [cookie.value for cookie in authedClientWithBlogSeeded.cookie_jar if cookie.name == 'csrf_access_token'][0]
    multipartHttpHeaders['X-CSRF-TOKEN'] = csrf_token

    response = authedClientWithBlogSeeded.put(
            '/blogs/{}'.format(blogId),
            data={
                'title': 'updated_title',
                'subtitle': 'updated_subtitle',
                'content': 'updated_content'
                },
            headers=multipartHttpHeaders
            )

    printObject(response)

    data = decodeResponseByteJsonToDictionary(response.data)

    assert 200 == response.status_code
    assert 'updated_title' == data['title']
    assert 'updated_subtitle' == data['subtitle']
    assert 'updated_content' == data['content']


@pytest.mark.blogs_src
@pytest.mark.blogs_src_put
def test_b10_blogs_put_endpoint_should_allow_authed_user_to_return_updated_blog_with_image(authedClientWithBlogSeeded, database, application, multipartHttpHeaders, setupTempUploadDirWithImageFile, testFileStorage):

    blogId = None
    authUser = None

    with application.app_context():
        authUser = database.session.query(User).filter(User.email == 'test@test.com').first()
        blog = database.session.query(Blog).join(Blog.user).filter(User.email == 'test@test.com').first()
        blogId = blog.id

    csrf_token = [cookie.value for cookie in authedClientWithBlogSeeded.cookie_jar if cookie.name == 'csrf_access_token'][0]
    multipartHttpHeaders['X-CSRF-TOKEN'] = csrf_token

    response = authedClientWithBlogSeeded.put(
            '/blogs/{}'.format(blogId),
            data={
                'title': 'updated_title',
                'subtitle': 'updated_subtitle',
                'content': 'updated_content',
                'mainImageFile': testFileStorage.stream
                },
            headers=multipartHttpHeaders
            )

    printObject(response)

    data = decodeResponseByteJsonToDictionary(response.data)

    assert 200 == response.status_code
    assert 'updated_title' == data['title']
    assert 'updated_subtitle' == data['subtitle']
    assert 'updated_content' == data['content']
    assert os.path.join(application.config['PUBLIC_FILE_FOLDER'], str(authUser.id), testFileStorage.filename) == data['mainImageUrl']
