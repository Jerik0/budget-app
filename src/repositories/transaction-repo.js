import db from '../../db/index.js';

const create = async ({ name, amount, date, necessity, category, chargeType, frequency }) => {
  const query = `
    INSERT INTO
        transactions (name, amount, date, necessity, category, charge_type, frequency)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  ;`

  try {
    const result = await db.query(query, [name, amount, date, necessity, category, chargeType, frequency]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const findAll = async () => {
  const query = `
    SELECT * FROM
      transactions
  ;`;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (e) {
    console.log(e);
  }
}

const findById = async (id) => {
  const query = `
  SELECT * FROM
    transactions
  WHERE
    id = $1
  ;`;

  try {
    const result = await db.query(query, [+id]);

    // transform data from database to be consistent with expected data chargeType in front end.
    result.rows[0].chargeType = result.rows[0].charge_type;
    delete result.rows[0].charge_type;

    console.log('result from repo: ', result.rows[0]);

    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const updateOne = async (id, { name, amount, date, necessity, category, chargeType, frequency }) => {
  const query = `
    UPDATE
      transactions
    SET
      name = $2,
      amount = $3,
      date = $4,
      necessity = $5,
      category = $6,
      charge_type = $7,
      frequency = $8
    WHERE id = $1
    RETURNING *
  ;`;

  try {
    const result = await db.query(query, [+id, name, amount, date, necessity, category, chargeType, frequency]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const deleteTransactions = async (values) => {
  try {
    const ids = values.split(',');
    const parsedIds = ids.map(id => parseInt(id));

    const query = `
    DELETE FROM
      transactions
    WHERE
      id IN (${parsedIds})
  ;`;

    try {
      const result = await db.query(query);
      return `Deleted ${result.rowCount} rows :)`;
    } catch (e) {
      console.log(e.message);
    }
  } catch (e) {
    console.log(e.message);
  }
}

export default {
  create, findAll, findById, updateOne, deleteTransactions
};
