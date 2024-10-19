import db from "../index.js";
import createBillsTable from "./create-bills-table.js";

const runDbMigrations = async () => {
  console.log("Migration started");
  const client = await db.connect();

  try {
    await client.query(createBillsTable);
    await client.query('COMMIT');
    console.log("Migration successful");
  } catch (error) {
    console.error(error);
    console.log('DB Migration failed');
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default runDbMigrations;
