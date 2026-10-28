type PlaceholderPageProps = {
  title: string
  description: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="">
      <div className="mb-7">
        <p className="text-sm font-semibold text-brand-600">
          Flowspace workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>

      <div className="rounded-panel border border-dashed border-slate-300 bg-surface p-6 shadow-card sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
            ✦
          </div>

          <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-950">
            Your workspace starts here
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-500">
            This page is connected to the app router. We'll build its real
            features in the upcoming checkpoints.
          </p>
        </div>
      </div>
    </section>
  )
}
