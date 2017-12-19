import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableHighlight} from 'react-native'
import T from '../FormattedText'
import styles, {styles as styleRaw} from './style'
import s from '../../../../locales/strings.js'

class PrimaryButton extends Component {
  constructor (props) {
    super(props)
    this.style = [styles.primaryButtonWrap, styles.stylizedButton]

    if (props.style) {
      if (Array.isArray(props.style)) {
        this.style = this.style.concat(props.style)
      } else {
        this.style.push(props.style)
      }
    }
  }

  render () {
    return (
      <TouchableHighlight {...this.props}
        onPress={this.props.onPressFunction}
        underlayColor={styleRaw.primaryUnderlay.color}
        style={[
          styles.primaryButtonWrap,
          styles.stylizedButton,
          this.props.style]}
      >
        <View style={styles.stylizedButtonTextWrap}>
          {this.props.processingFlag
            ? (this.props.processingElement)
            :    (<T style={[styles.primaryButtonText, styles.stylizedButtonText]}>
              {this.props.text}
            </T>)
          }
        </View>
      </TouchableHighlight>
    )
  }
}
PrimaryButton.propTypes = {
  text: PropTypes.string,
  onPressFunction: PropTypes.func
}

const CANCEL_TEXT = s.strings.string_cancel

class SecondaryButton extends Component {
  render () {
    return (
      <TouchableHighlight style={[
        styles.secondaryButtonWrap,
        styles.stylizedButton,
        this.props.style
      ]}
        onPress={this.props.onPressFunction}
        disabled={this.props.disabled}
        underlayColor={styleRaw.secondaryUnderlay.color}>
        <View style={styles.stylizedButtonTextWrap}>
          <T style={[styles.secondaryButtonText, styles.stylizedButtonText]}>
            {this.props.text || CANCEL_TEXT}
          </T>
        </View>
      </TouchableHighlight>
    )
  }
}
SecondaryButton.propTypes = {
  text: PropTypes.string,
  onPressFunction: PropTypes.func
}

class TertiaryButton extends Component {
  render () {
    return (
      <TouchableHighlight style={[
        styles.tertiaryButtonWrap,
        styles.stylizedButton,
        this.props.buttonStyle
      ]}
        onPress={this.props.onPressFunction}
        underlayColor={styleRaw.tertiaryUnderlay.color}>
        <View style={[styles.stylizedButtonTextWrap]}>
          <T style={[styles.tertiaryButtonText, this.props.textStyle]} {...this.props}>
            {this.props.text}
          </T>
        </View>
      </TouchableHighlight>
    )
  }
}
TertiaryButton.propTypes = {
  text: PropTypes.string,
  onPressFunction: PropTypes.func
}

export {PrimaryButton, SecondaryButton, TertiaryButton}
