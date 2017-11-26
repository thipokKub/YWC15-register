import stringify from 'json-stringify-safe';

/**
 * Important Note
 * use lodash as _.isEqual to compare 2 objects or arrays or anything actually :-P;
 */

/**
 * randInt give random number in range [min, max] (inclusive, inclusive)
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function will give random number between [num - ratio*num, num + ratio*num]
 */
export function randomRatio(num, ratio) {
    return random(num - ratio*num, num + ratio*num);
}

export function setCookie(params) {
    var name = params.name,
        value = params.value,
        expireDays = params.days,
        expireHours = params.hours,
        expireMinutes = params.minutes,
        expireSeconds = params.seconds;

    var expireDate = new Date();
    if (expireDays) expireDate.setDate(expireDate.getDate() + expireDays);
    if (expireHours) expireDate.setHours(expireDate.getHours() + expireHours);
    if (expireMinutes) expireDate.setMinutes(expireDate.getMinutes() + expireMinutes);
    if (expireSeconds) expireDate.setSeconds(expireDate.getSeconds() + expireSeconds);

    document.cookie = name + "=" + escape(value) +
        ";domain=" + window.location.hostname +
        ";path=/" +
        ";expires=" + expireDate.toUTCString();
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    //expire auto delete
    return "";
}

export function deleteCookie(name) {
    setCookie({ name: name, value: "", seconds: 1 });
}

export function clearAllCookie() {
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

export function storeItem(name, value) {
    localStorage.setItem(name, value);
}

export function retrieveItem(name) {
    return localStorage.getItem(name);
}

export function deleteItem(name) {
    localStorage.removeItem(name);
}

export function clearStorage() {
    localStorage.clear();
}

export function scrollIt(destination, duration = 200, easing = 'linear', callback) {

  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

export function getCoords(elem) { // crossbrowser version
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;
    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    let top  = box.top +  scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;
    let height, width, marginLeft, marginRight, marginTop, marginBottom;

    if(document.all) {// IE
        height = parseInt(elem.currentStyle.height, 10);
        width = parseInt(elem.currentStyle.width, 10);
        marginTop = parseInt(elem.currentStyle.marginTop, 10)
        marginBottom = parseInt(elem.currentStyle.marginBottom, 10);
        marginLeft = parseInt(elem.currentStyle.marginLeft, 10)
        marginRight = parseInt(elem.currentStyle.marginRight, 10);
    } else {// Mozilla
        height = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('height'));
        width = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('width'));
        marginTop = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-top'))
        marginBottom = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-bottom'));
        marginLeft = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-left'));
        marginRight = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-right'));
    }

    return {
        top: Math.round(top),
        left: Math.round(left),
        height: height,
        width: width,
        margin: {
            top: marginTop,
            bottom: marginBottom,
            left: marginLeft,
            right: marginRight
        },
        fullWidth: width + marginLeft + marginRight,
        fullHeight: height + marginTop + marginBottom
    };
}

export function noCircularObj(obj) {
    return JSON.parse(stringify(obj));
}

export function isValue(obj) {
    return typeof obj !== "undefined" && obj !== null;
}

export function forChildren(node, callback) {
    let i = 0;
    for(i = 0; i < node.children.length; i++) {
        callback(node.children[i], i);
    }
}

export function objectToArray(obj) {
    return Object.keys(obj).filter((key) => {
        return !(key === "error" || key === "isError" || key === "isLoaded")
    }).map((key) => obj[key])
}

export function onSetState(_this, name, value) {
    if (_this._isMounted) {
        _this.setState((prevState) => {
            let new_state = { ...prevState };
            new_state[name] = value;
            return {
                ...new_state
            }
        })
    }
}

export function isElementInViewport(el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}