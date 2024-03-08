import express from 'express'
import { test, register, login, update, deleteU, registerAdmin, updateRole, getPurchases } from './user.controller.js';

const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/registerAdmin', registerAdmin)
api.post('/login', login)
api.put('/update/:id', update)
api.put('/updateRole/:id', updateRole)
api.delete('/delete/:id', deleteU)
api.get('/bills',  getPurchases)

export default api