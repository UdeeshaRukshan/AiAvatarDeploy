import { useState } from "react"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from 'lucide-react'
//import { Toast, ToastProvider, ToastViewport } from './components/ui/toast'

const formSchema = z.object({
  hair: z.string().min(2, {
    message: "Hair description must be at least 2 characters.",
  }),
  eyes: z.string().min(2, {
    message: "Eye color must be at least 2 characters.",
  }),
  face_shape: z.string().min(2, {
    message: "Face shape must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age is required.",
  }),
  gender: z.string().min(1, {
    message: "Gender is required.",
  }),
  Nationality: z.string().min(2, {
    message: "Nationality must be at least 2 characters.",
  }),
  Occupation: z.string().min(2, {
    message: "Occupation must be at least 2 characters.",
  }),
  dress: z.string().min(2, {
    message: "Dress description must be at least 2 characters.",
  }),
  customer_type: z.string().min(2, {
    message: "Customer type must be at least 2 characters.",
  }),
})

function App() {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hair: "",
      eyes: "",
      face_shape: "",
      age: "",
      gender: "",
      Nationality: "",
      Occupation: "",
      dress: "",
      customer_type: "",
    },
  })

  const generatePrompt = (data) => {
    return `A personalized avatar of a ${data.gender || "person"} with ${
      data.hair || "short black"
    } hair, ${data.eyes || "brown"} eyes, an ${
      data.face_shape || "oval"
    } face shape, aged around ${data.age || "30"}, of ${
      data.Nationality || "unknown nationality"
    } nationality, working as a ${data.Occupation || "professional"}, dressed in ${
      data.dress || "professional attire"
    }, and categorized as a ${data.customer_type || "regular"} customer.`
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const onSubmit = async (values) => {
    setLoading(true)
    setImageUrl(null)

    const prompt = generatePrompt(values)
    console.log("Generated Prompt:", prompt)
    console.log(process.env.TOKEN);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${"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"}`,
          },
          responseType: "arraybuffer",
        }
      )

      const imageBlob = new Blob([response.data], { type: "image/png" })
      const url = URL.createObjectURL(imageBlob)
      setImageUrl(url)
      showToast('Avatar generated successfully!')
    } catch (error) {
      console.error("Error generating avatar:", error)
      showToast('Failed to generate avatar. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Avatar Generator</h1>
              <p className="text-gray-600">Fill in the details below to generate your personalized avatar.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hair Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hair</label>
                  <input
                    {...form.register('hair')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., long brown"
                  />
                  {form.formState.errors.hair && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.hair.message}</p>
                  )}
                </div>

                {/* Eyes Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Eyes</label>
                  <input
                    {...form.register('eyes')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., blue"
                  />
                  {form.formState.errors.eyes && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.eyes.message}</p>
                  )}
                </div>

                {/* Face Shape Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Face Shape</label>
                  <select
                    {...form.register('face_shape')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select face shape</option>
                    <option value="oval">Oval</option>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="heart">Heart</option>
                  </select>
                  {form.formState.errors.face_shape && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.face_shape.message}</p>
                  )}
                </div>

                {/* Age Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    {...form.register('age')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., 25"
                  />
                  {form.formState.errors.age && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.age.message}</p>
                  )}
                </div>

                {/* Gender Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    {...form.register('gender')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                  {form.formState.errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.gender.message}</p>
                  )}
                </div>

                {/* Nationality Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <input
                    {...form.register('Nationality')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., French"
                  />
                  {form.formState.errors.Nationality && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.Nationality.message}</p>
                  )}
                </div>

                {/* Occupation Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    {...form.register('Occupation')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Designer"
                  />
                  {form.formState.errors.Occupation && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.Occupation.message}</p>
                  )}
                </div>

                {/* Dress Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dress Style</label>
                  <input
                    {...form.register('dress')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Business casual"
                  />
                  {form.formState.errors.dress && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.dress.message}</p>
                  )}
                </div>

                {/* Customer Type Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                  <select
                    {...form.register('customer_type')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select customer type</option>
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                  {form.formState.errors.customer_type && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.customer_type.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="inline-block animate-spin mr-2" />
                    Generating Avatar...
                  </>
                ) : (
                  'Generate Avatar'
                )}
              </button>
            </form>

            {imageUrl && (
              <div className="mt-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Generated Avatar</h2>
                <div className="inline-block relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                  <img
                    src={imageUrl}
                    alt="Generated Avatar"
                    className="w-64 h-64 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {toast.show && (
          <Toast className={`${toast.type === 'error' ? 'bg-red-100' : 'bg-green-100'} fixed bottom-4 right-4`}>
            {toast.message}
          </Toast>
        )} */}
        {/* <ToastViewport /> */}
      </div>
    
  )
}

export default App
