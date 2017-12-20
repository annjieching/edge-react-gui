// @flow

import {connect} from 'react-redux'
import * as EDIT_TOKEN_ACTIONS from './action.js'
import EditToken from './EditToken.ui'
import * as WALLET_ACTIONS from '../../Wallets/action'
// import * as WALLET_ACTIONS from '../../Wallets/action.js'
import type {Dispatch, State} from '../../../ReduxTypes'

const mapStateToProps = (state: State) => ({
  currencySettings: state.ui.settings.customTokens,
  deleteTokenModalVisible: state.ui.scenes.editToken.deleteTokenModalVisible,
  currencyPluginsList: state.ui.settings.plugins.arrayPlugins
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  showDeleteTokenModal: () => dispatch(EDIT_TOKEN_ACTIONS.showDeleteTokenModal()),
  hideDeleteTokenModal: () => dispatch(EDIT_TOKEN_ACTIONS.hideDeleteTokenModal()),
  deleteCustomToken: (walletId: string, currencyCode: string) => dispatch(WALLET_ACTIONS.deleteCustomToken(walletId, currencyCode))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditToken)
