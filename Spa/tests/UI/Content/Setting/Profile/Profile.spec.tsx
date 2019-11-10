import '@testing-library/jest-dom/extend-expect';
// import react-testing methods
import { fireEvent, queryByRole, queryByText, render, wait, waitForElement } from '@testing-library/react';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { api } from '../../../../../src/requests/api';
import { blogGET200NonEmptyResponse, blogGET200EmptyResponse, userGET200Response, noDateGET200Response } from '../../../../requests/fixtures';
import { ContextWrapperComponent } from '../../../fixtures';
import Profile from '../../../../../src/UI/Content/Setting/Profile/Profile';
import { CssGlobalContextDefaultState } from '../../../../../src/UI/Base/Context/CssGlobalContext/CssGlobalContextDefaultState';
jest.mock('../../../../../src/requests/api')


describe('bm-c1: Profile Component testing', () => {

  /**
   * prerequisite 
   * 1. mock api request and return dummy test user data 
   * 2. role: member only 
   **/

  /**
   * use case or css layout test list
   *
   * ** all **
   *
   * a1. (api fetch) should start api request when this component is mounted
   * a2. (DOM) should display user data in each input field after initial api request 
   * a3. (api fetch) should not start api request when this component is updated
   * a4. (validation) should display error msg when user name is null/empty 
   * a5. (validation) should not allow to update when user name is null/empty 
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
   * a16. (DOM) should show 'update failure' message when update failed 
   *
   **/

  beforeAll(() => {
    console.log('bm-c1: beforeAll ')
  })

  beforeEach(() => {
    console.log('bm-c1: beforeEach ')
  })

  /** test for use case which does not matter screen size  here**/
  test('a1. (api fetch) should start api request when this component is mounted', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
    })
    expect(api.request).toHaveBeenCalled()
  })

  test('a2. (DOM) should display user data in each input field after initial api request ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )

      await wait(() => {
        expect(getByLabelText('Name:').getAttribute('value')).toBeTruthy()
      })
    })
  })

  test('a3. (api fetch) should not start api request when this component is updated', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const nameInput = await waitForElement(() => getByLabelText('Name:'))
      fireEvent.change(nameInput,
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

  test('a4. (validation) should display error msg when user name is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const nameInput = await waitForElement(() => getByLabelText('Name:'))
      fireEvent.focus(nameInput) // need to focus to enable to display validation error on dom
      fireEvent.change(nameInput,{ target: { value: '' }})
      const nameErrorNode = await waitForElement(() => getByText('name is a required field'))
      expect(nameErrorNode).toBeInTheDocument()
    })
  })


  test('a5. (validation) should not allow to update when user name is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const nameInput = await waitForElement(() => getByLabelText('Name:'))
      fireEvent.focus(nameInput) // need to focus to enable to display validation error on dom
      fireEvent.change(nameInput,{ target: { value: '' }})
      const nameErrorNode = await waitForElement(() => getByText('name is a required field'))
      fireEvent.click(getByText('Update'))
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })
      
    })
  })

  test('a6. (validation) should display error msg when email is null/empty ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const emailInput = await waitForElement(() => getByLabelText('Email:'))
      fireEvent.focus(emailInput) // need to focus to enable to display validation error on dom
      fireEvent.change(emailInput,{ target: { value: '' }})
      const emailErrorNode = await waitForElement(() => getByText('email is a required field'))
      expect(emailErrorNode).toBeInTheDocument()
    })
  })

  test('a7.  (validation) should not allow to update when email is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const emailInput = await waitForElement(() => getByLabelText('Email:'))
      fireEvent.focus(emailInput) // need to focus to enable to display validation error on dom
      fireEvent.change(emailInput,{ target: { value: '' }})
      const emailErrorNode = await waitForElement(() => getByText('email is a required field'))
      fireEvent.click(getByText('Update'))
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })

    })
  })

  test('a8. (validation) should display error msg when password is null/empty ', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const passwordInput = await waitForElement(() => getByLabelText('Password:'))
      fireEvent.focus(passwordInput) // need to focus to enable to display validation error on dom
      fireEvent.change(passwordInput,{ target: { value: '' }})
      const passwordErrorNode = await waitForElement(() => getByText('password is a required field'))
      expect(passwordErrorNode).toBeInTheDocument()
    })
  })

  test('a9. (validation) should not allow to update when password is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const passwordInput = await waitForElement(() => getByLabelText('Password:'))
      fireEvent.focus(passwordInput) // need to focus to enable to display validation error on dom
      fireEvent.change(passwordInput,{ target: { value: '' }})
      const passwordErrorNode = await waitForElement(() => getByText('password is a required field'))
      fireEvent.click(getByText('Update'))
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('a10. (validation) should display error msg when confirm is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const confirmInput = await waitForElement(() => getByLabelText('Confirm:'))
      fireEvent.focus(confirmInput) // need to focus to enable to display validation error on dom
      fireEvent.change(confirmInput,{ target: { value: '' }})
      const confirmErrorNode = await waitForElement(() => getByText('confirm is a required field'))
      expect(confirmErrorNode).toBeInTheDocument()
    })
  })

  test('a11. (validation) should not allow to update when confirm is null/empty', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const confirmInput = await waitForElement(() => getByLabelText('Confirm:'))
      fireEvent.focus(confirmInput) // need to focus to enable to display validation error on dom
      fireEvent.change(confirmInput,{ target: { value: '' }})
      const confirmErrorNode = await waitForElement(() => getByText('confirm is a required field'))
      fireEvent.click(getByText('Update'))
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('a12. (validation) should display error msg when password and confirm does not match', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const confirmInput = await waitForElement(() => getByLabelText('Confirm:'))
      fireEvent.focus(confirmInput) // need to focus to enable to display validation error on dom
      fireEvent.change(confirmInput,{ target: { value: 'sample' }})
      const confirmErrorNode = await waitForElement(() => getByText('passwords must match'))
      expect(confirmErrorNode).toBeInTheDocument()
    })
  })

  test('a13. (validation) should not allow to update when password and confirm does not match', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      const confirmInput = await waitForElement(() => getByLabelText('Confirm:'))
      fireEvent.focus(confirmInput) // need to focus to enable to display validation error on dom
      fireEvent.change(confirmInput,{ target: { value: 'sample' }})
      const confirmErrorNode = await waitForElement(() => getByText('passwords must match'))
      fireEvent.click(getByText('Update'))
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('a14. (EH) should start update request when "update" is clicked', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      // must wait until fetch is completed
      const updateBtn = await waitForElement(() => getByText('Update'))
      fireEvent.click(updateBtn)
      // wait until below expectation is met otherwise, timeout
      await wait(() => {
        expect(api.request).toHaveBeenCalledTimes(2)
      })
    })
  })

  test('a15. (DOM) should show "update success" message when update completed', async () => {

    api.request = jest.fn().mockReturnValue(Promise.resolve(userGET200Response))
    await act(async () => {
      const { getByText, getByRole, getAllByRole, debug, getByLabelText } = render(
        <ContextWrapperComponent component={Profile} isAuth />
      )
      // must wait until fetch is completed
      const updateBtn = await waitForElement(() => getByText('Update'))
      // mock response of update request
      api.request = jest.fn().mockReturnValue(Promise.resolve(noDateGET200Response))
      fireEvent.click(updateBtn)
      await wait(() => {
        expect(getByText('updating user profile success')).toBeInTheDocument()
      })
    })
  })

  afterEach(() => {
    console.log('bm-c1: afterEach ')
  })

  afterAll(() => {
    console.log('bm-c1: afterAll ')
  })

})


