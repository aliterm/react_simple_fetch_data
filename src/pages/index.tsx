import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface ResponseData {
  userId: number
  id: number
  title: string
  body: string
}

type Inputs = {
  search: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ResponseData[] | undefined>()

  const handleClick = async () => {
    setLoading(true)
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const json = (await res.json()) as ResponseData[]
    setData(json)
    setLoading(false)
  }

  const { register, handleSubmit } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    if (input.search) {
      setLoading(true)
      if (data) {
        const filteredResults = data.filter(
          (item) => item.title.toLowerCase().includes(input.search) || item.body.toLowerCase().includes(input.search),
        )
        setData(filteredResults)
      }

      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen justify-center items-center mb-10">
      <div className="w-8/12">
        <form onSubmit={handleSubmit(onSubmit)} method="get" className="my-5  mx-auto">
          <input
            placeholder="Search..."
            {...register('search')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 my-5 rounded">
            Search
          </button>
        </form>

        <button className="bg-blue-500 text-white font-bold py-2 px-4 my-5 rounded" onClick={handleClick}>
          Show Data
        </button>

        <ul>
          {loading && !data && <li>Loading...</li>}
          {data &&
            !loading &&
            data.map((item, key) => (
              <li key={key}>
                <a
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  href="#"
                  onClick={() => {
                    const element = document.getElementById(item.id.toString())
                    if (element) {
                      element.classList.toggle('hidden')
                    }
                  }}
                >
                  {item.id} - {item.title}
                </a>
                <div className="hidden my-5" id={item.id.toString()}>
                  <p>ID: {item.id}</p>
                  <p>UserId: {item.userId}</p>
                  <p>Body: {item.body}</p>
                  <p>Title: {item.title}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </main>
  )
}
