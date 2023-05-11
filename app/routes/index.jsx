import { useLoaderData, Form, useSearchParams, useSubmit } from '@remix-run/react'
import { db } from '../services/index.js'
import { debounce, pluralize } from '../utils.js'
import DefaultLayout from '../layouts/Default.jsx'
import { Grid, Card, Input, Btn, Pagination } from '../components/index.js'

const PER_PAGE = 12

export async function loader({ request }) {
  const url = new URL(request.url)
  const query = url.searchParams
  const currentPage = Math.max(Number(query.get('page') || 1), 1)
  /** @type {import('@prisma/client').Prisma.PetFindManyArgs} */
  const options = {
    take: PER_PAGE,
    skip: (currentPage - 1) * PER_PAGE,
    orderBy: {
      updatedAt: 'desc'
    }
  }
  const countOptions = {}

  if (query.get('search')) {
    options.where = {
      name: {
        contains: query.get('search'),
        mode: 'insensitive'
      }
    }
    countOptions.where = options.where
  }
  if (query.get('orderBy')) {
    const orderBy = query.get('orderBy')
    options.orderBy = {
      [orderBy]: query.get('orderDir') || 'asc'
    }
  }

  const [pets, count] = await Promise.all([
    // SELECT * FROM "Pet" WHERE name LIKE '%?%' ORDER BY column ASC|DESC LIMIT 12 OFFSET 1
    db.pet.findMany(options),
    // SELECT COUNT(id) FROM "Pet"
    db.pet.count(countOptions)
  ])
  return {
    data: pets,
    count: count
  }
}

export default function () {
  return (
    <DefaultLayout title="Pets!">
      <Form
        onChange={handleChange}
        className="grid sm:flex gap-x-4 gap-y-2 items-end flex-wrap"
      >
        <Input
          name="search"
          label="Search"
          id="search"
          defaultValue={searchParams.get('search') || ''}
          className="flex-grow"
        />
        
        <div className="order-1 w-full flex gap-8">
          <div className="flex gap-2">
            <label htmlFor="orderBy">Sort By:</label>
            <select name="orderBy" id="orderBy" className="p-0" defaultValue={searchParams.get('orderBy') || 'updatedAt'}>
              <option value="name">Name</option>
              <option value="updatedAt">Updated</option>
            </select>
          </div>
          <div className="flex gap-2">
            <label htmlFor="orderDir">Direction:</label>
            <select name="orderDir" id="orderDir" className="p-0" defaultValue={searchParams.get('orderDir') || 'desc'}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <Btn type="submit">
          Search
        </Btn>
      </Form>

      <div className="mt-4" aria-live="polite">
        <p>{`Displaying ${pets.length} of ${count}.`}</p>
      </div>

      <Grid items={pets.map(pet => (
        <Card to={`/pet/${pet.id}`} title={pet.name} type={pet.type}></Card>
      ))}></Grid>

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} pageParam="page" className="mt-8" />
      )}
    </DefaultLayout>
  );
}
