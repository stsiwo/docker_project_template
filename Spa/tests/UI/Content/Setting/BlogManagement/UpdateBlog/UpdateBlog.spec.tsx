import '@testing-library/jest-dom/extend-expect';
// import react-testing methods
import { fireEvent, queryByRole, queryByText, render, wait, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { api } from '../../../../../../src/requests/api';
import { blogGET200NonEmptyResponse, blogGET200EmptyResponse, noDateGET200Response, internalServerError500Response, networkError, singleBlogGET200NonEmptyResponse } from '../../../../../requests/fixtures';
import UpdateBlog from '../../../../../../src/UI/Content/Setting/BlogManagement/UpdateBlog/UpdateBlog'
import { ContextWrapperComponent } from '../../../../fixtures';
import { CssGlobalContextDefaultState } from '../../../../../../src/UI/Base/Context/CssGlobalContext/CssGlobalContextDefaultState';
jest.mock('../../../../../../src/requests/api')


describe('ub-c1: UpdateBlog Component testing', () => {

  /**
   * prerequisite 
   * 1. mock api request and return dummy test blog data 
   * 2. role: member only (provide test auth user)
   **/

  /**
   * use case or css layout test list
   *
   * ** all **
   *
   * a1. (api fetch) should start api request when this component is mounted
   * a2. (DOM) should display blog data in each input field after initial api request 
   * a3. (api fetch) should not start api request when this component is updated
   * a4. (validation) should display error msg when blog name is null/empty 
   * a5. (validation) should not allow to update when blog name is null/empty 
   * a6. (validation) should display error msg when email is null/empty 
   * a7. (validation) should not allow to update when email is null/empty 
   * a8. (validation) should display error msg when password is null/empty 
   * a9. (validation) should not allow to update when password is null/empty 
   * a10. (validation) should display error msg when confirm is null/empty 
   * a11. (validation) should not allow to update when confirm is null/empty 
   * a12. (validation) should display error msg when password and confirm does not match
   * a13. (validation) should not allow to update when password and confirm does not match
   * a14. (EH) should start update request when 'update' is clicked 
   * a15. (DOM) should show 'update success' message when update completed 
   * a16. (DOM) should show "update failure" message when update failed because of network issue 
   * a17. (DOM) should show "update failure" message when update failed because of 4xx or 5xx error
   *
   **/

  beforeAll(() => {
    console.log('ub-c1: beforeAll ')
  })

  beforeEach(() => {
    console.log('ub-c1: beforeEach ')
  })

  /** test for use case which does not matter screen size  here**/
  test('a1. (api fetch) should start api request when this component is mounted', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
    })
    expect(api.request).toHaveBeenCalled()
  })

  test('a2. (DOM) should display blog data in each input field after initial api request ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )

      await wait(() => {
        expect(getByLabelText('Title').getAttribute('value')).toBeTruthy()
        expect(getByLabelText('Sub Title').getAttribute('value')).toBeTruthy()
        expect(getByLabelText('Content').getAttribute('value')).toBeTruthy()
      })
    })
  })

  test('a3. (api fetch) should not start api request when this component is updated', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const titleInput = await waitForElement(() => getByLabelText('Title'))
      fireEvent.change(titleInput,
        {
          target: {
            value: 'test'
          }
        })
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('a4. (validation) should display error msg when blog title is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const titleInput = await waitForElement(() => getByLabelText('Title'))
      fireEvent.focus(titleInput) // need to focus to enable to display validation error on dom
      fireEvent.change(titleInput, { target: { value: '' } })
      const titleErrorNode = await waitForElement(() => getByText('title is a required field'))
      expect(titleErrorNode).toBeInTheDocument()
    })
  })

  test('a5. (validation) should not allow to update when blog title is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const titleInput = await waitForElement(() => getByLabelText('Title'))
      fireEvent.focus(titleInput) // need to focus to enable to display validation error on dom
      fireEvent.change(titleInput, { target: { value: '' } })
      const titleErrorNode = await waitForElement(() => getByText('title is a required field'))
      fireEvent.click(getByText('Save'))
      await waitForElement(() => getByText('please fix validation errors before submit'))
      expect(api.request).toHaveBeenCalledTimes(1)

    })
  })

  test('a6. (validation) should display error msg when subtitle is null/empty ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const subtitleInput = await waitForElement(() => getByLabelText('Subtitle'))
      fireEvent.focus(subtitleInput) // need to focus to enable to display validation error on dom
      fireEvent.change(subtitleInput, { target: { value: '' } })
      const subtitleErrorNode = await waitForElement(() => getByText('subtitle is a required field'))
      expect(subtitleErrorNode).toBeInTheDocument()
    })
  })

  test('a7.  (validation) should not allow to update when subtitle is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const subtitleInput = await waitForElement(() => getByLabelText('Subtitle'))
      fireEvent.focus(subtitleInput) // need to focus to enable to display validation error on dom
      fireEvent.change(subtitleInput, { target: { value: '' } })
      const subtitleErrorNode = await waitForElement(() => getByText('subtitle is a required field'))
      fireEvent.click(getByText('Save'))
      await waitForElement(() => getByText('please fix validation errors before submit'))
      expect(api.request).toHaveBeenCalledTimes(1)
    })
  })

  test('a8. (validation) should display error msg when content is null/empty ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const contentInput = await waitForElement(() => getByLabelText('Content'))
      fireEvent.focus(contentInput) // need to focus to enable to display validation error on dom
      fireEvent.change(contentInput, { target: { value: '' } })
      const contentErrorNode = await waitForElement(() => getByText('content is a required field'))
      expect(contentErrorNode).toBeInTheDocument()
    })
  })

  test('a9. (validation) should not allow to update when content is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      const contentInput = await waitForElement(() => getByLabelText('Content'))
      fireEvent.focus(contentInput) // need to focus to enable to display validation error on dom
      fireEvent.change(contentInput, { target: { value: '' } })
      const contentErrorNode = await waitForElement(() => getByText('content is a required field'))
      fireEvent.click(getByText('Save'))
      await waitForElement(() => getByText('please fix validation errors before submit'))
      expect(api.request).toHaveBeenCalledTimes(1)
    })
  })

  test('a14. (EH) should start save request when "save" is clicked', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )

      // must wait until fetch is completed
      const saveBtn = await waitForElement(() => getByText('Save'))
      fireEvent.click(saveBtn)
      // wait until below expectation is met otherwise, timeout
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(2)
      })
    })
  })

  test('a15. (DOM) should show "save success" message when save completed', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      // must wait until fetch is completed
      const saveBtn = await waitForElement(() => getByText('Save'))
      // mock response of save request
      api.request = jest.fn().mockReturnValue(Promise.resolve(noDateGET200Response))
      fireEvent.click(saveBtn)
      await wait(() => {
        expect(getByText('updating blog success')).toBeInTheDocument()
      })
    })
  })

  test('a16. (DOM) should show "save failure" message when save failed because of network issue', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      // must wait until fetch is completed
      const saveBtn = await waitForElement(() => getByText('Save'))
      // mock response of save request
      api.request = jest.fn().mockReturnValue(Promise.reject(networkError))
      fireEvent.click(saveBtn)
      await wait(() => {
        expect(getByText('updating blog failed')).toBeInTheDocument()
      })
    })
  })

  test('a17. (DOM) should show "save failure" message when save failed because of 4xx or 5xx error', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(singleBlogGET200NonEmptyResponse))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={UpdateBlog} isAuth />
      )
      // must wait until fetch is completed
      const saveBtn = await waitForElement(() => getByText('Save'))
      // mock response of save request
      api.request = jest.fn().mockReturnValue(Promise.reject(internalServerError500Response))
      fireEvent.click(saveBtn)
      await wait(() => {
        expect(getByText('updating blog failed')).toBeInTheDocument()
      })
    })
  })
  afterEach(() => {
    console.log('ub-c1: afterEach ')
  })

  afterAll(() => {
    console.log('ub-c1: afterAll ')
  })

})




