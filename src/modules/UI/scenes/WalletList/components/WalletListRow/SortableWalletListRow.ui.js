import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from '../../../../../../locales/strings.js'
import {bns} from 'biggystring'
import {
  View,
  TouchableHighlight,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native'
import styles, {styles as styleRaw} from '../../style.js'
import T from '../../../../components/FormattedText'
import {border as b, cutOffText, truncateDecimals, findDenominationSymbol, decimalOrZero} from '../../../../../utils'
import sort from '../../../../../../assets/images/walletlist/sort.png'
import * as SETTINGS_SELECTORS from '../../../../Settings/selectors'

const DIVIDE_PRECISION = 18

class SortableWalletListRow extends Component<Props, State> {

  render () {
    const {data} = this.props
    const walletData = data
    let multiplier, name, symbol, cryptoCurrencyName, symbolImageDarkMono, preliminaryCryptoAmount, finalCryptoAmount

    // const exchangeDenomination = SETTINGS_SELECTORS.getExchangeDenomination(state, data.currencyCode)
    if (walletData.currencyCode) { // if wallet is done loading
      let displayDenomination = SETTINGS_SELECTORS.getDisplayDenominationFromSettings(this.props.settings, walletData.currencyCode)
      multiplier = displayDenomination.multiplier
      name = walletData.name || s.strings.string_no_name
      symbol = findDenominationSymbol(walletData.denominations, walletData.currencyCode)
      cryptoCurrencyName = walletData.currencyNames[walletData.currencyCode]
      symbolImageDarkMono = walletData.symbolImageDarkMono
      preliminaryCryptoAmount = truncateDecimals(bns.div(walletData.primaryNativeBalance, multiplier, DIVIDE_PRECISION), 6)
      finalCryptoAmount = decimalOrZero(preliminaryCryptoAmount, 6) // make it show zero if infinitesimal number
    }
    return (
      <TouchableHighlight
        style={[b('green'), styles.rowContainer, styles.sortableWalletListRow ]}
        underlayColor={styleRaw.walletRowUnderlay.color}
        {...this.props.sortHandlers}>
          {walletData.currencyCode? (
            <View style={[styles.rowContent, b()]}>
              <View style={[styles.rowNameTextWrap]}>
                {(Platform.OS === 'ios')
                && (
                  <View style={[styles.rowNameTextWrapIOS, b()]}>
                    <T style={[styles.rowNameText, b()]} numberOfLines={1}>
                    {symbolImageDarkMono
                      && <Image style={[styles.rowCurrencyLogoIOS, b()]} transform={[{translateY: 6}]} source={{uri: symbolImageDarkMono}} />
                    }  {cutOffText(name, 34)}</T>
                </View>
                )}
                {(Platform.OS === 'android')
                && (
                  <View style={[styles.rowNameTextWrapAndroid, b()]}>
                  {symbolImageDarkMono
                    && <Image style={[styles.rowCurrencyLogoAndroid, b()]} source={{uri: symbolImageDarkMono}} />
                  }
                  <T style={[styles.rowNameText, b()]} numberOfLines={1}>
                    {cutOffText(name, 34)}</T>
                  </View>
                )}
              </View>
              <View style={[styles.rowBalanceTextWrap, b()]}>
                <T style={[styles.rowBalanceAmountText, b()]}>
                  {finalCryptoAmount}
                </T>
                <T style={[styles.rowBalanceDenominationText]}>{cryptoCurrencyName}
                  ({symbol || ''})</T>
              </View>
              <View style={[styles.rowDragArea, b()]}>
                <Image
                  source={sort}
                  style={{height: 15, width: 15}}
                />
              </View>
            </View>
            ) : (
              <View style={[styles.rowContent]}>
                <View style={[styles.rowNameTextWrap]}>
                  <ActivityIndicator style={{height: 18, width: 18}}/>
                </View>
              </View>
          )}
        </TouchableHighlight>
    )
  }
}

export default connect((state) => {
  const settings = state.ui.settings

  return {
    settings
  }
})(SortableWalletListRow)
