import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <ThemeToggle />
      <h1 className="text-2xl font-semibold">견적서 웹 뷰어</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        영업 담당자로부터 전달받은 견적서 링크로 접속해 주세요.
      </p>
    </div>
  );
}
