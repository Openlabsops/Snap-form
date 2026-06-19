"use client";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-background">
      <div className="flex flex-col gap-2">
        <p className="text-foreground text-sm">card</p>
        <Card className="w-[450px] h-[300px]">
          <CardContent className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-foreground text-sm">button</p>
            <Button variant="outline">demo button</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
