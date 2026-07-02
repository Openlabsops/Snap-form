import { Card, CardContent } from "@repo/ui/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">

        {/* Animated checkmark */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <svg
                className="w-9 h-9 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            You&rsquo;re all set 🎉
          </h1>
          <p className="text-muted-foreground text-sm">
            Welcome to your dashboard. Your profile is ready to go.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <Card className="p-4 space-y-1 opacity-50 cursor-not-allowed select-none">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Forms
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">No forms yet</div>
          </Card>

          <Card className="p-4 space-y-1 opacity-50 cursor-not-allowed select-none">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Responses
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">No responses yet</div>
          </Card>
        </div>

        {/* Coming soon notice */}
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">
              🚧 &nbsp;Dashboard is under construction. More features coming soon.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
