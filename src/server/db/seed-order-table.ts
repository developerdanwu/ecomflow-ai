import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { readFileSync } from "fs";
import { join } from "path";
import { orders } from "./schema";

const db = drizzle(process.env.DB_FILE_NAME!);

// CSV parsing function
function parseCSV(csvContent: string) {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(",");
  const rows = lines.slice(1);

  return rows.map((row) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Add the last value

    // Create object from headers and values
    const obj: Record<string, string | null> = {};
    headers.forEach((header, index) => {
      const value = values[index] || "";
      obj[header.trim()] = value === "" ? null : value;
    });

    return obj;
  });
}

// Transform CSV data to match schema
function transformOrderData(csvRow: any) {
  return {
    orderPublicId: csvRow.orderPublicId,
    platformPublicId: csvRow.platformPublicId,
    customerName: csvRow.customerName,
    customerEmail: csvRow.customerEmail,
    destinationCountryCode: csvRow.destinationCountryCode,
    destinationCountry: csvRow.destinationCountry,
    orderStatus: csvRow.orderStatus ? parseInt(csvRow.orderStatus) : null,
    createdAt: csvRow.createdAt,
    paidAt: csvRow.paidAt,
    shippedAt: csvRow.shippedAt,
    lastMileAvailableAt: csvRow.lastMileAvailableAt,
    infoReceivedAt: csvRow.infoReceivedAt,
    inTransitAt: csvRow.inTransitAt,
    outForDeliveryAt: csvRow.outForDeliveryAt,
    deliveredAt: csvRow.deliveredAt,
    failedAttemptAt: csvRow.failedAttemptAt,
    exceptionAt: csvRow.exceptionAt,
    expiredAt: csvRow.expiredAt,
    availableForPickupAt: csvRow.availableForPickupAt,
    shippingService: csvRow.shippingService,
    trackNumberMasked: csvRow.trackNumberMasked,
    lastMileCarrier: csvRow.lastMileCarrier,
    lastMileTrackingMasked: csvRow.lastMileTrackingMasked,
  };
}

async function seedOrders() {
  try {
    console.log("🌱 Starting to seed orders table...");

    // Read the CSV file
    const csvPath = join(__dirname, "data_case_study_q325.csv");
    const csvContent = readFileSync(csvPath, "utf-8");

    // Parse CSV data
    const csvData = parseCSV(csvContent);
    console.log(`📊 Parsed ${csvData.length} rows from CSV`);

    // Transform data to match schema
    const orderData = csvData.map(transformOrderData);

    // Insert data in batches
    const batchSize = 20;
    let inserted = 0;

    for (let i = 0; i < orderData.length; i += batchSize) {
      const batch = orderData.slice(i, i + batchSize);

      try {
        await db.insert(orders).values(batch as any);
        inserted += batch.length;
        console.log(
          `✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${inserted}/${
            orderData.length
          } orders`
        );
      } catch (error) {
        console.error(
          `❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        console.log(
          "First row in failed batch:",
          JSON.stringify(batch[0], null, 2)
        );
        break;
      }
    }

    console.log(`🎉 Successfully seeded ${inserted} orders!`);
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedOrders()
    .then(() => {
      console.log("✨ Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
