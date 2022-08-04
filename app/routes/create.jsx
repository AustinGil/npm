import { redirect } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { z } from 'zod'
import { db } from '../services/index.js'
import DefaultLayout from '../layouts/Default.jsx'
import { Input, Btn } from '../components/index.js'

const types = ['dog', 'cat', 'bird', 'reptile', 'fish', 'bunny', 'other']
export const typeOptions = types.map(type => {
  return {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type
  }
})

export const petSchema = z.object({
  name: z.string().min(1),
  type: z.enum(types),
  birthday: z.preprocess((v) => {
      return v ? new Date(v) : undefined
    }, z.date().optional()
  )
})

export async function action({ request }) {
  const formData = await request.formData()
  const body = Object.fromEntries(formData.entries())

  const { error, success, data } = petSchema.safeParse(body)

  if (!success) {
    throw new Response('Not allowed', {
      status: 400
    })
  }
  // Add pet to DB
  // INSERT INTO tablename (col1, col2, col3) VALUES (val1, val2, val3)
  await db.pet.create({
    data: data
  })

  // Redirect back home
  return redirect('/')
}

export default function() {
  return <DefaultLayout title="Create">
    <Form method="POST" className="grid gap-4">
      <Input
        name="name"
        label="Name"
        id="name"
        required
      />

      <Input
        name="type"
        label="Type"
        id="type"
        required
        type="select"
        options={['', ...typeOptions]}
      />

      <Input
        name="birthday"
        label="Birthday"
        id="birthday"
        type="date"
      />

      <div className="flex items-center justify-between">
        <Btn type="submit">Add a pet</Btn>
        <Link to="/">Cancel</Link>
      </div>
    </Form>
  </DefaultLayout>
}