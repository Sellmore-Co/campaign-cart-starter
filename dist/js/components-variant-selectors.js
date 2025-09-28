// JavaScript extracted from components\variant-selectors.html

// Inline script 4 from variant-selectors.html
// Variant Dropdown Class
class VariantDropdown {
  constructor(dropdownElement) {
    this.dropdown = dropdownElement;
    this.toggle = dropdownElement.querySelector('[os-element="dropdown-toggle"]');
    this.menu = dropdownElement.querySelector('[os-element="dropdown-menu"]');
    this.items = dropdownElement.querySelectorAll('[os-element="dropdown-item"]');
    this.isOpen = false;
    this.selectedValue = null;
    this.scrollHandler = null;
    this.resizeHandler = null;
    this.init();
  }
  init() {
    // Store the original toggle content structure
    this.toggleContentWrapper = this.toggle.querySelector('.os-card__toggle-option');
    // Toggle dropdown
    this.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });
    // Handle item selection
    this.items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectItem(item);
      });
    });
    // Handle keyboard navigation
    this.toggle.addEventListener('keydown', (e) => this.handleKeyboard(e));
    // Set initial selected value
    const selectedItem = this.dropdown.querySelector('[os-element="dropdown-item"].selected');
    if (selectedItem) {
      this.selectedValue = selectedItem.getAttribute('os-variant-value');
      // Update toggle with selected item content
      this.updateToggleContent(selectedItem);
    }
  }
  calculateOptimalPosition() {
    const toggleRect = this.toggle.getBoundingClientRect();
    const menuHeight = this.menu.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    // Calculate space above and below
    const spaceBelow = viewportHeight - toggleRect.bottom;
    const spaceAbove = toggleRect.top;
    // Determine if we should position above or below
    const shouldPositionAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    // Calculate the position
    const position = {
      shouldPositionAbove,
      top: shouldPositionAbove ?
        -(menuHeight + 4) : // 4px gap when above
        toggleRect.height + 4 // 4px gap when below
    };
    return position;
  }
  updateDropdownPosition() {
    if (!this.isOpen) return;
    const position = this.calculateOptimalPosition();
    // Remove existing position classes
    this.menu.classList.remove('position-above', 'position-below');
    // Add appropriate position class
    if (position.shouldPositionAbove) {
      this.menu.classList.add('position-above');
      this.menu.style.bottom = `${this.toggle.offsetHeight + 4}px`;
      this.menu.style.top = 'auto';
    } else {
      this.menu.classList.add('position-below');
      this.menu.style.top = `${this.toggle.offsetHeight + 4}px`;
      this.menu.style.bottom = 'auto';
    }
  }
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      // Close all other dropdowns first
      VariantDropdown.closeAllDropdowns();
      this.openDropdown();
    }
  }
  openDropdown() {
    this.isOpen = true;
    this.toggle.classList.add('active');
    this.menu.classList.add('show');
    this.toggle.setAttribute('aria-expanded', 'true');
    // Calculate and set position
    this.updateDropdownPosition();
    // Add scroll and resize listeners for dynamic repositioning
    this.scrollHandler = () => this.updateDropdownPosition();
    this.resizeHandler = () => this.updateDropdownPosition();
    window.addEventListener('scroll', this.scrollHandler, true);
    window.addEventListener('resize', this.resizeHandler);
    // Add this instance to the list of open dropdowns
    VariantDropdown.openDropdowns.add(this);
  }
  closeDropdown() {
    this.isOpen = false;
    this.toggle.classList.remove('active');
    this.menu.classList.remove('show');
    this.toggle.setAttribute('aria-expanded', 'false');
    // Remove event listeners
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true);
      this.scrollHandler = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    // Remove position classes
    this.menu.classList.remove('position-above', 'position-below');
    // Remove this instance from the list of open dropdowns
    VariantDropdown.openDropdowns.delete(this);
  }
  updateToggleContent(item) {
    // Clone the content from the selected item
    const itemContent = item.querySelector('.os-card__toggle-option');
    if (itemContent && this.toggleContentWrapper) {
      // Clone the content
      const clonedContent = itemContent.cloneNode(true);
      // Replace the toggle content while preserving the wrapper
      this.toggleContentWrapper.innerHTML = clonedContent.innerHTML;
      // Copy any attributes from the item's content to maintain styling
      Array.from(clonedContent.attributes).forEach(attr => {
        this.toggleContentWrapper.setAttribute(attr.name, attr.value);
      });
    }
  }
  selectItem(item) {
    // Update selected state
    this.items.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    // Get selected values
    const value = item.getAttribute('os-variant-value');
    const colorClass = item.getAttribute('os-variant-color');
    const name = item.querySelector('[os-element="variant-name"]')?.textContent || '';
    // Update toggle display by cloning the selected item's content
    this.updateToggleContent(item);
    this.selectedValue = value;
    this.closeDropdown();
    // Dispatch custom event with dropdown identifier
    const event = new CustomEvent('variantSelected', {
      detail: {
        value,
        name,
        colorClass,
        component: this.dropdown,
        type: 'dropdown'
      }
    });
    document.dispatchEvent(event);
  }
  handleKeyboard(e) {
    if (!this.isOpen && e.key === 'Enter') {
      e.preventDefault();
      this.openDropdown();
    } else if (this.isOpen && e.key === 'Escape') {
      e.preventDefault();
      this.closeDropdown();
    } else if (this.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      this.navigateItems(e.key === 'ArrowDown' ? 1 : -1);
    }
  }
  navigateItems(direction) {
    const currentIndex = Array.from(this.items).findIndex(item =>
      item.classList.contains('selected')
    );
    const newIndex = Math.max(0, Math.min(this.items.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex) {
      this.items[newIndex].focus();
      this.selectItem(this.items[newIndex]);
    }
  }
  static openDropdowns = new Set();
  static closeAllDropdowns() {
    VariantDropdown.openDropdowns.forEach(dropdown => {
      dropdown.closeDropdown();
    });
  }
}
// Variant Swatches Class
class VariantSwatches {
  constructor(swatchesElement) {
    this.swatches = swatchesElement;
    this.items = swatchesElement.querySelectorAll('[os-element="swatch-item"]');
    this.selectedValue = null;
    this.init();
  }
  init() {
    // Handle item selection
    this.items.forEach(item => {
      // Skip if unavailable
      if (item.classList.contains('os-card__variant-swatch--unavailable')) {
        return;
      }
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectItem(item);
      });
      // Add keyboard support
      item.addEventListener('keydown', (e) => this.handleKeyboard(e, item));
      // Make focusable
      item.setAttribute('tabindex', '0');
    });
    // Set initial selected value
    const selectedItem = this.swatches.querySelector('[os-element="swatch-item"].os-card__variant-swatch--selected');
    if (selectedItem) {
      this.selectedValue = selectedItem.getAttribute('os-swatch');
    }
  }
  selectItem(item) {
    // Don't select unavailable items
    if (item.classList.contains('os-card__variant-swatch--unavailable')) {
      return;
    }
    // Update selected state
    this.items.forEach(i => i.classList.remove('os-card__variant-swatch--selected'));
    item.classList.add('os-card__variant-swatch--selected');
    // Get selected values
    const value = item.getAttribute('os-swatch');
    const variantValue = item.getAttribute('os-variant-value') || value;
    this.selectedValue = value;
    // Dispatch custom event
    const event = new CustomEvent('variantSelected', {
      detail: {
        value: variantValue,
        swatch: value,
        name: value,
        component: this.swatches,
        type: 'swatch'
      }
    });
    document.dispatchEvent(event);
  }
  handleKeyboard(e, item) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectItem(item);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigateItems(e.key === 'ArrowRight' ? 1 : -1, item);
    }
  }
  navigateItems(direction, currentItem) {
    const availableItems = Array.from(this.items).filter(item =>
      !item.classList.contains('os-card__variant-swatch--unavailable')
    );
    const currentIndex = availableItems.indexOf(currentItem);
    const newIndex = Math.max(0, Math.min(availableItems.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex && availableItems[newIndex]) {
      availableItems[newIndex].focus();
    }
  }
}
// Variant Buttons Class
class VariantButtons {
  constructor(buttonsElement) {
    this.buttons = buttonsElement;
    this.items = buttonsElement.querySelectorAll('[os-element="button-item"]');
    this.selectedValue = null;
    this.init();
  }
  init() {
    // Handle item selection
    this.items.forEach(item => {
      // Skip if unavailable
      if (item.classList.contains('os-card__variant-size--unavailable')) {
        return;
      }
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectItem(item);
      });
      // Add keyboard support
      item.addEventListener('keydown', (e) => this.handleKeyboard(e, item));
      // Make focusable
      item.setAttribute('tabindex', '0');
    });
    // Set initial selected value
    const selectedItem = this.buttons.querySelector('[os-element="button-item"].os-card__variant-size--selected');
    if (selectedItem) {
      this.selectedValue = selectedItem.getAttribute('os-variant-value') ||
        selectedItem.textContent.trim();
    }
  }
  selectItem(item) {
    // Don't select unavailable items
    if (item.classList.contains('os-card__variant-size--unavailable')) {
      return;
    }
    // Update selected state
    this.items.forEach(i => i.classList.remove('os-card__variant-size--selected'));
    item.classList.add('os-card__variant-size--selected');
    // Get selected values
    const value = item.getAttribute('os-variant-value') || item.textContent.trim();
    const name = item.textContent.trim();
    this.selectedValue = value;
    // Dispatch custom event
    const event = new CustomEvent('variantSelected', {
      detail: {
        value,
        name,
        component: this.buttons,
        type: 'button'
      }
    });
    document.dispatchEvent(event);
  }
  handleKeyboard(e, item) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectItem(item);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigateItems(e.key === 'ArrowRight' ? 1 : -1, item);
    }
  }
  navigateItems(direction, currentItem) {
    const availableItems = Array.from(this.items).filter(item =>
      !item.classList.contains('os-card__variant-size--unavailable')
    );
    const currentIndex = availableItems.indexOf(currentItem);
    const newIndex = Math.max(0, Math.min(availableItems.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex && availableItems[newIndex]) {
      availableItems[newIndex].focus();
    }
  }
}
// Variant Images Class
class VariantImages {
  constructor(imagesElement) {
    this.images = imagesElement;
    this.items = imagesElement.querySelectorAll('[os-element="image-item"]');
    this.selectedValue = null;
    this.init();
  }
  init() {
    // Handle item selection
    this.items.forEach(item => {
      // Skip if unavailable
      if (item.classList.contains('os-card__variant-image--unavailable')) {
        return;
      }
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectItem(item);
      });
      // Add keyboard support
      item.addEventListener('keydown', (e) => this.handleKeyboard(e, item));
      // Make focusable
      item.setAttribute('tabindex', '0');
    });
    // Set initial selected value
    const selectedItem = this.images.querySelector('[os-element="image-item"].os-card__variant-image--selected');
    if (selectedItem) {
      this.selectedValue = selectedItem.getAttribute('os-variant-value') ||
        selectedItem.querySelector('img')?.getAttribute('alt') ||
        'image-' + Array.from(this.items).indexOf(selectedItem);
    }
  }
  selectItem(item) {
    // Don't select unavailable items
    if (item.classList.contains('os-card__variant-image--unavailable')) {
      return;
    }
    // Update selected state
    this.items.forEach(i => i.classList.remove('os-card__variant-image--selected'));
    item.classList.add('os-card__variant-image--selected');
    // Get selected values
    const value = item.getAttribute('os-variant-value') ||
      item.querySelector('img')?.getAttribute('alt') ||
      'image-' + Array.from(this.items).indexOf(item);
    const imageSrc = item.querySelector('img')?.getAttribute('src');
    const imageAlt = item.querySelector('img')?.getAttribute('alt');
    this.selectedValue = value;
    // Dispatch custom event
    const event = new CustomEvent('variantSelected', {
      detail: {
        value,
        name: imageAlt || value,
        imageSrc,
        component: this.images,
        type: 'image'
      }
    });
    document.dispatchEvent(event);
  }
  handleKeyboard(e, item) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectItem(item);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigateItems(e.key === 'ArrowRight' ? 1 : -1, item);
    }
  }
  navigateItems(direction, currentItem) {
    const availableItems = Array.from(this.items).filter(item =>
      !item.classList.contains('os-card__variant-image--unavailable')
    );
    const currentIndex = availableItems.indexOf(currentItem);
    const newIndex = Math.max(0, Math.min(availableItems.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex && availableItems[newIndex]) {
      availableItems[newIndex].focus();
    }
  }
}
// Initialize all variant components
document.addEventListener('DOMContentLoaded', () => {
  const componentInstances = [];
  // Initialize dropdowns
  const dropdowns = document.querySelectorAll('[os-component="variant-dropdown"] .os-card__variant-dropdown-component');
  dropdowns.forEach(dropdown => {
    componentInstances.push(new VariantDropdown(dropdown));
  });
  // Initialize swatches
  const swatches = document.querySelectorAll('[os-component="variant-swatches"]');
  swatches.forEach(swatch => {
    componentInstances.push(new VariantSwatches(swatch));
  });
  // Initialize buttons
  const buttons = document.querySelectorAll('[os-component="variant-buttons"]');
  buttons.forEach(button => {
    componentInstances.push(new VariantButtons(button));
  });
  // Initialize images
  const images = document.querySelectorAll('[os-component="variant-images"]');
  images.forEach(image => {
    componentInstances.push(new VariantImages(image));
  });
  // Global click handler for dropdowns
  document.addEventListener('click', (e) => {
    const isClickInsideAnyDropdown = Array.from(dropdowns).some(dropdown =>
      dropdown.contains(e.target)
    );
    if (!isClickInsideAnyDropdown) {
      VariantDropdown.closeAllDropdowns();
    }
  });
  // Listen for all variant selection changes
  document.addEventListener('variantSelected', (e) => {
    console.log('Selected variant:', e.detail);
    // You can handle different component types
    switch (e.detail.type) {
      case 'dropdown':
        console.log('Dropdown selection:', e.detail.value);
        break;
      case 'swatch':
        console.log('Swatch selection:', e.detail.swatch);
        break;
      case 'button':
        console.log('Button selection:', e.detail.name);
        break;
      case 'image':
        console.log('Image selection:', e.detail.imageSrc);
        break;
    }
  });
});

// Inline script 5 from variant-selectors.html
// Card Selector Class
class CardSelector {
  constructor(selectorElement) {
    this.selector = selectorElement;
    this.cards = selectorElement.querySelectorAll('[os-element="card"]');
    this.selectedValue = null;
    this.selectorId = selectorElement.getAttribute('os-id');
    this.variantType = selectorElement.getAttribute('os-variant');
    this.init();
  }
  init() {
    // Handle card selection
    this.cards.forEach(card => {
      // Skip if unavailable
      if (card.classList.contains('os-card--unavailable')) {
        return;
      }
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCard(card);
      });
      // Add keyboard support
      card.addEventListener('keydown', (e) => this.handleKeyboard(e, card));
      // Ensure cards are focusable
      if (!card.getAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
    // Set initial selected value
    const selectedCard = this.selector.querySelector('[os-element="card"].os--selected');
    if (selectedCard) {
      this.selectedValue = selectedCard.getAttribute('os-value');
      this.updateRadioState(selectedCard);
    }
  }
  selectCard(card) {
    // Don't select unavailable cards
    if (card.classList.contains('os-card--unavailable')) {
      return;
    }
    // Update selected state
    this.cards.forEach(c => {
      c.classList.remove('os--selected');
      // Update radio button state
      const radio = c.querySelector('[os-component="radio"] [data-selected]');
      if (radio) {
        radio.setAttribute('data-selected', 'false');
      }
    });
    // Set new selected card
    card.classList.add('os--selected');
    this.updateRadioState(card);
    // Get selected values
    const value = card.getAttribute('os-value');
    const title = card.querySelector('.os-card__title')?.textContent?.trim() || '';
    const currentPrice = card.querySelector('.os-card__price.os--current')?.textContent?.trim() || '';
    const comparePrice = card.querySelector('.os-card__price.os--compare')?.textContent?.trim() || '';
    this.selectedValue = value;
    // Dispatch custom event
    const event = new CustomEvent('cardSelected', {
      detail: {
        value,
        title,
        currentPrice,
        comparePrice,
        selectorId: this.selectorId,
        variantType: this.variantType,
        component: this.selector,
        card: card,
        type: 'card'
      }
    });
    document.dispatchEvent(event);
  }
  updateRadioState(selectedCard) {
    // Update radio button for selected card
    const selectedRadio = selectedCard.querySelector('[os-component="radio"] [data-selected]');
    if (selectedRadio) {
      selectedRadio.setAttribute('data-selected', 'true');
    }
  }
  handleKeyboard(e, card) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectCard(card);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateCards(e.key === 'ArrowDown' ? 1 : -1, card);
    }
  }
  navigateCards(direction, currentCard) {
    const availableCards = Array.from(this.cards).filter(card =>
      !card.classList.contains('os-card--unavailable')
    );
    const currentIndex = availableCards.indexOf(currentCard);
    const newIndex = Math.max(0, Math.min(availableCards.length - 1, currentIndex + direction));
    if (newIndex !== currentIndex && availableCards[newIndex]) {
      availableCards[newIndex].focus();
    }
  }
  // Method to get current selection
  getCurrentSelection() {
    const selectedCard = this.selector.querySelector('[os-element="card"].os--selected');
    if (selectedCard) {
      return {
        value: selectedCard.getAttribute('os-value'),
        title: selectedCard.querySelector('.os-card__title')?.textContent?.trim() || '',
        currentPrice: selectedCard.querySelector('.os-card__price.os--current')?.textContent?.trim() || '',
        comparePrice: selectedCard.querySelector('.os-card__price.os--compare')?.textContent?.trim() || '',
        selectorId: this.selectorId,
        variantType: this.variantType
      };
    }
    return null;
  }
  // Method to programmatically select a card by value
  selectByValue(value) {
    const targetCard = this.selector.querySelector(`[os-element="card"][os-value="${value}"]`);
    if (targetCard) {
      this.selectCard(targetCard);
    }
  }
}
// Add to existing initialization
document.addEventListener('DOMContentLoaded', () => {
  const componentInstances = [];
  // Initialize existing variant components (dropdowns, swatches, buttons, images)
  // ... your existing initialization code ...
  // Initialize card selectors
  const cardSelectors = document.querySelectorAll('[os-component="selector"]');
  cardSelectors.forEach(selector => {
    componentInstances.push(new CardSelector(selector));
  });
  // Listen for card selection changes
  document.addEventListener('cardSelected', (e) => {
    console.log('Selected card:', e.detail);
    // Handle card selection
    console.log(`Card selected in ${e.detail.selectorId}:`, {
      value: e.detail.value,
      title: e.detail.title,
      price: e.detail.currentPrice,
      variantType: e.detail.variantType
    });
  });
  // Example: Listen for both card and variant selections
  document.addEventListener('variantSelected', (e) => {
    console.log('Variant selected:', e.detail);
  });
  // Store instances globally for external access
  window.cardSelectorInstances = componentInstances.filter(instance => instance instanceof CardSelector);
});