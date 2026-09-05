export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">
          요청하신 견적서가 존재하지 않습니다.
        </p>
      </div>
    </div>
  );
}
