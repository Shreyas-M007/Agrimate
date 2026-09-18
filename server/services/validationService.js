// Validation Service for Agricultural Data & Search Inputs
// Enforces PRD Section 7, 9 & 22 constraints

const VALID_UNITS = ['kg', 'quintal', 'tonne'];

export class ValidationService {
  /**
   * Validates search inputs from farmer/client
   */
  static validateSearchInput(query = {}) {
    const errors = [];

    if (!query.crop || typeof query.crop !== 'string' || query.crop.trim() === '') {
      errors.push('Crop name is required');
    }

    if (query.quantity === undefined || query.quantity === null || isNaN(Number(query.quantity))) {
      errors.push('Quantity must be a valid number');
    } else if (Number(query.quantity) <= 0) {
      errors.push('Invalid quantity: Require a quantity greater than zero');
    }

    if (query.unit) {
      const normalizedUnit = String(query.unit).toLowerCase();
      if (!VALID_UNITS.includes(normalizedUnit)) {
        errors.push(`Invalid unit "${query.unit}". Supported units are: kg, quintal, tonne.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates a market price record before saving it to database/DynamoDB
   * Enforces: min_price <= modal_price <= max_price and proper source attributions.
   */
  static validatePriceRecord(record = {}) {
    const errors = [];

    const commodityName = record.commodity_name || record.crop;
    if (!commodityName || String(commodityName).trim() === '') {
      errors.push('Commodity name is missing');
    }

    if (!record.market_id || String(record.market_id).trim() === '') {
      errors.push('Market ID is missing');
    }

    if (!record.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(record.date).trim())) {
      errors.push('Date must be in YYYY-MM-DD format');
    }

    const min = Number(record.min_price);
    const modal = Number(record.modal_price);
    const max = Number(record.max_price);

    if (isNaN(min) || min < 0) {
      errors.push('Min price must be a non-negative number');
    }
    if (isNaN(modal) || modal < 0) {
      errors.push('Modal price must be a non-negative number');
    }
    if (isNaN(max) || max < 0) {
      errors.push('Max price must be a non-negative number');
    }

    if (!isNaN(min) && !isNaN(modal) && !isNaN(max)) {
      if (min > modal || modal > max) {
        errors.push('Invalid price hierarchy: Must satisfy min_price <= modal_price <= max_price');
      }
    }

    if (!record.source || String(record.source).trim() === '') {
      errors.push('Source identification is required');
    }

    if (!record.source_timestamp || String(record.source_timestamp).trim() === '') {
      errors.push('Source timestamp is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default ValidationService;
