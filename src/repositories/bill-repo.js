import db from '../../db/index.js';

const create = async ({ name, amount, date, necessity, category }) => {
  const query = `
    INSERT INTO
        bills (name, amount, date, necessity, category)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING *
  ;`

  try {
    const result = await db.query(query, [name, amount, date, necessity, category]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const findAll = async () => {
  const query = `
    SELECT * FROM
      bills
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
    bills
  WHERE
    id = $1
  ;`;

  try {
    const result = await db.query(query, [+id]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const updateOne = async (id, { name, amount, date, necessity, category }) => {
  const query = `
    UPDATE
      bills
    SET
      name = $2,
      amount = $3,
      date = $4,
      necessity = $5,
      category = $6
    WHERE
      id = $1
    RETURNING *
  ;`;

  try {
    const result = await db.query(query, [+id, name, amount, date, necessity, category]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
}

const deleteBills = async (values) => {
  try {
    const ids = values.split(',');
    const parsedIds = ids.map(id => parseInt(id));

    const query = `
    DELETE FROM
      bills
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
  create, findAll, findById, updateOne, deleteBills
};
