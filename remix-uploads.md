Wooow…

I just went on a deep dive into how @remix_run handles file uploads. Some funny stuff there that I thoughts I'd share.

Whenever you want to access the body of a request in Remix, you'll use an `action`.

Remix actions provide access to a `request` object that has a `formData` method that returns a promise that resolves to a `FormData` object containing the data from the submitted form.

https://remix.run/docs/en/1.14.0/route/loader#request



This highlights one of my favorite features of Remix; their principle of following web standards.

In the brower, `formData` is also available on a `Request` object.

https://developer.mozilla.org/en-US/docs/Web/API/Request/formData

And they work MOSTLY the same way.



I say "MOSTLY" because they aren't quite a 1-to-1 match.

`FormData` is a web API

https://developer.mozilla.org/en-US/docs/Web/API/FormData

It's not natively available in servers using @nodejs.





So Remix provides a polyfill. What's the problem…?

On the web, you can grab file input data directly from a `FormData` object.

You get a File object something like this:

```js
{
  lastModified: 1678307291115,
  name: "filename.txt",
  size: 7,
  type: "application/octet-stream",
  webkitRelativePath: "",
}
```

https://developer.mozilla.org/en-US/docs/Web/API/File




Here's where things get weird with Remix.

Sending files require `multipart/form-data` requests.

Unfortunately, Remix's `request.formData` doesn't handle `multipart/form-data`.



They provide `unstable_parseMultipartFormData` to deal with those.

https://remix.run/docs/en/1.14.0/utils/parse-multipart-form-data

Great!

But that's not the whole story…



The multipart parser only helps you parse the request. You still have to do something with the data.

If you're handling file uploads, you can use their `unstable_createFileUploadHandler` to write to disk

https://remix.run/docs/en/1.14.0/utils/unstable-create-file-upload-handler

But this only processes the files. Not any other fields.

You need to use `unstable_composeUploadHandlers` to combine `unstable_createFileUploadHandler` for files and unstable_createMemoryUploadHandler for everything else.

Why not just one function? I have no idea.

```js
const uploadHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler(), // write files to disk and set the field value to an object
  unstable_createMemoryUploadHandler() // set every other field value to a string
);
const formData = await unstable_parseMultipartFormData(
  request,
  uploadHandler
);
```

Now you can grab all the fields and values from Remix's FormData object, but there's still some weirdness going on.

When you ask for a file input's value. You get an object that looks like a File. It's not. Well see why in a bit.

{
  lastModified: 0,
  webkitRelativePath: '',
  filepath: '/path/to/filename-1678304826128.txt',
  type: 'application/octet-stream',
  slicer: undefined,
  name: 'filename-1678304826128.txt'
}

Remix's file uploader conveniently writes files to disk for you.

But what if you want to send them somewhere else, like an S3 bucket?

To process the files differently, you have to build your own upload handler.

You can still use unstable_parseMultipartFormData.

You give it a function

the multipart parser will call that function with an object that looks like this

It's an async iterator

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator

{
  name: 'field-name',
  data: {
    next: [AsyncFunction: next],
    [Symbol(Symbol.asyncIterator)]: [Function: [Symbol.asyncIterator]]
  }
}

They use async iterators because file uploads can be very large and must be processed in small chunks at a time.

You can't do it all in memory or you risk running out of memory.

Whatever return will be used as the respective FormData data.

But there's a catch…

FormData fields can only have a value of string or Blob (including File)

https://developer.mozilla.org/en-US/docs/Web/API/FormData/set

If you try to use a plain object, your formData.get('field-name') will return "[object Object]"

Which isn't very helpful.

But File is another Web API that isn't supported in Node.js

So how does Remix's file uploader work…?

The answer is Symbol.toStringTag

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag

https://github.com/remix-run/remix/blob/main/packages/remix-node/upload/fileUploadHandler.ts#L231

Thanks for the help Michael Carter

I love the commitment to using web standards. It's less for me to learn if I have existing knowledge, and some of the things I learn doing Remix are web standards, so they're transferrable knowledge.

I'm not a huge fan of their decision to handle multipart formdata using complex composition upload handlers

Although they are clearly not a final design

The documentation is very sparse. Again, something to expect in an early project.

I also wonder why they're processing stream chunks with async iterators instead of continuing to use streams.

It's a shame they don't provide an escape hatch to access the underlying runtime, Node.js in my case. It would be great to be able to use existing tools like formidable, which works great.




