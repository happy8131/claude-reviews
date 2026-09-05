interface ErrorPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ErrorPage(props: ErrorPageProps) {
  const searchParams = await props.searchParams;
  const reason = searchParams?.reason as string | undefined;

  const getErrorMessage = (reason?: string) => {
    switch (reason) {
      case "NOT_FOUND":
        return {
          title: "견적서를 찾을 수 없습니다",
          description: "요청하신 견적서가 존재하지 않습니다. 영업 담당자에게 정확한 링크를 재확인해 주세요.",
        };
      case "PRIVATE":
        return {
          title: "비공개 견적서입니다",
          description: "이 견적서는 비공개 상태입니다. 영업 담당자에게 문의해 주세요.",
        };
      case "EXPIRED":
        return {
          title: "유효기한이 지났습니다",
          description: "이 견적서의 유효기한이 만료되었습니다. 영업 담당자에게 새로운 견적서를 요청해 주세요.",
        };
      case "FETCH_FAILED":
        return {
          title: "일시적 조회 실패",
          description: "견적서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        };
      default:
        return {
          title: "오류가 발생했습니다",
          description: "요청을 처리하는 중 오류가 발생했습니다. 영업 담당자에게 문의해 주세요.",
        };
    }
  };

  const { title, description } = getErrorMessage(reason);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-destructive">{title}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
