const createBillsTable = `
  CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    necessity VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL
  );
`;

export default createBillsTable;
