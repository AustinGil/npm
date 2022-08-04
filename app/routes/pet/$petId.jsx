import { useLoaderData, useTransition, Form } from '@remix-run/react'
import { db } from '../../services/index.js'
import DefaultLayout from '../../layouts/Default.jsx'
import { Input, Btn, Dialog } from '../../components/index.js'
import { typeOptions, petSchema } from '../create.jsx'

export async function loader({ params }) {
  const id = params.petId
  // SELECT * FROM Pet WHERE id = ??
  const pet = await db.pet.findFirst({
    where: {
      id: id,
    }
  })

  if (!pet) {
    throw new Response('Not allowed', {
      status: 404
    })
  }
  
  return {
    data: pet
  }
}

export async function action({ request, params }) {
  const formData = await request.formData()
  const body = Object.fromEntries(formData.entries())

  const { error, success, data } = petSchema.safeParse(body)

  if (!success) {
    throw new Response('Not allowed', {
      status: 400
    })
  }

  await new Promise(r => setTimeout(r, 500))
  
  const id = params.petId
  // UPDATE Pet SET col1 = val1, col2 = val2 .. WHERE id = ??
  const pet = await db.pet.update({
    where: {
      id: id
    },
    data: data
  })

  return {
    data: pet
  }
}

export default function() {
  /** @type {Awaited<ReturnType<typeof loader>>} */
  const { data: pet } = useLoaderData()
  const transition = useTransition()

  return <DefaultLayout title={transition.submission ? transition.submission?.formData.get('name') : pet.name}>
    <div className="border-2 rounded p-4 bg-white">
      <Form
        method="POST"
        className="grid gap-4 mb-8"
      >
        <Input
          name="name"
          label="Name"
          id="name"
          defaultValue={pet.name}
          required
        />

        <Input
          name="type"
          label="Type"
          id="type"
          required
          type="select"
          options={['', ...typeOptions]}
          defaultValue={pet.type}
        />

        <Input
          name="birthday"
          label="Birthday"
          id="birthday"
          type="date"
          defaultValue={pet.birthday ? new Date(pet.birthday).toISOString().split('T')[0] : ''}
        />

        <div>
          <Btn type="submit">{ transition.state !== 'idle' ? 'Saving...' : 'Save pet' }</Btn>
        </div>
      </Form>

      <Dialog id="delete-modal" toggle="Delete">
        <p className="mb-4">Are you sure you want to delete this pet?</p>

        <Form
          action={`/pet/${pet.id}/delete`}
          method="POST"
        >
          <Btn type="submit">Yes, delete this pet</Btn>
        </Form>
      </Dialog>
    </div>
  </DefaultLayout>
}