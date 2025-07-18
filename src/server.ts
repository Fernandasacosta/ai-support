import express from 'express'
import { completionsSchema } from './validations/completions'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.post('/conversations/completions', (req, res) => {
  const validatedBody = completionsSchema.safeParse(req.body)

  if (validatedBody.error) res.status(400).json({ error: validatedBody.error.message })

  res.send('API funcionando!')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})