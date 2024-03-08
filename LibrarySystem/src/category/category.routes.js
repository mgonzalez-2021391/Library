import express from 'express'
import { create, deleteC, getCategories, getCategory, test, update } from './category.controller.js'

const api = express.Router();

api.get('/test', test)
api.post('/create', create)
api.get('/get', getCategories)
api.post('/search', getCategory)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteC)

export default api