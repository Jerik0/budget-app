const createBillsTable = `
  CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    necessity VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    charge_type VARCHAR(255) NOT NULL,
    frequency VARCHAR(255) NOT NULL
  );
`;

export default createBillsTable;
