// Mock Stripe fixtures for testing

export const stripeFixtures = {
  // Checkout Sessions
  checkoutSession: {
    id: "cs_test_123",
    object: "checkout.session",
    after_expiration: null,
    allow_promotion_codes: null,
    amount_subtotal: 900,
    amount_total: 900,
    automatic_tax: { enabled: false },
    billing_address_collection: null,
    cancel_url: "http://localhost:3000/pricing",
    client_reference_id: "user_test_123",
    consent: null,
    consent_collection: null,
    currency: "usd",
    customer: "cus_test_123",
    customer_creation: "if_required",
    customer_details: {
      address: null,
      email: null,
      name: null,
      phone: null,
      tax_exempt: "none",
      tax_ids: [],
    },
    customer_email: "user@example.com",
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    livemode: false,
    locale: null,
    metadata: {
      userId: "user_test_123",
      tier: "pro",
    },
    mode: "subscription",
    payment_intent: null,
    payment_link: null,
    payment_method_collection: null,
    payment_method_options: null,
    payment_method_types: ["card"],
    payment_status: "paid",
    phone_number_collection: null,
    recovered_from: null,
    setup_intent: null,
    status: "complete",
    submit_type: "auto",
    subscription: "sub_test_123",
    success_url: "http://localhost:3000/billing/success?session_id={CHECKOUT_SESSION_ID}",
    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
    url: "https://checkout.stripe.com/pay/cs_test_123",
  },

  // Subscriptions
  subscription: {
    id: "sub_test_123",
    object: "subscription",
    active: true,
    application: null,
    application_fee_percent: null,
    automatic_tax: { enabled: false },
    billing_cycle_anchor: Math.floor(Date.now() / 1000),
    billing_thresholds: null,
    cancel_at: null,
    cancel_at_period_end: false,
    canceled_at: null,
    collection_method: "charge_automatically",
    created: Math.floor(Date.now() / 1000),
    currency: "usd",
    current_period_end: Math.floor(Date.now() / 1000) + 2592000,
    current_period_start: Math.floor(Date.now() / 1000),
    customer: "cus_test_123",
    days_until_due: null,
    default_payment_method: "pm_test_123",
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    discounts: [],
    ended_at: null,
    items: {
      object: "list",
      data: [
        {
          id: "si_test_123",
          object: "subscription_item",
          billing_thresholds: null,
          created: Math.floor(Date.now() / 1000),
          currency: "usd",
          custom_price: null,
          metadata: {},
          price: {
            id: "price_pro_monthly",
            object: "price",
            active: true,
            billing_scheme: "per_unit",
            created: 1234567890,
            currency: "usd",
            custom_unit_amount: null,
            livemode: false,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: "prod_pro",
            recurring: {
              aggregate_usage: null,
              interval: "month",
              interval_count: 1,
              meter: null,
              usage_type: "licensed",
            },
            tax_behavior: "unspecified",
            tiers_mode: null,
            transform_quantity: null,
            type: "recurring",
            unit_amount: 900,
            unit_amount_decimal: "900",
          },
          quantity: 1,
          subscription: "sub_test_123",
          tax_rates: [],
        },
      ],
      has_more: false,
      total_count: 1,
      url: "/v1/subscription_items?subscription=sub_test_123",
    },
    latest_invoice: "in_test_123",
    livemode: false,
    metadata: {
      userId: "user_test_123",
    },
    next_pending_invoice_item_invoice: null,
    on_behalf_of: null,
    pause_collection: null,
    payment_settings: {
      network_token: "preferred",
      save_default_payment_method: null,
    },
    pending_invoice_item_interval: null,
    pending_setup_intent: null,
    pending_update: null,
    schedule: null,
    start_date: Math.floor(Date.now() / 1000),
    status: "active",
    test_clock: null,
    transfer_data: null,
    trial_end: null,
    trial_settings: null,
    trial_start: null,
  },

  // Customers
  customer: {
    id: "cus_test_123",
    object: "customer",
    address: null,
    balance: 0,
    created: Math.floor(Date.now() / 1000),
    currency: "usd",
    default_source: null,
    delinquent: false,
    description: "Test Customer",
    discount: null,
    email: "user@example.com",
    invoice_prefix: "INV",
    invoice_settings: {
      custom_fields: null,
      default_payment_method: null,
      footer: null,
      rendering_options: null,
    },
    livemode: false,
    metadata: {
      userId: "user_test_123",
    },
    name: "Test User",
    next_invoice_sequence: 1,
    phone: null,
    preferred_locales: [],
    shipping: null,
    sources: {
      object: "list",
      data: [],
      has_more: false,
      total_count: 0,
      url: "/v1/customers/cus_test_123/sources",
    },
    tax_exempt: "none",
    tax_ids: {
      object: "list",
      data: [],
      has_more: false,
      total_count: 0,
      url: "/v1/customers/cus_test_123/tax_ids",
    },
  },

  // Webhook Events
  checkoutCompletedEvent: {
    id: "evt_test_checkout_completed",
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "cs_test_123",
        customer: "cus_test_123",
        subscription: "sub_test_123",
        payment_status: "paid",
        metadata: {
          userId: "user_test_123",
        },
      },
      previous_attributes: null,
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: "checkout.session.completed",
  },

  subscriptionUpdatedEvent: {
    id: "evt_test_subscription_updated",
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "sub_test_123",
        customer: "cus_test_123",
        status: "active",
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
      },
      previous_attributes: {
        status: "past_due",
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: "customer.subscription.updated",
  },

  subscriptionDeletedEvent: {
    id: "evt_test_subscription_deleted",
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: "sub_test_123",
        customer: "cus_test_123",
        status: "canceled",
        canceled_at: Math.floor(Date.now() / 1000),
      },
      previous_attributes: {
        status: "active",
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: "customer.subscription.deleted",
  },

  // Invoice
  invoice: {
    id: "in_test_123",
    object: "invoice",
    account_country: "US",
    account_name: "Upshift Learning",
    account_tax_id: null,
    amount_due: 900,
    amount_paid: 900,
    amount_remaining: 0,
    application: null,
    application_fee_amount: null,
    attempt_count: 1,
    attempted: true,
    auto_advance: true,
    automatic_tax: { enabled: false, status: null },
    billing_reason: "subscription_cycle",
    charge: "ch_test_123",
    collection_method: "charge_automatically",
    created: Math.floor(Date.now() / 1000),
    currency: "usd",
    custom_fields: null,
    customer: "cus_test_123",
    customer_address: null,
    customer_email: "user@example.com",
    customer_name: "Test User",
    customer_phone: null,
    customer_shipping: null,
    customer_tax_exempt: "none",
    customer_tax_ids: [],
    default_payment_method: "pm_test_123",
    default_source: null,
    default_tax_rates: [],
    description: null,
    discounts: [],
    due_date: null,
    ending_balance: 0,
    footer: null,
    from_invoice: null,
    hosted_invoice_url: "https://invoice.stripe.com/i/acct_test",
    invoice_pdf: "https://invoice.stripe.com/pdf/i/acct_test",
    last_finalization_error: null,
    last_finalization_error_type: null,
    livemode: false,
    metadata: {},
    next_payment_attempt: null,
    number: "0001",
    on_behalf_of: null,
    paid: true,
    paid_out_of_band: false,
    payment_intent: null,
    payment_settings: {
      payment_method_options: null,
      payment_method_types: null,
      default_mandate: null,
    },
    period_end: Math.floor(Date.now() / 1000),
    period_start: Math.floor(Date.now() / 1000) - 2592000,
    post_payment_credit_notes_amount: 0,
    pre_payment_credit_notes_amount: 0,
    quote: null,
    receipt_number: null,
    rendering_options: null,
    rendering: null,
    schedule: null,
    starting_balance: 0,
    statement_descriptor: null,
    status: "paid",
    status_transitions: {
      finalized_at: Math.floor(Date.now() / 1000),
      marked_uncollectible_at: null,
      paid_at: Math.floor(Date.now() / 1000),
      voided_at: null,
    },
    subscription: "sub_test_123",
    subtotal: 900,
    subtotal_excluding_tax: 900,
    tax: null,
    test_clock: null,
    total: 900,
    total_discount_amounts: [],
    total_excluding_tax: 900,
    total_tax_amounts: [],
    transfer_data: null,
    webhooks_delivered_at: Math.floor(Date.now() / 1000),
  },
};

// Helper functions for testing
export const stripeHelpers = {
  // Create a valid Stripe webhook signature for testing
  createWebhookSignature(payload: string, secret: string): string {
    // In production, this would use crypto.createHmac
    // For testing, we mock it
    return `t=${Math.floor(Date.now() / 1000)},v1=test_signature`;
  },

  // Mock Stripe event processing
  processEvent(event: any) {
    switch (event.type) {
      case "checkout.session.completed":
        return {
          userId: event.data.object.metadata?.userId,
          subscriptionId: event.data.object.subscription,
          customerId: event.data.object.customer,
          tier: "pro",
        };
      case "customer.subscription.updated":
        return {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
          status: event.data.object.status,
        };
      case "customer.subscription.deleted":
        return {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
          tier: "free",
        };
      default:
        return null;
    }
  },

  // Verify webhook signature
  verifySignature(signature: string, secret: string): boolean {
    // Mock verification - in production uses crypto
    return signature.includes("v1=");
  },

  // Create test subscription with custom properties
  createSubscription(overrides?: Partial<typeof stripeFixtures.subscription>) {
    return {
      ...stripeFixtures.subscription,
      ...overrides,
    };
  },

  // Create test customer with custom properties
  createCustomer(overrides?: Partial<typeof stripeFixtures.customer>) {
    return {
      ...stripeFixtures.customer,
      ...overrides,
    };
  },

  // Create test event with custom properties
  createEvent(type: string, data: any) {
    return {
      id: `evt_test_${Date.now()}`,
      object: "event",
      created: Math.floor(Date.now() / 1000),
      type,
      data,
      livemode: false,
      pending_webhooks: 1,
    };
  },
};
