/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactImage
 */
'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import View from 'ReactView';
import { Mixin as LayoutMixin } from 'ReactLayoutMixin';
import ImageResizeMode from './ImageResizeMode';
import { Mixin as NativeMethodsMixin } from 'NativeMethodsMixin';
import mixin from 'react-mixin';

class Image extends Component {
  static resizeMode = ImageResizeMode

  static propTypes = {
    source: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      // Opaque type returned by require('./image.jpg')
      PropTypes.number,
      PropTypes.string,
      // Multiple sources
      PropTypes.arrayOf(
        PropTypes.shape({
          uri: PropTypes.string,
          width: PropTypes.number,
          height: PropTypes.number,
        }))
    ]),
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  }

  static contextTypes = {
    isInAParentText: PropTypes.bool
  }

  static getSize = function(
    url: string,
    success: (width: number, height: number) => void,
    failure: (error: any) => void,
  ) {
    let wrap = document.createElement('div'),
      img = new window.Image(),
      loadedHandler = function loadedHandler() {
        img.removeEventListener('load', loadedHandler);
        success && success(img.offsetWidth, img.offsetHeight);
      },
      errorHandler = function errorHandler() {
        img.removeEventListener('error', errorHandler);
        failure && failure();
      };

    wrap.style.cssText = 'height:0px;width:0px;overflow:hidden;visibility:hidden;';

    wrap.appendChild(img);
    document.body.appendChild(wrap);
    img.src = url;
    if (!img.complete) {
      img.addEventListener('error', errorHandler);
      img.addEventListener('load', loadedHandler);
    } else {
      loadedHandler();
    }
  }

  render() {

    let props = {
      ...this.props,
      'aria-label': this.props.accessibilityLabel
    };
    props.src = typeof props.source === 'object' ? props.source.uri : props.source;

    // TODO: lazyload image when not in viewport

    let resizeMode = this.props.resizeMode;

    // Background image element, resizeMode is strtch is equal default img style
    if ( (this.props.children || (resizeMode && resizeMode !== 'stretch')) && !this.context.isInAParentText) {
      let containerStyles = props.style ? props.style : {};
      containerStyles.backgroundImage = 'url("' + props.src + '")';
      containerStyles.backgroundSize = (!resizeMode || resizeMode=='stretch') ? '100% 100%' : resizeMode;
      containerStyles.backgroundRepeat = 'no-repeat';
      containerStyles.backgroundPosition = '50%';

      return (
        <View style={containerStyles} data-src={props.src}>
          {this.props.children}
        </View>
      );
    } else {
      delete props.source;
      delete props.resizeMode;

      return (
        <img {...props}/>
      );
    }
  }
}

mixin.onClass(Image, LayoutMixin);
mixin.onClass(Image, NativeMethodsMixin);

Image.isReactNativeComponent = true;

export default Image;
