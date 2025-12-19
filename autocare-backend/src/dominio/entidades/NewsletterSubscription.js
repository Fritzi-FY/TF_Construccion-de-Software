class NewsletterSubscription {
  constructor(id, email, subscribedAt, isActive) {
    this.id = id;
    this.email = email;
    this.subscribedAt = subscribedAt;
    this.isActive = isActive;
  }

  static fromDatabase(row) {
    return new NewsletterSubscription(
      row.id,
      row.email,
      row.subscribed_at,
      row.is_active
    );
  }

  toDatabase() {
    return {
      email: this.email,
      subscribed_at: this.subscribedAt,
      is_active: this.isActive
    };
  }
}

module.exports = NewsletterSubscription;
