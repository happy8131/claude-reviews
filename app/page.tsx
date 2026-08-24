"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 다크모드 토글 */}
      <div className="fixed top-4 right-4 z-50">
        {mounted && (
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
            aria-label="토글 테마"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

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
            {/* Card + Avatar + Badge + Separator */}
            <Card className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">사용자 프로필</h3>
                    <p className="text-sm text-muted-foreground">
                      제임스 앨런
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>
              <Separator />
              <p className="text-sm text-foreground">
                모던 UI 컴포넌트를 사용해 멋진 인터페이스를 만들어 보세요.
              </p>
              <button className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </Card>

            {/* Card + Form 요소 */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">피드백 폼</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm">
                    이름
                  </Label>
                  <Input
                    id="name"
                    placeholder="당신의 이름을 입력하세요"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm">
                    메시지
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="피드백을 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={() => toast.success("감사합니다!")}
                  className="w-full"
                >
                  전송
                </Button>
              </div>
            </Card>

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

            {/* Toast Demo */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">알림(Toast)</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => toast.success("성공 메시지입니다!")}
                  variant="secondary"
                  className="w-full"
                >
                  성공 알림
                </Button>
                <Button
                  onClick={() => toast.error("오류가 발생했습니다!")}
                  variant="destructive"
                  className="w-full"
                >
                  오류 알림
                </Button>
                <Button
                  onClick={() => toast("일반 메시지입니다")}
                  variant="outline"
                  className="w-full"
                >
                  기본 알림
                </Button>
              </div>
            </Card>
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
