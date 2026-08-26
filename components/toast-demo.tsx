"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ToastVariant = "secondary" | "destructive" | "outline";

interface ToastDemoItem {
  label: string;
  variant: ToastVariant;
  action: () => void;
}

export function ToastDemo() {
  const demos: ToastDemoItem[] = [
    {
      label: "성공 알림",
      variant: "secondary",
      action: () => toast.success("성공 메시지입니다!"),
    },
    {
      label: "오류 알림",
      variant: "destructive",
      action: () => toast.error("오류가 발생했습니다!"),
    },
    {
      label: "기본 알림",
      variant: "outline",
      action: () => toast("일반 메시지입니다"),
    },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold">알림(Toast)</h3>
      <div className="space-y-2">
        {demos.map((demo) => (
          <Button
            key={demo.label}
            onClick={demo.action}
            variant={demo.variant}
            className="w-full"
          >
            {demo.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
