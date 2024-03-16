// @ts-nocheck
import {
  FIRST_NAME,
  LAST_NAME,
  MISSING_FIRST_NAME,
  MISSING_LAST_NAME,
  INVALID_CARD_HOLDER,
  CARD_NUMBER_MISMATCH_BRAND_TYPE,
} from '../../locales/strings';

function translatePostcode(e) {
  const element = document.querySelector('.wpwl-control-postcode');
  element.value = [...element.value]
    .map((x) => x.codePointAt(0))
    .map((x) => String.fromCodePoint(x >= 1632 && x <= 1641 ? x - 1584 : x))
    .join('');
}

const createCustomField = (id, label, name, value) => {
  const html = `<div class="wpwl-group wpwl-group-cardHolder wpwl-clearfix">
  <div class="wpwl-label wpwl-label-${id}" name="wpwl-label-${name}">
    ${label}
  </div>
  <div class="wpwl-wrapper wpwl-wrapper-${id}">
    <input
        id="${id}"
      class="wpwl-control wpwl-control-${id}"
      name="${name}"
      placeholder="${label}"
      type="text"
      value="${value}"
      aria-label="${label}"
      autocomplete="off"
    />
  </div>
</div>`;
  return html;
};

const renderCustomFieldError = (element, msg, id) => {
  if (!element) {
    return;
  }
  const error = document.getElementById(id);
  if (!error) {
    const error = document.createElement('div');
    if (id) {
      error.id = id;
    }
    error.className = 'wpwl-hint wpwl-hint-' + id;
    error.innerText = msg;
    element?.after(error);
  }
};

export const validateCustomerName = (t) => {
  const firstNameId = 'customerFirstName';
  const lastNameId = 'customerLastName';

  const firstName = document.getElementById(firstNameId);
  const lastName = document.getElementById(firstNameId);

  const isValidFirstName = firstName && firstName.value.trim().length > 0;
  const isValidLastName = lastName && lastName.value.trim().length > 0;

  if (!isValidFirstName) {
    const element = document.getElementById(firstNameId);
    renderCustomFieldError(element, t[MISSING_FIRST_NAME]);
  }

  if (!isValidLastName) {
    const element = document.getElementById(lastNameId);
    renderCustomFieldError(element, t[MISSING_LAST_NAME]);
  }

  return isValidFirstName && isValidLastName;
};

function validateHolder(t) {
  const holder = document.querySelector('.wpwl-control-cardHolder');
  if (holder.value.trim().length < 2) {
    const dd = document.querySelector('.wpwl-control-cardHolder');
    dd.classList.add('wpwl-has-error');
    const error_div = document.createElement('div');
    dd.after(error_div);
    error_div.outerHTML = `<div class="wpwl-hint wpwl-hint-cardHolderError">${t[INVALID_CARD_HOLDER]}</div>`;
    return false;
  }
  return true;
}

let isValidCardBrand = false;

export const wpwlOptions = (i18n, t, initialValues, brand) => ({
  style: 'custom',
  locale: i18n.language,
  numberFormatting: i18n.language === 'ar' ? false : true,
  billingAddress: {
    country: 'SA',
  },
  mandatoryBillingFields: {
    country: true,
    state: true,
    city: true,
    postcode: true,
    street1: true,
    street2: false,
    customer: {
      givenName: true,
      surname: true,
    },
  },

  // Brand Detection Config.
  brandDetection: true,
  brandDetectionType: 'binlist',
  brandDetectionPriority: ['MADA', 'VISA', 'MASTER'],

  onReady: function (e) {
    const container = document.createElement('div');
    const firstName = createCustomField(
      'customerFirstName',
      t[FIRST_NAME],
      'customer.givenName',
      initialValues[FIRST_NAME]
    );
    const lastName = createCustomField('customerLastName', t[LAST_NAME], 'customer.surname', initialValues[LAST_NAME]);
    container.innerHTML = firstName + lastName;
    const form = document.getElementsByClassName('wpwl-form-card')[0];
    if (form) {
      form.prepend(container);
    }
    translatePostcode(e);
  },
  onDetectBrand: function (detectedBrand) {
    const [first] = detectedBrand;
    isValidCardBrand = brand?.toLowerCase() === first?.toLowerCase();
    const cardNumberElement = document.getElementsByClassName('wpwl-wrapper-cardNumber')[0];
    if (!isValidCardBrand) {
      cardNumberElement.classList.add('wpwl-has-error');
      renderCustomFieldError(cardNumberElement, t[CARD_NUMBER_MISMATCH_BRAND_TYPE], 'cardBrandError');
    } else {
      cardNumberElement.classList.remove('wpwl-has-error');
      const error = document.getElementById('cardBrandError');
      if (error) {
        error.remove();
      }
      document.getElementsByName('card.number')[0].focus();
    }
  },

  onBeforeSubmitCard: function () {
    return isValidCardBrand & validateHolder(t) & validateCustomerName(t);
  },
});
