type PlaceholderPageProps = {
  title: string
  description: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section>
      <p className="text-sm font-medium text-indigo-600">Flowspace workspace</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
            ✦
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Your workspace starts here
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This page is connected to the app router. We'll build its real
            features in the upcoming checkpoints.
          </p>
        </div>
      </div>
    </section>
  )
}
