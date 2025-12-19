class PromoCode {
  constructor(id, code, discountType, discountValue, validFrom, validTo, maxUses, currentUses, isActive) {
    this.id = id;
    this.code = code;
    this.discountType = discountType; // 'percentage' or 'fixed'
    this.discountValue = discountValue;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.maxUses = maxUses;
    this.currentUses = currentUses;
    this.isActive = isActive;
  }

  static fromDatabase(row) {
    return new PromoCode(
      row.id,
      row.code,
      row.discount_type,
      row.discount_value,
      row.valid_from,
      row.valid_to,
      row.max_uses,
      row.current_uses,
      row.is_active
    );
  }

  toDatabase() {
    return {
      code: this.code,
      discount_type: this.discountType,
      discount_value: this.discountValue,
      valid_from: this.validFrom,
      valid_to: this.validTo,
      max_uses: this.maxUses,
      current_uses: this.currentUses,
      is_active: this.isActive
    };
  }

  isValid() {
    const now = new Date();
    return this.isActive &&
           now >= this.validFrom &&
           now <= this.validTo &&
           (this.maxUses === null || this.currentUses < this.maxUses);
  }
}

module.exports = PromoCode;
