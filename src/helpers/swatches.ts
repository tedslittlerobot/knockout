
interface Swatches {
  battleText: { text: string }[]
}
type SwatchKey = keyof Swatches

const swatches: Swatches = {
  battleText: [
    { text: 'text-orange-500' },
    { text: 'text-pink-500' },
    { text: 'text-indigo-500' },
    { text: 'text-lime-500' },
    { text: 'text-teal-500' },
    { text: 'text-sky-500' },
    { text: 'text-violet-500' },
    { text: 'text-fuchsia-500' },
  ],
}

export default function swatch(key: SwatchKey, index: number) {
  const swatch = swatches[key]

  return swatch[index % swatch.length]
}
