(function(logOnInit) {

    logOnInit = logOnInit instanceof Array ? logOnInit : [];
  
    window.CPLogger = function(initConfig) {
  
      var enums = {
          INFO: {
            weight: 0,
            color: '#4fe84f'
          },
          ERROR: {
            weight: 1,
            color: '#ff6666'
          },
          DEBUG: {
            weight: 2,
            color: '#b5b5b5'
          },
          NONE: {
            weight: 3
          }
        },
        elt, scrollElt, isOpen, toggleElt;
  
      // initialize
      var config = Object.assign({
        LOG_LEVEL: 'debug',
        font: '400 13px "Courier New"',
        height: '200px',
        id: 'cp-logger',
        open: false,
        bg: 'rgba(0,0,0,.85)'
      }, initConfig);
  
      // explicitly set this, even those init hide/show sets it :)
      isOpen = config.open;
  
      var log = function(type, message) {
        type = type.toLowerCase();
        if (enums[config.LOG_LEVEL.toUpperCase()].weight < enums[type.toUpperCase()].weight) return;
  
        var logEntryElt = document.createElement('div');
        logEntryElt.innerHTML = `${(new Date).toString().replace(/\sGMT.*$/, '')} (${type}): ${message}`;
        logEntryElt.style.cssText = `color: ${enums[type.toUpperCase()].color};padding:3px 0;border-bottom:1px solid #a0a0a017;`;
        logEntryElt.classList.add(`cp-log-${type}`, 'cp-log');
        scrollElt.appendChild(logEntryElt);
        scrollElt.scrollTop = scrollElt.scrollHeight;
      }
  
      var hide = function() {
        elt.style.top = '100%';
        elt.style.bottom = '';
        toggleElt.innerHTML = 'Log';
        isOpen = false;
      };
      var show = function() {
        elt.style.top = '';
        elt.style.bottom = '0px';
        toggleElt.innerHTML = '&minus;';
        isOpen = true;
      };
  
      var clear = function() {
        scrollElt.innerHTML = '';
      }
  
      var toggle = function() {
        if (isOpen) hide();
        else show();
      }
  
      var initElt = function() {
        var existingElt;
        try {
          existingElt = document.body.querySelector(`#${config.id}`);
        } catch (err) {}
  
        if (existingElt) {
          elt = existingElt;
          scrollElt = elt.querySelector(`#${config.id}-scroller`);
          log('debug', 'The CPLogger div already exists, reusing');
        } else {
          // create elt
          elt = document.createElement('div');
          elt.id = config.id;
          elt.style.cssText = `position: fixed;left:0px;width:100%;background:${config.bg};color:#eee;font:${config.font};height:${config.height};z-index:1999;`;
  
          // create scroller
          scrollElt = document.createElement('div');
          scrollElt.id = `${config.id}-scroller`;
          scrollElt.style.cssText = 'position:absolute;height:100%;width:100%;overflow-y:scroll;padding:10px;';
          elt.appendChild(scrollElt);
  
          // create toggler
          toggleElt = document.createElement('div');
          toggleElt.innerHTML = 'Log';
          toggleElt.style.cssText = `position:absolute;top:-24px;left:10px;height:24px;background:${config.bg};padding:0 8px;line-height:24px;border-radius:4px 4px 0 0;`;
          elt.appendChild(toggleElt);
          toggleElt.addEventListener('click', toggle);
          if (config.open) show();
          else hide();
          document.body && document.body.appendChild(elt);
        }
        // log statements defined before script was loaded
        logOnInit.forEach(function(entry) {
          log(entry.level, entry.msg);
        });
  
      }
  
      // initialize in the DOM
      if (document.readyState === 'complete') initElt();
      else document.addEventListener("DOMContentLoaded", initElt);
  
      function addCSS(css) {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) { // IE
          s.styleSheet.cssText = css;
        } else { // the world
          s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
      }
      addCSS(`.cp-log{animation:cp-log .3s ease-in forwards}@keyframes cp-log{0%{opacity:0;}100%{opacity:1;}}`);
  
      // add CSS for animation
  
      return {
        error: function(m) {
          log('error', m);
        },
        info: function(m) {
          log('info', m);
        },
        debug: function(m) {
          log('debug', m);
        },
        hide: hide,
        show: show,
        clear: clear,
        reset: function() {
          hide();
          clear();
        }
      }
  
    }
  
  })(window.CPLogger || []);