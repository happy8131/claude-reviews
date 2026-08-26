import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileCard } from "@/components/profile-card";
import { FeedbackForm } from "@/components/feedback-form";
import { ToastDemo } from "@/components/toast-demo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 다크모드 토글 */}
      <ThemeToggle />

      {/* 히어로 섹션 */}
      <section className="w-full py-20 px-4 md:py-32 md:px-8 flex items-center justify-center">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Next.js 스타터킷
          </h1>
          <p className="text-lg text-muted-foreground">
            모던 웹 개발을 위한 완벽한 시작점. Next.js v16, TypeScript, Tailwind CSS,
            그리고 shadcn/ui를 포함한 프로덕션 레벨의 스타터킷입니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button size="lg" variant="default">
              시작하기
            </Button>
            <Button size="lg" variant="outline">
              문서 보기
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-8" />

      {/* 컴포넌트 쇼케이스 섹션 */}
      <section className="w-full py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">컴포넌트 쇼케이스</h2>

          {/* 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileCard />
            <FeedbackForm />

            {/* Tabs */}
            <Card className="p-6 md:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">개요</TabsTrigger>
                  <TabsTrigger value="features">기능</TabsTrigger>
                  <TabsTrigger value="tech">기술 스택</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-2">
                  <h3 className="font-semibold">프로젝트 개요</h3>
                  <p className="text-sm text-muted-foreground">
                    이것은 Next.js를 기반으로 한 현대적인 웹 애플리케이션을
                    빠르게 시작할 수 있는 스타터킷입니다.
                  </p>
                </TabsContent>
                <TabsContent value="features" className="space-y-2">
                  <h3 className="font-semibold">주요 기능</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TypeScript 지원</li>
                    <li>• Tailwind CSS 스타일링</li>
                    <li>• 반응형 디자인</li>
                    <li>• 어두운 모드 지원</li>
                  </ul>
                </TabsContent>
                <TabsContent value="tech" className="space-y-2">
                  <h3 className="font-semibold">기술 스택</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Next.js v16</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <ToastDemo />
          </div>
        </div>
      </section>

      {/* 하단 정보 섹션 */}
      <section className="w-full py-12 px-4 md:px-8 bg-muted">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-semibold">시작할 준비가 되셨나요?</h3>
          <p className="text-muted-foreground">
            이 스타터킷을 기반으로 멋진 웹 애플리케이션을 만들어 보세요.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            <Badge variant="outline">빠른 개발</Badge>
            <Badge variant="outline">생산성</Badge>
            <Badge variant="outline">모던 스택</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
