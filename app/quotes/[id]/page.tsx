interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuotePage(props: PageProps) {
  const params = await props.params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">견적서 조회</h1>
        <p className="mt-2 text-muted-foreground">
          견적서 ID: {params.id}
        </p>
      </div>
    </div>
  );
}
