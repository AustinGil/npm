import { redirect } from "@remix-run/node"
import { db } from '../../services/index.js'

export async function action({ params }) {
  const id = params.petId
  // DELETE FROM Pet WHERE id = ??
  await db.pet.delete({
    where: {
      id: id
    }
  })
  return redirect('/')
}