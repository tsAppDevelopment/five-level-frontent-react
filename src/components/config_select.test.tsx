import {fireEvent, waitFor} from '@testing-library/react'
import {ConfigSelect} from './config_select'
import {renderWrapped} from '../testUtils/render_wrapped'
import {userStore} from '../hooks/user_store'

describe('ConfigSelect', () => {
  it('will render', async () => {
    const {getByText, queryAllByText} = renderWrapped(<ConfigSelect />)
    await waitFor(() => expect(queryAllByText('Loading Test').length).toBe(0))
    expect(getByText('No Config')).toBeInTheDocument()
  })

  it('will change config', async () => {
    // given
    const {getByText, queryAllByText} = renderWrapped(<ConfigSelect />)
    await waitFor(() => expect(queryAllByText('Loading Test').length).toBe(0))

    expect(userStore.getState().config.name).toBe('No Config')
    expect(userStore.getState().cargoMap.size).toBe(0)

    // when config is changed
    fireEvent.mouseDown(getByText('No Config'))
    await waitFor(() => expect(queryAllByText('AE-2').length).toBe(1))
    fireEvent.click(getByText('AE-2'))

    // then
    await waitFor(() => {
      expect(userStore.getState().config.name).toBe('AE-2')
      expect(userStore.getState().cargoMap.size).not.toBe(0)
    })
  })
})
