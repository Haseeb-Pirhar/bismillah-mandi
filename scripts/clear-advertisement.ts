// @description Clears all advertisements from the database.

import { Request, Response } from "express";

import { Advertisement } from "../src/modules";
import { catchAsync } from "../src/utils";

export const ClearAdvertisementModel = catchAsync(async (req: Request, res: Response) => {
  try {
    await clearAdvertisementModels();
    return res.status(200).json({ message: "Cleanup completed successfully!" });
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message || "Error during cleanup", error });
  }
});

export async function clearAdvertisementModels(): Promise<void> {
  const advertisement = await Advertisement.deleteMany({});

  console.log("✅ Advertisements Cleared");
  console.log("Summary:");
  console.log(`Advertisements Deleted: ${advertisement.deletedCount}`);
}

// CLI entry point
if (require.main === module) {
  import("dotenv").then((dotenv) => {
    dotenv.config();
    import("mongoose").then(async (mongoose) => {
      const DB_URI = process.env.DB_URI;
      if (!DB_URI) {
        console.error("❌ DB_URI is not set");
        process.exit(1);
      }
      await mongoose.connect(DB_URI);
      console.log("✅ Connected to DB");
      try {
        await clearAdvertisementModels();
      } catch (err) {
        console.error("❌ Error during advertisement fixes:", err);
        process.exit(1);
      } finally {
        await mongoose.disconnect();
        process.exit(0);
      }
    });
  });
}
