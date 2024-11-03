import Router from 'express';
import transactionRepo from "../src/repositories/transaction-repo.js";

const router = Router();

router.post('/', async (req, res) => {
  const result = await transactionRepo.create(req.body);
  res.status(201).json(result);
});

router.get('/', async (req, res) => {
  const result = await transactionRepo.findAll();
  res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  console.log(+req.params.id);
  const result = await transactionRepo.findById(+req.params.id);
  res.status(200).json(result);
});

router.put('/:id', async (req, res) => {
  const result = await transactionRepo.updateOne(+req.params.id, req.body);
  res.status(200).json(result);
});

router.delete('/', async (req, res) => {
  const result = await transactionRepo.deleteTransactions(req.query.ids);
  res.status(200).json(result);
})

export default router;
