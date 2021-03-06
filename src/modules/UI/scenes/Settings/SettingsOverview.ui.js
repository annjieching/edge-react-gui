// @flow
// import HockeyApp from 'react-native-hockeyapp'

import React, {Component} from 'react'
import {ScrollView, Text, View} from 'react-native'
import {Actions} from 'react-native-router-flux'

import FAIcon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Gradient from '../../components/Gradient/Gradient.ui'

import * as Constants from '../../../../constants/indexConstants'
import T from '../../components/FormattedText'
import RowModal from './components/RowModal.ui'
import RowRoute from './components/RowRoute.ui'
import RowSwitch from './components/RowSwitch.ui'
import {PrimaryButton} from '../../components/Buttons'
import {border as b, getTimeWithMeasurement} from '../../../utils'
import AutoLogoutModal from './components/AutoLogoutModal.ui'
import SendLogsModal from './components/SendLogsModal.ui'
import ConfirmPasswordModal from './components/ConfirmPasswordModal.ui'

import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import {Icon} from '../../components/Icon/Icon.ui'

import styles from './style'
import s from '../../../../locales/strings'

const DISABLE_TEXT = s.strings.string_disable
import {ConfirmPasswordModalStyle} from '../../../../styles/indexStyles'
import { AbcAccount } from 'airbitz-core-types'
type Props = {
  defaultFiat: string,
  autoLogoutTimeInMinutes: number,
  username: string,
  account: AbcAccount,
  supportsTouchId: boolean,
  touchIdEnabled: boolean,
  lockButton: string,
  lockButtonIcon: string,
  isLocked: boolean,
  setAutoLogoutTimeInMinutes(number): void,
  confirmPassword(string): void,
  lockSettings(): void,
  enableTouchId(boolean, AbcAccount): void,
  sendLogs(string): void
}
type State = {
  showAutoLogoutModal: boolean,
  showSendLogsModal: boolean,
  showConfirmPasswordModal: boolean,
  autoLogoutTimeInMinutes: number
}

export default class SettingsOverview extends Component<Props,State> {
  settings: Array<Object>
  securityRoute: Array<Object>
  optionModals: Array<Object>
  currencies: Array<Object>
  options: Object
  constructor (props: Props) {
    super(props)
    this.state = {
      showAutoLogoutModal: false,
      showSendLogsModal: false,
      showConfirmPasswordModal: false,
      autoLogoutTimeInMinutes: props.autoLogoutTimeInMinutes
    }

    this.settings = [
      {
        key: Constants.CHANGE_PASSWORD,
        text: s.strings.settings_button_change_password,
        routeFunction: this._onPressChangePasswordRouting
      },
      {
        key: Constants.CHANGE_PIN,
        text: s.strings.settings_button_pin,
        routeFunction: this._onPressChangePinRouting
      }/* ,
      {
        key: Constants.RECOVER_PASSWORD,
        text: s.strings.settings_button_change_pass_recovery,
        routeFunction: this._onPressRecoverPasswordRouting
      } */
    ]
    this.securityRoute = [
      {
        key: 'setup2Factor',
        text: s.strings.settings_button_setup_two_factor,
        routeFunction: this._onPressDummyRouting
      }
    ]
    const pinRelogin = {
      text: s.strings.settings_title_pin_login,
      key: 'pinRelogin',
      routeFunction: this._onToggleOption,
      value: false
    }
    const useTouchID = this.props.supportsTouchId ? {
      text: s.strings.settings_button_use_touchID,
      key: 'useTouchID',
      routeFunction: this._onToggleTouchIdOption,
      value: this.props.touchIdEnabled
    } : null

    this.options = {
      pinRelogin,
      useTouchID
    }

    if (this.props.supportsTouchId) {
      this.options.useTouchID =  {
        text: s.strings.settings_button_use_touchID,
        key: 'useTouchID',
        routeFunction: this._onToggleTouchIdOption,
        value: this.props.touchIdEnabled
      }
    }

    this.optionModals = [
      {
        key: 'autoLogoff',
        text: s.strings.settings_title_auto_logoff
      }
    ]

    this.currencies = [
      {
        text: 'Bitcoin',
        routeFunction: Actions.btcSettings
      },
      {
        text: 'BitcoinCash',
        routeFunction: Actions.bchSettings
      },
      {
        text: 'Ethereum',
        routeFunction: Actions.ethSettings
      },
      {
        text: 'Litecoin',
        routeFunction: Actions.ltcSettings
      },
    ]
  }

  _onPressDummyRouting = () => {
    // console.log('dummy routing')
  }

  _onPressChangePasswordRouting = () => {
    if (this.props.isLocked) return
    Actions[Constants.CHANGE_PASSWORD]()
  }

  _onPressChangePinRouting = () => {
    if (this.props.isLocked) return
    Actions[Constants.CHANGE_PIN]()

  }
  _onPressRecoverPasswordRouting = () => {
    Actions[Constants.CHANGE_PASSWORD]()
  }

  _onPressOpenLogoffTime = () => {
    // console.log('opening auto log off modal')
  }

  _onPressOpenDefaultCurrency = () => {
    // console.log('opening default currency modal?')
  }

  _onPressOpenChangeCategories = () => {
    // console.log('open change categories thingy')
  }

  _onToggleOption = (property: string) => {
    console.log('Allen toggling option: ', property)
  }

  _onToggleTouchIdOption = (bool: boolean) => {
    this.props.enableTouchId(bool, this.props.account)
    this.options.useTouchID.value = bool
  }

  _onPressDebug = () => {
    // HockeyApp.generateTestCrash()
  }

  onDoneAutoLogoutModal = (autoLogoutTimeInMinutes: number) => {
    this.setState({
      showAutoLogoutModal: false,
      autoLogoutTimeInMinutes
    })
    this.props.setAutoLogoutTimeInMinutes(autoLogoutTimeInMinutes)
  }

  onCancelAutoLogoutModal = () => {
    this.setState({showAutoLogoutModal: false})
  }

  onDoneSendLogsModal = (text: string) => {
    this.setState({showSendLogsModal: false})
    this.props.sendLogs(text)
  }

  onCancelSendLogsModal = () => {
    this.setState({showSendLogsModal: false})
  }

  render () {
    const {measurement: autoLogoutMeasurement,
      value: autoLogoutValue} = getTimeWithMeasurement(this.state.autoLogoutTimeInMinutes)
    const autoLogoutRightText = autoLogoutValue === 0
      ? DISABLE_TEXT
      : `${autoLogoutValue} ${s.strings['settings_'+ autoLogoutMeasurement]}`

    return (
      <View>
      <Gradient style={styles.gradient} />
        <ScrollView style={styles.container}>
          <Gradient style={[styles.unlockRow]}>
            <View style={[styles.accountBoxHeaderTextWrap, b('yellow')]}>
              <View style={styles.leftArea}>
                <FAIcon style={[styles.icon, b('green')]} name={Constants.USER_O} />
                <T style={styles.accountBoxHeaderText}>
                  {s.strings.settings_account_title_cap}: {this.props.username}
                </T>
              </View>
            </View>
          </Gradient>
          <RowRoute
            leftText={s.strings[this.props.lockButton]}
            routeFunction={this.showConfirmPasswordModal}
            right={<Icon style={styles.settingsLocks}
              name={this.props.lockButtonIcon}
              size={24}
              type={Constants.ION_ICONS}/>} />
          <RowRoute
            leftText={s.strings.settings_button_change_password}
            routeFunction={this._onPressChangePasswordRouting}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name='arrow-right' />} />
          <RowRoute
            leftText={s.strings.settings_button_pin}
            routeFunction={this._onPressChangePinRouting}
            right={<SimpleIcon style={styles.settingsRowRightArrow} name='arrow-right' />} />

          <Gradient style={[styles.unlockRow]}>
            <View style={[styles.accountBoxHeaderTextWrap, b('yellow')]}>
              <View style={styles.leftArea}>
                <IonIcon name='ios-options' style={[styles.icon, b('green')]} />
                <T style={styles.accountBoxHeaderText}>
                  {s.strings.settings_options_title_cap}
                </T>
              </View>
            </View>
          </Gradient>

          <View>
            <RowModal onPress={this.showAutoLogoutModal}
              leftText={s.strings.settings_title_auto_logoff}
              rightText={autoLogoutRightText} />

            <RowRoute
              leftText={s.strings.settings_title_currency}
              routeFunction={Actions.defaultFiatSetting}
              right={<Text>{this.props.defaultFiat.replace('iso:', '')}</Text>} />

            {this.securityRoute.map(this.renderRowRoute)}

            {Object.keys(this.options).map(this.renderRowSwitch)}

            {this.currencies.map(this.renderRowRoute)}

            <RowRoute
              leftText={s.strings.settings_button_send_logs}
              scene={'changePassword'}
              routeFunction={this.showSendLogsModal} />

            <View style={[styles.debugArea, b('green')]}>
              <PrimaryButton text={s.strings.settings_button_debug} onPressFunction={this._onPressDebug} />
            </View>

            <View style={styles.emptyBottom} />
          </View>

          <AutoLogoutModal
            autoLogoutTimeInMinutes={this.state.autoLogoutTimeInMinutes}
            showModal={this.state.showAutoLogoutModal}
            onDone={this.onDoneAutoLogoutModal}
            onCancel={this.onCancelAutoLogoutModal} />
          <SendLogsModal showModal={this.state.showSendLogsModal}
            onDone={this.onDoneSendLogsModal}
            onCancel={this.onCancelSendLogsModal} />
          <ConfirmPasswordModal
            style={ConfirmPasswordModalStyle}
            headerText={'settings_lock_header'}
            showModal={this.state.showConfirmPasswordModal}
            onDone={this.confirmPassword}
            onCancel={this.hideConfirmPasswordModal} />
        </ScrollView>
      </View>
    )
  }
  confirmPassword = (arg: string) => {
    this.setState({showConfirmPasswordModal: false})
    this.props.confirmPassword(arg)
  }
  showConfirmPasswordModal = () => {
    if (!this.props.isLocked) {
      this.props.lockSettings()
      return
    }
    this.setState({showConfirmPasswordModal: true})
  }
  hideConfirmPasswordModal = () => this.setState({showConfirmPasswordModal: false})
  showAutoLogoutModal = () => this.setState({showAutoLogoutModal: true})
  showSendLogsModal = () => this.setState({showSendLogsModal: true})
  renderRowRoute = (x: Object, i: number) => <RowRoute key={i} leftText={x.text} routeFunction={x.routeFunction} right={x.right} />
  renderRowSwitch = (x: string) => (
    <RowSwitch
      leftText={this.options[x].text}
      key={this.options[x].key}
      property={this.options[x].key}
      onToggle={this.options[x].routeFunction}
      value={this.options[x].value}
      />
  )
  renderRowModal = (x: Object) => <RowModal leftText={x.text} key={x.key} modal={(x.key).toString()} />
}
