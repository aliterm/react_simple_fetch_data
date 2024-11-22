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
  const [loading, setLoading] = useState(true)
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (item) => {
    if (item.search) {
      setLoading(true)
      if (data) {
        const filtered: any = data.map((d) => {
          if (d.title.toLowerCase().includes(item.search.toLowerCase())) {
            return d
          }
        })
        setData(filtered)
      }

      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen justify-center items-center mb-10">
      <div className="w-8/12">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
          Show Data
        </button>

        <form onSubmit={handleSubmit(onSubmit)} method="get">
          <input placeholder="Search..." {...register('search')} />
          <button type="submit">Search</button>
        </form>

        <ul>
          {loading && !data && <li>Loading...</li>}
          {data &&
            !loading &&
            data.map((item, key) => (
              <li key={key}>
                <a
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
