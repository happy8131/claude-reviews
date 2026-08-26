"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FeedbackForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("감사합니다!");
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold">피드백 폼</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
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
        <Button type="submit" className="w-full">
          전송
        </Button>
      </form>
    </Card>
  );
}
