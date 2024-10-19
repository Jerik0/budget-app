import Router from 'express';
import billRepo from "../src/repositories/bill-repo.js";

const router = Router();

router.post('/', async (req, res) => {
  console.log('req.body',req.body);
  const result = await billRepo.create(req.body);
  res.status(201).json(result);
});

router.get('/', async (req, res) => {
  const result = await billRepo.findAll();
  res.status(200).json(result);
});

router.get('/:id', async (req, res) => {
  const result = await billRepo.findById(+req.params.id);
  res.status(200).json(result);
});

router.put('/:id', async (req, res) => {
  const result = await billRepo.update(+req.params.id, req.body);
  res.status(200).json(result);
})

router.delete('/:id', async (req, res) => {
  const result = await billRepo.delete(+req.params.id);
  res.status(200).json(result);
})

export default router;
