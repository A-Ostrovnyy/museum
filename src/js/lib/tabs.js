'use strict';

export function initTabs (wrapper) {
  var tablist = wrapper.querySelectorAll('[role="tablist"]')[0];
  var tabs;
  var panels;
  const delay = determineDelay();

  generateArrays();

  function generateArrays() {
    tabs = wrapper.querySelectorAll('.tabs_btn');
    panels = wrapper.querySelectorAll('.tabs_panel');
  }

  const keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46,
  };

  const direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1,
  };

  // Bind listeners
  for (var i = 0; i < tabs.length; ++i) {
    addListeners(i);
  }

  function addListeners(index) {
    tabs[index].addEventListener('click', clickEventListener);
    tabs[index].addEventListener('keydown', keydownEventListener);
    tabs[index].addEventListener('keyup', keyupEventListener);

    // Build an array with all tabs (<button>s) in it
    tabs[index].index = index;
  }

  // When a tab is clicked, activateTab is fired to activate it
  function clickEventListener({target}) {
    activateTab(target, false);
  }

  // Handle keydown on tabs
  function keydownEventListener(e) {
    switch (e.keyCode) {
      case keys.end:
        e.preventDefault();
        activateTab(tabs[tabs.length - 1]);
        break;
      case keys.home:
        e.preventDefault();
        activateTab(tabs[0]);
        break;
      case keys.up:
      case keys.down:
        determineOrientation(e);
        break;
    }
  }

  // Handle keyup on tabs
  function keyupEventListener(e) {
    switch (e.keyCode) {
      case keys.left:
      case keys.right:
        determineOrientation(e);
        break;
      case keys.delete:
        determineDeletable(e);
        break;
    }
  }

  // When a tablist’s aria-orientation is set to vertical,
  // only up and down arrow should function.
  // In all other cases only left and right arrow function.
  function determineOrientation(e) {
    const key = e.keyCode;
    const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
    let proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        e.preventDefault();
        proceed = true;
      }
    } else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      }
    }

    if (proceed) {
      switchTabOnArrowPress(e);
    }
  }

  // Either focus the next, previous, first, or last tab
  // depending on key pressed
  function switchTabOnArrowPress(e) {
    const pressed = e.keyCode;

    tabs.forEach((tab) => tab.addEventListener('focus', focusEventHandler));

    if (direction[pressed]) {
      const target = e.target;
      if (target.index !== undefined) {
        if (tabs[target.index + direction[pressed]]) {
          tabs[target.index + direction[pressed]].focus();
        } else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab();
        } else if (pressed === keys.right || pressed == keys.down) {
          focusFirstTab();
        }
      }
    }
  }

  // Activates any given tab panel
  function activateTab(tab, setFocus) {
    setFocus = setFocus || true;
    // Deactivate all other tabs
    deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    // Get the value of aria-controls (which is an ID)
    const controls = tab.getAttribute('aria-controls');

    // Remove is-hidden class from tab panel to make it visible
    document.getElementById(controls).classList.remove('is-hidden');

    setFocus && tab.focus();
  }

  // Deactivate all tabs and tab panels
  function deactivateTabs() {
    tabs.forEach((tab) => {
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-selected', 'false');
      tab.removeEventListener('focus', focusEventHandler);
    })

    panels.forEach((panel) => panel.classList.add('is-hidden'))
  }

  // Make a guess
  function focusFirstTab() {
    tabs[0].focus();
  }

  // Make a guess
  function focusLastTab() {
    tabs[tabs.length - 1].focus();
  }

  // Detect if a tab is deletable
  function determineDeletable(event) {
    var target = event.target;

    if (target.getAttribute('data-deletable') !== null) {
      // Delete target tab
      deleteTab(event, target);

      // Update arrays related to tabs widget
      generateArrays();

      // Activate the closest tab to the one that was just deleted
      if (target.index - 1 < 0) {
        activateTab(tabs[0]);
      } else {
        activateTab(tabs[target.index - 1]);
      }
    }
  }

  // Deletes a tab and its panel
  function deleteTab(event) {
    var target = event.target;
    var panel = document.getElementById(target.getAttribute('aria-controls'));

    target.parentElement.removeChild(target);
    panel.parentElement.removeChild(panel);
  }

  // Determine whether there should be a delay
  // when user navigates with the arrow keys
  function determineDelay() {
    const hasDelay = tablist.hasAttribute('data-delay');
    let delay = 0;

    if (hasDelay) {
      const delayValue = tablist.getAttribute('data-delay');
      if (delayValue) {
        delay = delayValue;
      } else {
        delay = 300;
      }
    }

    return delay;
  }

  //
  function focusEventHandler(event) {
    var target = event.target;

    setTimeout(checkTabFocus, delay, target);
  }

  // Only activate tab on focus if it still has focus after the delay
  function checkTabFocus(target) {
    var focused = document.activeElement;

    if (target === focused) {
      activateTab(target, false);
    }
  }
};
