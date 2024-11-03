import db from "../index.js";
import createTransactionsTable from "./create-transactions-table.js";
import dropTransactionsTable from "../queries/drop-transactions-table.js";

const runDbMigrations = async () => {
  console.log("Migration started");
  const client = await db.connect();

  try {
    await client.query(createTransactionsTable);
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
