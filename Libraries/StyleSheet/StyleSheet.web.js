/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStyleSheet
 */
'use strict';

import extendProperties from './extendProperties.web';
import reference from './reference';
import setDefaultStyle from './setDefaultStyle.web';
// Make React support array of style object like React Native
import extendCreateElement from './extendCreateElement';
import flattenStyle from './flattenStyle.web';
import PixelRatio from 'ReactPixelRatio';
import Dimensions from 'ReactDimensions';
import _ from 'lodash';

const WIDTH_SCALE = Dimensions.get('window').width/375;

var inited = false;

const ROOT_CLASS_NAME = 'react-root';
const VIEW_CLASS_NAME = 'react-view';

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
const absoluteFill = absoluteFillObject;

var StyleSheet = {
  absoluteFill,
  absoluteFillObject,
  hairlineWidth: 1,
  create: function(styles) {
    const result = {};
    for (const key in styles) {
      result[key] = styles[key] && _.mapValues(styles[key], (value, key)=>{
        if (typeof value !== 'number') {
          return value;
        }
        if (key === 'flex') {
          return value;
        }
        if (key === 'lineHeight' || key=== 'fontSize') {
          return Math.round(value*WIDTH_SCALE);
        }
        if (value > 2 || value < -2 ) {
          return value*WIDTH_SCALE;
        }
        return value;
      });
    }
    return result;
  },
  extendCreateElement: function(React, nativeComponents) {
    extendCreateElement(React, function(style) {
      if (!inited) {
        inited = true;
        setDefaultStyle({
          reference: reference.getWidth(),
          rootClassName: ROOT_CLASS_NAME,
          viewClassName: VIEW_CLASS_NAME,
        });
      }

      return flattenStyle(style, extendProperties);
    }, nativeComponents);
  },
  setReferenceWidth: reference.setWidth,
  rootClassName: ROOT_CLASS_NAME,
  viewClassName: VIEW_CLASS_NAME,
  flatten: flattenStyle
};

module.exports = StyleSheet;
