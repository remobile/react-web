/**
 * Copyright (c) 2017-present, Simiantong Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactToast
 */
'use strict';

const LONG_DELAY = 3500; // 3.5 seconds
const SHORT_DELAY = 2000; // 2 seconds

let Toast = {

  SHORT: SHORT_DELAY,
  LONG: LONG_DELAY,

  show: function(message, duration) {
    const toast = document.createElement('DIV');
    const content = document.createTextNode(message);
    toast.appendChild(content);
    toast.style.animationDuration = duration/1000 + 's';
    toast.style.backgroundColor = 'rgba(0,0,0,0.65)';
    toast.style.color = '#ffffff';
    toast.style.padding = '5px 12px';
    toast.style.position = 'absolute';
    toast.style.left = '50%';
    toast.style.bottom = '20px';
    toast.style.fontSize = '14px';
    toast.style.lineHeight = '18px';
    toast.style.borderRadius = '2px';
    toast.style.zIndex = 99999999;
    toast.style.transform = 'translateX(-50%)';

    document.body.appendChild(toast);
    setTimeout(()=>document.body.removeChild(toast), duration);
  },
};

export default Toast;
