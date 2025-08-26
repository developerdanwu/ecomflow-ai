import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable(
  "orders",
  {
    // Primary identifiers
    orderPublicId: text("order_public_id").primaryKey(),
    platformPublicId: text("platform_public_id").notNull(),

    // Customer information
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),

    // Destination information
    destinationCountryCode: text("destination_country_code").notNull(),
    destinationCountry: text("destination_country").notNull(),

    // Order status (using integer based on the sample data showing "2")
    orderStatus: integer("order_status").notNull(),

    // Timestamps - SQLite stores timestamps as text or integer (unix timestamp)
    // Using text format for ISO 8601 datetime strings
    createdAt: text("created_at").notNull(),
    paidAt: text("paid_at"),
    shippedAt: text("shipped_at"),
    lastMileAvailableAt: text("last_mile_available_at"),
    infoReceivedAt: text("info_received_at"),
    inTransitAt: text("in_transit_at"),
    outForDeliveryAt: text("out_for_delivery_at"),
    deliveredAt: text("delivered_at"),
    failedAttemptAt: text("failed_attempt_at"),
    exceptionAt: text("exception_at"),
    expiredAt: text("expired_at"),
    availableForPickupAt: text("available_for_pickup_at"),

    // Shipping information
    shippingService: text("shipping_service"),
    trackNumberMasked: text("track_number_masked"),
    lastMileCarrier: text("last_mile_carrier"),
    lastMileTrackingMasked: text("last_mile_tracking_masked"),
  },
  (table) => [
    // Indexes for common query patterns
    index("orders_customer_email_idx").on(table.customerEmail),
    index("orders_status_idx").on(table.orderStatus),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_destination_country_idx").on(table.destinationCountryCode),
    index("orders_platform_idx").on(table.platformPublicId),
  ]
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
