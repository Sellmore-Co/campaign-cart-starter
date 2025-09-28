// T-Shirts Demo - Ultra-Optimized Version
// All functionality preserved with reduced code size

// ============================================
// CONFIGURATION SECTION - EASY TO MODIFY
// ============================================
const CONFIG = {
  // Navigation URLs
  urls: {
    checkoutStep2: '2step-billing', // URL for the checkout 2nd step
  },

  // Product Images by Color
  colors: {
    images: {
      'white': 'https://cdn.29next.store/media/demo/uploads/white.png',
      'gray': 'https://cdn.29next.store/media/demo/uploads/gray.png',
      'black': 'https://cdn.29next.store/media/demo/uploads/black.png',
    },
    styles: {
      'white': '#FFFFFF',
      'gray': '#808080',
      'black': '#000000',
    }
  },

  // Discount Configuration
  discounts: {
    base: { 1: 50, 2: 55, 3: 60 }, // Base discount percentages per tier
    exit: 10, // Additional exit discount percentage
    display: {
      1: { base: '50%', withExit: '55%' },
      2: { base: '55%', withExit: '60%' },
      3: { base: '60%', withExit: '65%' }
    }
  },

  // Display Order for Dropdowns
  displayOrder: {
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['White', 'Gray', 'Black']
  },

  // Size Preference Order (fallback logic)
  sizePreferenceOrder: [
    ['M', 'L', 'S'],
    ['L', 'M', 'S'],
    ['S', 'M', 'L']
  ],

  // Default Selections
  defaults: {
    color: 'black', // Default color (will find closest match)
    size: 'small', // Comment to NOT auto select size
  },

  // Exit Intent Configuration
  exitIntent: {
    enabled: true,
    image: '../../images/tshirts/exit-intent.png',
    discountText: '🎉 Extra 10% OFF Applied!',
  },

  // Button Text Configuration
  buttonText: {
    checkout: {
      complete: 'Next',
      incomplete: 'Complete All Selections'
    },
    loading: 'Loading...'
  },

  // Animation Timings (in milliseconds)
  timings: {
    notificationDuration: 5000, // How long notifications stay visible
    errorNotificationDuration: 3000,
    scrollOffset: 100, // Pixels from top when scrolling to elements
  },

  // Notification Styles
  notifications: {
    success: 'background:#4CAF50;',
    error: 'background:#ff4444;',
    info: 'background:#2196F3;'
  }
};

// ============================================
// END CONFIGURATION SECTION
// ============================================

// Base element class
class BaseElement extends HTMLElement {
  connectedCallback() {
    if (!this._mounted) {
      this._mounted = true;
      this.mount();
    }
  }
  mount() {}
  attributeChangedCallback(n, o, v) {
    if (o !== v) this.onAttributeChange?.(n, o, v);
  }
}

// Dropdown implementation
class OSDropdown extends BaseElement {
  static observedAttributes = ['value'];
  static openDropdowns = new Set();

  mount() {
    this._toggle = this.querySelector('button');
    this._menu = this.querySelector('os-dropdown-menu');
    if (!this._toggle || !this._menu) return;
    
    this._value = this.getAttribute('value');
    this._cleanupFn = null;
    this._setupEvents();
  }

  _setupEvents() {
    this._toggle.onclick = e => {
      e.stopPropagation();
      this.isOpen ? this.closeDropdown() : this.openDropdown();
    };
    
    this.addEventListener('dropdown-item-select', e => {
      const item = e.detail.item;
      this.value = item.value;
      this._updateSelection(item);
      this.closeDropdown();
      this.dispatchEvent(new CustomEvent('variantSelected', {
        detail: { value: item.value, component: this },
        bubbles: true
      }));
    });
    
    document.addEventListener('click', e => {
      if (!this.contains(e.target) && this.isOpen) this.closeDropdown();
    });
  }

  _updateSelection(selected) {
    this.querySelectorAll('os-dropdown-item').forEach(item => {
      item.classList.toggle('selected', item === selected);
    });
    // Update toggle content
    const content = selected?.querySelector('.os-card__toggle-option');
    const existing = this._toggle.querySelector('.os-card__toggle-option');
    if (existing && content) {
      const newContent = content.cloneNode(true);
      existing.replaceWith(newContent);
    }
  }

  openDropdown() {
    OSDropdown.closeAllDropdowns();
    this.setAttribute('open', '');
    this._toggle.classList.add('active');
    
    const updatePosition = () => {
      const toggleRect = this._toggle.getBoundingClientRect();
      const menuHeight = 300;
      const spaceBelow = window.innerHeight - toggleRect.bottom;
      const spaceAbove = toggleRect.top;
      const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      
      Object.assign(this._menu.style, {
        opacity: '1',
        visibility: 'visible',
        position: 'absolute',
        width: `${this.getBoundingClientRect().width}px`,
        zIndex: '1000',
        maxHeight: '300px',
        overflowY: 'auto',
        left: '0'
      });
      
      if (openAbove) {
        this._menu.style.top = 'auto';
        this._menu.style.bottom = `${this.offsetHeight + 8}px`;
        this._menu.style.transform = 'translateY(0)';
      } else {
        this._menu.style.top = `${this._toggle.offsetHeight + 8}px`;
        this._menu.style.bottom = 'auto';
        this._menu.style.transform = 'translateY(0)';
      }
    };
    
    updatePosition();
    
    const handleScroll = () => {
      if (this.isOpen) updatePosition();
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    this._cleanupFn = () => window.removeEventListener('scroll', handleScroll);
    
    OSDropdown.openDropdowns.add(this);
  }

  closeDropdown() {
    this.removeAttribute('open');
    this._toggle.classList.remove('active');
    Object.assign(this._menu.style, { opacity: '0', visibility: 'hidden' });
    if (this._cleanupFn) {
      this._cleanupFn();
      this._cleanupFn = null;
    }
    OSDropdown.openDropdowns.delete(this);
  }

  static closeAllDropdowns() {
    OSDropdown.openDropdowns.forEach(d => d.closeDropdown());
  }

  get value() { return this._value; }
  set value(val) {
    if (this._value === val) return; // Avoid unnecessary updates
    this._value = val;
    this.setAttribute('value', val);

    // Ensure the dropdown items are rendered before updating selection
    const updateSelection = () => {
      const item = this.querySelector(`os-dropdown-item[value="${val}"]`);
      if (item) {
        this._updateSelection(item);
      }
    };

    // If items aren't ready yet, defer the update
    if (this.querySelector('os-dropdown-item')) {
      updateSelection();
    } else {
      requestAnimationFrame(updateSelection);
    }
  }

  get isOpen() { return this.hasAttribute('open'); }
}

class OSDropdownMenu extends BaseElement {
  mount() {
    Object.assign(this.style, {
      position: 'absolute',
      zIndex: '1000',
      transition: 'opacity 0.2s, visibility 0.2s',
      opacity: '0',
      visibility: 'hidden'
    });
  }
}

class OSDropdownItem extends BaseElement {
  mount() {
    this._value = this.getAttribute('value');
    this.onclick = () => {
      if (!this.hasAttribute('disabled')) {
        this.closest('os-dropdown')?.dispatchEvent(
          new CustomEvent('dropdown-item-select', {
            detail: { item: this },
            bubbles: true
          })
        );
      }
    };
  }
  get value() { return this._value; }
}

// Main Controller
class TierController {
  constructor() {
    this.currentTier = 1;
    this.selectedVariants = new Map();
    this.productId = null;
    this.baseProductId = null;
    this.exitDiscountActive = false;
    this._cartTimer = null;
    this._cartUpdateTimer = null;
    this.init();
  }

  async init() {
    await this._waitForSDK();
    this._setupListeners();
    this._setupBFCacheHandler();

    // Get initial data
    this._getProductId();
    this._bindEvents();

    // Check for forceTier parameter
    this._checkForceTierParam();

    // Always initialize with default state
    this._initState();

    // No session storage - always start fresh
    this.exitDiscountActive = false;

    // Defer heavy operations
    requestAnimationFrame(() => {
      this._setupDropdowns();

      // Always set defaults since we're not checking cart
      this._setDefaultsWithoutCart();

      this._updatePrices();
      this._updateSavings();
    });
  }

  _waitForSDK() {
    return new Promise(r => {
      const check = () => window.next?.getCampaignData ? r() : setTimeout(check, 50);
      check();
    });
  }

  _updateTierUI(tier) {
    document.querySelectorAll('[data-next-tier]').forEach(card => {
      const t = +card.getAttribute('data-next-tier');
      card.classList.toggle('next-selected', t === tier);
      const radio = card.querySelector('.radio-style-1');
      if (radio) radio.setAttribute('data-selected', t === tier);
    });
  }

  _setDefaultsWithoutCart() {
    // Only called when no cart items exist - always start fresh
    const colors = window.next.getAvailableVariantAttributes(this.productId, 'color');
    const sizes = window.next.getAvailableVariantAttributes(this.productId, 'size');

    // Use configured default color
    const defaultColor = colors.find(c =>
      c.toLowerCase().includes(CONFIG.defaults.color.toLowerCase())
    ) || colors[0];

    // Use configured default size if set
    let defaultSize = null;
    if (CONFIG.defaults.size) {
      defaultSize = sizes.find(s =>
        s.toLowerCase().includes(CONFIG.defaults.size.toLowerCase())
      );
    }

    for (let i = 1; i <= this.currentTier; i++) {
      if (!this.selectedVariants.has(i)) {
        this.selectedVariants.set(i, {});
      }

      const v = this.selectedVariants.get(i);

      // Set color to configured default
      v.color = defaultColor;

      // Set size if configured
      if (defaultSize) {
        v.size = defaultSize;
      }

      // Defer UI updates to ensure dropdowns are populated
      requestAnimationFrame(() => {
        this._updateSlot(i, v);
        this._updateSlotPrice(i);
        this._updateStock(document.querySelector(`[next-tier-slot="${i}"]`), i);
      });
    }
  }

  _getProductId() {
    const campaign = window.next.getCampaignData();
    this.productId = campaign?.packages?.[0]?.product_id;
    if (!this.baseProductId && this.productId) {
      this.baseProductId = this.productId;
    }
  }

  _bindEvents() {
    document.querySelectorAll('[data-next-tier]').forEach(card => {
      card.onclick = () => this.selectTier(+card.getAttribute('data-next-tier'));
    });
    document.addEventListener('variantSelected', e => this._handleVariant(e.detail));

    // Step navigation button removed - both steps always visible

    // Handle checkout button
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    if (checkoutBtn) {
      // Set initial state
      this._updateCheckoutButton();

      checkoutBtn.onclick = async e => {
        e.preventDefault();
        if (!this._isComplete()) {
          e.stopPropagation();
          // Optionally highlight incomplete slots
          this._highlightIncompleteSlots();
        } else {
          // Add to cart and redirect
          await this._addToCartAndCheckout();
        }
      };
    }
  }

  _initState() {
    const selected = document.querySelector('.os-card.next-selected');
    const tier = selected ? +selected.getAttribute('data-next-tier') : 1;
    this.currentTier = tier;
    this._updateSlots(tier);
  }

  _checkForceTierParam() {
    // Check URL for forceTier parameter
    const urlParams = new URLSearchParams(window.location.search);
    const forceTier = urlParams.get('forceTier');

    if (forceTier) {
      const tierNum = parseInt(forceTier, 10);

      // Validate tier is 1, 2, or 3
      if (tierNum >= 1 && tierNum <= 3) {
        // Auto-select the tier
        this.currentTier = tierNum;

        // Update UI to show selected tier
        this._updateTierUI(tierNum);

        // Update slots
        this._updateSlots(tierNum);
      }
    }
  }

  async selectTier(tier, skipCartUpdate = false) {
    if (tier === this.currentTier) return;

    const prev = this.currentTier;
    this.currentTier = tier;

    // Update UI
    this._updateTierUI(tier);
    this._updateSlots(tier);

    // Copy selections from slot 1 to new slots
    if (tier > prev) {
      this._copySelectionsToNewSlots(prev, tier);
    }

    this._updateCTA();
    this._updateCheckoutButton(); // Update checkout button state

    // Auto-update cart when tier changes
    this._updateCartDebounced();
  }

  _copySelectionsToNewSlots(fromTier, toTier) {
    const slot1 = this.selectedVariants.get(1);
    if (!slot1?.color) return; // Only need color to be selected

    for (let i = fromTier + 1; i <= toTier; i++) {
      const newSelection = { color: slot1.color };

      // Copy size if slot1 has it (either from config or user selection)
      if (slot1.size) {
        newSelection.size = slot1.size;
      }

      this.selectedVariants.set(i, newSelection);
      this._updateSlot(i, newSelection);
      this._updateSlotPrice(i);
    }
  }

  _updateSlots(tier) {
    const container = document.querySelector('.os-slots');
    if (!container) return;

    const template = container.querySelector('[next-tier-slot="1"]');
    
    // Hide slots beyond tier
    container.querySelectorAll('[next-tier-slot]').forEach(slot => {
      const num = +slot.getAttribute('next-tier-slot');
      slot.style.display = num > tier ? 'none' : 'flex';
      slot.classList.toggle('active', num <= tier);
    });

    // Create missing slots
    for (let i = 2; i <= tier; i++) {
      if (!container.querySelector(`[next-tier-slot="${i}"]`) && template) {
        const slot = template.cloneNode(true);
        slot.setAttribute('next-tier-slot', i);
        const label = slot.querySelector('[data-next-bind="slot-number"]');
        if (label) label.textContent = `#${i}`;
        container.appendChild(slot);
      }
    }

    // Populate all visible slots
    for (let i = 1; i <= tier; i++) {
      const slot = container.querySelector(`[next-tier-slot="${i}"]`);
      if (slot) {
        this._populateDropdowns(slot, i);
        this._updateSlotPrice(i);
      }
    }
  }

  _updateSlot(slotNum, variants) {
    const slot = document.querySelector(`[next-tier-slot="${slotNum}"]`);
    if (!slot) return;

    ['color', 'size'].forEach(type => {
      if (variants[type]) {
        const dropdown = slot.querySelector(`os-dropdown[next-variant-option="${type}"]`);
        if (dropdown) {
          // Ensure dropdown is initialized before updating
          if (!dropdown._mounted) {
            // Wait for dropdown to be mounted
            requestAnimationFrame(() => {
              this._updateSlot(slotNum, { [type]: variants[type] });
            });
            return;
          }

          // Set the value and trigger the dropdown's internal update
          dropdown.setAttribute('value', variants[type]);
          dropdown._value = variants[type];

          // Find and select the matching item
          const matchingItem = dropdown.querySelector(`os-dropdown-item[value="${variants[type]}"]`);
          if (matchingItem && dropdown._updateSelection) {
            dropdown._updateSelection(matchingItem);
          }

          if (type === 'color') {
            this._updateSwatch(dropdown, variants[type]);
            this._updateImage(slot, variants[type]);
          }
        }
      }
    });
  }

  async activateExitDiscount() {
    if (!CONFIG.exitIntent.enabled) return;
    
    this.exitDiscountActive = true;
    // No session storage - exit discount only active for current session

    this._updateAllPrices();

    // Show success notification
    this._showNotification(CONFIG.exitIntent.discountText, 'success');
  }

  _showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position:fixed;top:20px;left:50%;transform:translateX(-50%);
      ${CONFIG.notifications[type]}color:white;padding:12px 24px;border-radius:8px;
      z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15);
      font-size:14px;font-weight:500;animation:slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    const duration = type === 'error' ? 
      CONFIG.timings.errorNotificationDuration : 
      CONFIG.timings.notificationDuration;
    
    setTimeout(() => notification.remove(), duration);
  }

  _handleVariant({ value, component }) {
    const slot = component.closest('[next-tier-slot]');
    if (!slot) return;

    const slotNum = +slot.getAttribute('next-tier-slot');
    const type = component.getAttribute('next-variant-option');

    if (!this.selectedVariants.has(slotNum)) {
      this.selectedVariants.set(slotNum, {});
    }

    const variants = this.selectedVariants.get(slotNum);
    variants[type] = value;

    // Auto-select if OOS
    if (variants.color && variants.size && this._isVariantOOS(slotNum, variants)) {
      const alt = this._findAvailableAlternative(slotNum, type, value);
      if (alt) {
        const otherType = type === 'color' ? 'size' : 'color';
        variants[otherType] = alt;
        this._updateSlot(slotNum, { [otherType]: alt });
      }
    }

    if (type === 'color') {
      this._updateSwatch(component, value);
      this._updateImage(slot, value);
    }

    this._updateStock(slot, slotNum);
    this._updateSlotPrice(slotNum);

    this._updateCTA();
    this._updateCheckoutButton(); // Update button state on selection change

    // Auto-update cart whenever selections change
    this._updateCartDebounced();
  }

  _updateSwatch(dropdown, color) {
    // Update the swatch in the dropdown toggle button
    const swatch = dropdown?.querySelector('.os-card__variant-dropdown-toggle .os-card__option-swatch');
    if (swatch && color) {
      const key = color.toLowerCase().replace(/\s+/g, '-');
      if (CONFIG.colors.styles[key]) {
        swatch.style.backgroundColor = CONFIG.colors.styles[key];
      }
    }
  }

  _updateImage(slot, color) {
    const img = slot.querySelector('[next-tier-slot-element="image"]');
    if (!img) return;

    const slotNum = +slot.getAttribute('next-tier-slot');
    const v = this.selectedVariants.get(slotNum);

    // Try to get image from campaign API first
    if (v?.color && v?.size) {
      const pid = (slotNum === 1 && this.baseProductId) || this.productId;
      const pkg = window.next.getPackageByVariantSelection(pid, { color: v.color, size: v.size });

      // Check if package has product_image or image URL
      if (pkg?.product_image || pkg?.image) {
        img.style.opacity = '0.5';
        img.src = pkg.product_image || pkg.image;
        img.onload = () => img.style.opacity = '1';
        return;
      }
    }

    // Fallback to configured placeholder images
    if (color) {
      const key = color.toLowerCase().replace(/\s+/g, '-');
      if (CONFIG.colors.images[key]) {
        img.style.opacity = '0.5';
        img.src = CONFIG.colors.images[key];
        img.onload = () => img.style.opacity = '1';
      }
    }
  }

  async _addToCartAndCheckout() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const loader = checkoutBtn?.querySelector('[data-pb-element="checkout-button-spinner"]');
    const buttonContent = checkoutBtn?.querySelector('[data-pb-element="checkout-button-info"]');

    // Show spinner
    if (loader && buttonContent) {
      loader.style.display = 'flex';
      loader.style.alignItems = 'center';
      loader.style.justifyContent = 'center';
      buttonContent.style.display = 'none';
    }

    try {
      // Build cart items
      const items = [];
      for (let i = 1; i <= this.currentTier; i++) {
        const v = this.selectedVariants.get(i);
        if (v?.color && v?.size) {
          const pkg = window.next.getPackageByVariantSelection(
            this.baseProductId || this.productId,
            { color: v.color, size: v.size }
          );
          if (pkg) {
            items.push({ packageId: pkg.ref_id, quantity: 1 });
          }
        }
      }

      // Add to cart
      if (items.length > 0) {
        await window.next.swapCart(items);
        // Small delay to ensure cart is updated
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Redirect to configured checkout URL
      window.location.href = CONFIG.urls.checkoutStep2;
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Hide spinner on error
      if (loader && buttonContent) {
        loader.style.display = 'none';
        buttonContent.style.display = 'block';
      }

      // Show error message
      this._showNotification('Error adding items to cart. Please try again.', 'error');
    }
  }

  _setupDropdowns() {
    if (!this.productId) return;
    this._updateSlots(this.currentTier);
  }

  _populateDropdowns(slot, slotNum) {
    const pid = (slotNum === 1 && this.baseProductId) || this.productId;
    const colors = window.next.getAvailableVariantAttributes(pid, 'color');
    const sizes = window.next.getAvailableVariantAttributes(pid, 'size');

    this._fillDropdown(slot, 'color', colors, slotNum);
    this._fillDropdown(slot, 'size', sizes, slotNum);
  }

  _fillDropdown(slot, type, options, slotNum) {
    const dropdown = slot.querySelector(`os-dropdown[next-variant-option="${type}"]`);
    const menu = dropdown?.querySelector('os-dropdown-menu');
    if (!menu) return;

    menu.innerHTML = '';
    const currentVariants = this.selectedVariants.get(slotNum) || {};

    // Set default text for size dropdown if no selection
    if (type === 'size' && !currentVariants.size) {
      const toggle = dropdown?.querySelector('.os-card__variant-toggle-name');
      if (toggle) {
        toggle.textContent = 'Select Your Size';
      }
    }

    this._sortOptions(options, type).forEach(opt => {
      const item = document.createElement('os-dropdown-item');
      item.setAttribute('value', opt);
      item.className = 'os-card__variant-dropdown-item';

      // Mark as selected if this is the current value
      if (currentVariants[type] === opt) {
        item.classList.add('selected');
      }

      // Check OOS
      const testVariants = { ...currentVariants, [type]: opt };
      if (testVariants.color && testVariants.size) {
        if (this._isVariantOOS(slotNum, testVariants)) {
          item.classList.add('next-oos');
        }
      }

      const key = opt.toLowerCase().replace(/\s+/g, '-');
      item.innerHTML = type === 'color'
        ? `<div class="os-card__toggle-option">
            <div class="os-card__variant-toggle-info">
              <div class="os-card__option-swatch" style="background-color:${CONFIG.colors.styles[key] || '#ccc'}"></div>
              <div class="os-card__variant-toggle-name">${opt}</div>
            </div>
          </div>`
        : `<div class="os-card__toggle-option">
            <div class="os-card__variant-toggle-info">
              <div class="os-card__variant-toggle-name">${opt}</div>
            </div>
          </div>`;

      menu.appendChild(item);
    });

    // Ensure dropdown value is set if there's a current selection
    if (currentVariants[type] && dropdown) {
      dropdown.value = currentVariants[type];
    }
  }

  _sortOptions(options, type) {
    const order = CONFIG.displayOrder[type === 'color' ? 'colors' : 'sizes'];
    if (!order) return options;
    
    const map = new Map(order.map((v, i) => [v.toLowerCase(), i]));
    return [...options].sort((a, b) => {
      const ai = map.get(a.toLowerCase());
      const bi = map.get(b.toLowerCase());
      return (ai ?? 999) - (bi ?? 999);
    });
  }

  async _setDefaults() {
    const colors = window.next.getAvailableVariantAttributes(this.productId, 'color');
    const sizes = window.next.getAvailableVariantAttributes(this.productId, 'size');

    // Use configured default color
    const defaultColor = colors.find(c => 
      c.toLowerCase().includes(CONFIG.defaults.color.toLowerCase())
    ) || colors[0];

    for (let i = 1; i <= this.currentTier; i++) {
      if (!this.selectedVariants.has(i)) {
        this.selectedVariants.set(i, {});
      }

      const v = this.selectedVariants.get(i);

      // Set color to configured default, but leave size unselected
      v.color = defaultColor;
      // v.size = undefined; // User must select size

      this._updateSlot(i, v);
      this._updateSlotPrice(i);
      this._updateStock(document.querySelector(`[next-tier-slot="${i}"]`), i);
    }
  }

  _findAvailable(slotNum, type, otherValue) {
    const pid = (slotNum === 1 && this.baseProductId) || this.productId;
    const options = window.next.getAvailableVariantAttributes(pid, type);
    
    for (const opt of options) {
      const test = type === 'color' 
        ? { color: opt, size: otherValue }
        : { color: otherValue, size: opt };
      if (!this._isVariantOOS(slotNum, test)) return opt;
    }
    return null;
  }

  _updatePrices() {
    for (let i = 1; i <= this.currentTier; i++) {
      this._updateSlotPrice(i);
    }
    this._updateSavings();
  }

  _updateSlotPrice(slotNum) {
    const slot = document.querySelector(`[next-tier-slot="${slotNum}"]`);
    if (!slot) return;

    const v = this.selectedVariants.get(slotNum);
    if (!v?.color || !v?.size) {
      this._resetPrice(slot);
      return;
    }

    // Get the base package
    const basePkg = window.next.getPackageByVariantSelection(
      this.baseProductId || this.productId,
      { color: v.color, size: v.size }
    );

    if (!basePkg) {
      this._resetPrice(slot);
      return;
    }

    // For t-shirts demo, no profile mapping needed
    this._displayPrice(slot, basePkg);
  }

  _getMappedPackage(basePkg) {
    // For t-shirts demo, just return the base package
    return basePkg;
  }

  _displayPrice(slot, pkg) {
    const price = parseFloat(pkg.price);
    const retail = parseFloat(pkg.price_retail);

    const priceEl = slot.querySelector('[data-option="price"]');
    const regEl = slot.querySelector('[data-option="reg"]');

    if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
    if (regEl) regEl.textContent = `$${retail.toFixed(2)}`;

    // Handle savings percentage and profile discount display
    this._updateSavingsDisplay(slot, pkg, retail, price);

    const priceContainer = slot.querySelector('.os-card__price.os--current');
    if (priceContainer) {
      priceContainer.innerHTML = `<span data-option="price">$${price.toFixed(2)}</span>/ea`;
    }
  }

  _updateSavingsDisplay(slot, pkg, retail, finalPrice) {
    const pctEl = slot.querySelector('[data-option="savingPct"]');
    const profileSavingsEl = slot.querySelector('.data-profile-savings');

    // Use configured discount values
    const tierDiscounts = CONFIG.discounts.display[this.currentTier];

    if (this.exitDiscountActive) {
      // Show base savings and additional discount separately
      if (pctEl && tierDiscounts) {
        pctEl.textContent = tierDiscounts.base;
      }

      // Show the additional profile savings
      if (profileSavingsEl) {
        profileSavingsEl.style.display = 'block';
        profileSavingsEl.textContent = `+${CONFIG.discounts.exit}% OFF`;
      }
    } else {
      // Normal pricing - show base discount only
      if (pctEl && tierDiscounts) {
        pctEl.textContent = tierDiscounts.base;
      }

      // Hide profile savings when not active
      if (profileSavingsEl) {
        profileSavingsEl.style.display = 'none';
      }
    }
  }

  _resetPrice(slot) {
    ['[data-option="reg"]', '[data-option="price"]', '[data-option="savingPct"]'].forEach((sel, i) => {
      const el = slot.querySelector(sel);
      if (el) el.textContent = ['$XX.XX', '$XX.XX', 'XX%'][i];
    });

    // Also hide profile savings when resetting
    const profileSavingsEl = slot.querySelector('.data-profile-savings');
    if (profileSavingsEl) {
      profileSavingsEl.style.display = 'none';
    }
  }

  _updateStock(slot, slotNum) {
    if (!slot) return;
    
    const v = this.selectedVariants.get(slotNum) || {};

    ['color', 'size'].forEach(type => {
      const dropdown = slot.querySelector(`os-dropdown[next-variant-option="${type}"]`);
      dropdown?.querySelectorAll('os-dropdown-item').forEach(item => {
        const val = item.getAttribute('value');
        const check = type === 'color' 
          ? { color: val, size: v.size }
          : { color: v.color, size: val };
        
        if (check.color && check.size) {
          item.classList.toggle('next-oos', this._isVariantOOS(slotNum, check));
        }
      });
    });
  }

  _updateSavings() {
    [1, 2, 3].forEach(tier => {
      const discounts = CONFIG.discounts.display[tier];
      const displayValue = this.exitDiscountActive ? discounts.withExit : discounts.base;

      document.querySelectorAll(
        `[data-next-tier="${tier}"] [data-next-display*="bestSavingsPercentage"],
         [data-next-tier="${tier}"] .next-cart-has-items`
      ).forEach(el => {
        if (el) el.textContent = displayValue;
      });
    });
  }

  _updateCTA() {
    const complete = this._isComplete();
    document.querySelector('[data-cta="selection-pending"]')?.classList.toggle('active', !complete);
    document.querySelector('[data-cta="selection-complete"]')?.classList.toggle('active', complete);
  }

  _isComplete() {
    for (let i = 1; i <= this.currentTier; i++) {
      const v = this.selectedVariants.get(i);
      if (!v?.color || !v?.size) return false;
    }
    return true;
  }

  _setupListeners() {
    // Listen for cart changes that might be profile-related
    window.next.on('cart:updated', () => {
      if (this.profileUpdatePending) {
        this.profileUpdatePending = false;
        this._updateAllPrices();
      }
    });
  }

  _setupBFCacheHandler() {
    // Reset spinner state when page is restored from bfcache (back/forward navigation)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // Page was restored from bfcache
        this._resetCheckoutButtonSpinner();
      }
    });
  }

  _resetCheckoutButtonSpinner() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const loader = checkoutBtn?.querySelector('[data-pb-element="checkout-button-spinner"]');
    const buttonContent = checkoutBtn?.querySelector('[data-pb-element="checkout-button-info"]');

    if (loader && buttonContent) {
      loader.style.display = 'none';
      buttonContent.style.display = 'block';
    }
  }


  _onProfileChanged(eventData) {
    // Mark pending update and refresh data
    this.profileUpdatePending = true;
    this._getProductId();

    // Force price updates after a delay
    setTimeout(() => {
      this._updateAllPrices();
      this.profileUpdatePending = false;
    }, 200);
  }

  _updateAllPrices() {
    // Update dropdowns and re-select variants
    for (let i = 1; i <= this.currentTier; i++) {
      const slot = document.querySelector(`[next-tier-slot="${i}"]`);
      if (slot) {
        this._populateDropdowns(slot, i);

        const variants = this.selectedVariants.get(i);
        if (variants?.color && variants?.size) {
          this._updateSlot(i, variants);
        }
      }
    }

    // Update all prices and savings
    this._updatePrices();
  }


  _updateCheckoutButton() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const buttonText = checkoutBtn?.querySelector('.form-step__button--text');

    if (!checkoutBtn) return;

    if (this._isComplete()) {
      checkoutBtn.classList.remove('next-disabled');
      if (buttonText) {
        buttonText.textContent = CONFIG.buttonText.checkout.complete;
      }
    } else {
      checkoutBtn.classList.add('next-disabled');
      if (buttonText) {
        buttonText.textContent = CONFIG.buttonText.checkout.incomplete;
      }
    }
  }

  _highlightIncompleteSlots() {
    let firstIncomplete = null;

    for (let i = 1; i <= this.currentTier; i++) {
      const v = this.selectedVariants.get(i);
      const slot = document.querySelector(`[next-tier-slot="${i}"]`);

      if (!v?.color || !v?.size) {
        if (!firstIncomplete) firstIncomplete = slot;

        if (slot) {
          // Add visual feedback
          slot.classList.add('error-highlight');
          setTimeout(() => {
            slot.classList.remove('error-highlight');
          }, 2000);
        }
      }
    }

    // Scroll to first incomplete slot
    if (firstIncomplete) {
      firstIncomplete.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  handleVerifyClick() {
    if (!this._isComplete()) {
      for (let i = 1; i <= this.currentTier; i++) {
        const v = this.selectedVariants.get(i);
        if (!v?.color || !v?.size) {
          document.querySelector(`[next-tier-slot="${i}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          break;
        }
      }
    }
    this._updateCTA();
    return this._isComplete();
  }
  
  // Consolidated OOS checking
  _isVariantOOS(slotNum, variant) {
    if (!variant.color || !variant.size) return false;
    
    const pid = (slotNum === 1 && this.baseProductId) || this.productId;
    const pkg = window.next.getPackageByVariantSelection(pid, variant);
    
    return !pkg || pkg.product_inventory_availability === 'out_of_stock' || 
           pkg.product_purchase_availability === 'unavailable';
  }
  
  _findAvailableAlternative(slotNum, changedType, newValue) {
    const pid = (slotNum === 1 && this.baseProductId) || this.productId;
    const slotVariants = this.selectedVariants.get(slotNum);
    const options = window.next.getAvailableVariantAttributes(pid,
      changedType === 'color' ? 'size' : 'color');

    const current = changedType === 'color' ? slotVariants.size : slotVariants.color;

    // Try to keep current value
    const test = changedType === 'color'
      ? { color: newValue, size: current }
      : { color: current, size: newValue };

    if (!this._isVariantOOS(slotNum, test)) return current;

    // Find alternative
    for (const opt of options) {
      const variant = changedType === 'color'
        ? { color: newValue, size: opt }
        : { color: opt, size: newValue };
      if (!this._isVariantOOS(slotNum, variant)) return opt;
    }

    return null;
  }

  _updateCartDebounced() {
    // Clear existing timer
    if (this._cartUpdateTimer) {
      clearTimeout(this._cartUpdateTimer);
    }

    // Set new timer to update cart after 500ms of no changes
    this._cartUpdateTimer = setTimeout(() => {
      this._updateCart();
    }, 500);
  }

  async _updateCart() {
    // Build cart items for selected slots
    const items = [];
    let hasValidItems = false;

    for (let i = 1; i <= this.currentTier; i++) {
      const v = this.selectedVariants.get(i);
      if (v?.color && v?.size) {
        const pkg = window.next.getPackageByVariantSelection(
          this.baseProductId || this.productId,
          { color: v.color, size: v.size }
        );
        if (pkg) {
          items.push({ packageId: pkg.ref_id, quantity: 1 });
          hasValidItems = true;
        }
      }
    }

    // Only update cart if we have valid items
    if (hasValidItems) {
      try {
        await window.next.swapCart(items);
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  }
}

// Progress Bar
class ProgressBar {
  constructor() {
    this.items = document.querySelectorAll('[data-progress]');
    this.sections = document.querySelectorAll('[data-progress-trigger]');
    this.completed = new Set();
    this._init();
  }

  _init() {
    const check = () => {
      const center = window.pageYOffset + window.innerHeight / 2;
      
      this.sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const bottom = window.pageYOffset + rect.top + rect.height;
        if (center > bottom) {
          this.completed.add(s.getAttribute('data-progress-trigger'));
        }
      });
      
      let active = null;
      for (const s of this.sections) {
        const rect = s.getBoundingClientRect();
        const top = window.pageYOffset + rect.top;
        if (center >= top && center <= top + rect.height) {
          active = s.getAttribute('data-progress-trigger');
          break;
        }
      }
      
      this.items.forEach(item => {
        const name = item.getAttribute('data-progress');
        item.classList.remove('active', 'completed');
        if (this.completed.has(name)) {
          item.classList.add('completed');
        } else if (name === active) {
          item.classList.add('active');
        }
      });
    };
    
    const handleScroll = () => requestAnimationFrame(check);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    check();
  }
}

// Register elements
customElements.define('os-dropdown', OSDropdown);
customElements.define('os-dropdown-menu', OSDropdownMenu);
customElements.define('os-dropdown-item', OSDropdownItem);

// Initialize
window.addEventListener('next:initialized', () => {
  window.tierController = new TierController();
  
  const btn = document.querySelector('[os-checkout="verify-step"]');
  if (btn) {
    btn.onclick = e => {
      if (window.tierController && !window.tierController.handleVerifyClick()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  }
  
  // Exit intent
  if (CONFIG.exitIntent.enabled) {
    window.next.exitIntent({
      image: CONFIG.exitIntent.image,
      action: async () => {
        if (window.tierController) {
          await window.tierController.activateExitDiscount();
        }
      }
    });
  }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  .three-quarter-spinner.black {
    border-color: #000;
    border-top-color: transparent;
  }

  .next-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .error-highlight {
    animation: errorPulse 0.5s ease-in-out 2;
    border: 2px solid #ff4444 !important;
    background-color: rgba(255, 68, 68, 0.05) !important;
  }

  @keyframes errorPulse {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
    100% { transform: translateX(0); }
  }
`;
document.head.appendChild(style);

// Progress bar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressBar = new ProgressBar();
  });
} else {
  window.progressBar = new ProgressBar();
}