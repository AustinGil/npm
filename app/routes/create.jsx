// import fs from 'fs'
import { redirect, unstable_createFileUploadHandler, unstable_parseMultipartFormData, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { useEffect } from 'react'
import { z } from 'zod'
import { Upload } from '@aws-sdk/lib-storage'
import { stream, s3Client } from '../utils.server.js'
import { db, s3 } from '../services/index.js'
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

class S3Object {
  /**
   * @param {string} filename 
   * @param {string?} contentType 
   */
  constructor(filename, contentType) {
    this.filename = encodeURIComponent(filename.replace(/ /gi, '_'))
    this.contentType = contentType
    this.name = this.getTimestampedName()
  }
  /** @type {string} */
  location;
  lastModified = 0;
  // This is how Remix tricks FormData into thinking it's a File so you don't get "[object Object]"
  get [Symbol.toStringTag]() {
    return "File";
  }
  getTimestampedName() {
    const parts = this.filename.split('.');
    const timestamp = `_${Date.now()}`
    let targetIndex = -1
    if (parts.length > 1) {
      targetIndex = -2
    }
    parts[parts.length + targetIndex] = parts.at(targetIndex) + timestamp
    return parts.join('.');
  }
}

/** @type {import('@remix-run/node').UploadHandler} */
const s3UploadHandler = async ({ filename, data, contentType }) => {
  if (filename != null) {
    const file = new S3Object(filename, contentType)
    const s = new stream.PassThrough()
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'npm',
        Key: file.name,
        Body: s,
        ACL: 'public-read',
      }
    })

    for await (const chunk of data) {
      s.write(chunk)
    }
    s.end()

    const response = await upload.done()
    file.location = response.Location
    return file
  }

  const result = [];
  for await (const chunk of data) {
    result.push(chunk);
  }

  if (!result.length) return undefined

  return Buffer.concat(result).toString();
}

/** @type {import('@remix-run/node').ActionFunction} */
export async function action({ request }) {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: (data) => {
        return data.filename
      },
      directory: 'public/uploads'
    }),
    unstable_createMemoryUploadHandler()
  );



  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
    // s3UploadHandler
  );

  for (const data of formData) {
    console.log(data)
  }
  // const formData = await request.formData()
  // const body = Object.fromEntries(formData.entries())

  return {}

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
  useEffect(() => {
    const input = document.querySelector('input[type="file"]')
    if (!input) return
    const dt = new DataTransfer()
    dt.items.add(new File([`content`], `filename.txt`))
    input.files = dt.files
  });

  return <DefaultLayout title="Create">
    <Form method="POST" className="grid gap-4" encType='multipart/form-data'>
      <Input
        name="name"
        label="Name"
        id="name"
        defaultValue="name"
      />

      <Input
        name="type"
        label="Type"
        id="type"
        type="select"
        options={['', ...typeOptions]}
        defaultValue="dog"
      />

      <Input
        name="photo"
        label="Photo"
        id="photo"
        type="file"
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