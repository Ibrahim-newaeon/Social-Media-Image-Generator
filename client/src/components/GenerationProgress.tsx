import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface GenerationStatus {
  current: number;
  total: number;
  completed: number;
  failed: number;
  currentPrompt?: string;
}

interface GenerationProgressProps {
  status: GenerationStatus;
  isVisible: boolean;
}

export default function GenerationProgress({ status, isVisible }: GenerationProgressProps) {
  if (!isVisible) return null;

  const progressPercent = status.total > 0 ? (status.current / status.total) * 100 : 0;
  const isComplete = status.current >= status.total && status.total > 0;

  return (
    <Card data-testid="card-generation-progress">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            value={status.current}
            label="Current"
            variant="default"
            testId="stat-current"
          />
          <StatCard
            icon={<Loader2 className="w-4 h-4" />}
            value={status.total}
            label="Total"
            variant="default"
            testId="stat-total"
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            value={status.completed}
            label="Success"
            variant="success"
            testId="stat-success"
          />
          <StatCard
            icon={<XCircle className="w-4 h-4" />}
            value={status.failed}
            label="Failed"
            variant="destructive"
            testId="stat-failed"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isComplete ? 'Generation complete!' : 'Generating images...'}
            </span>
            <span className="font-medium" data-testid="text-progress-percent">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" data-testid="progress-bar" />
          {status.currentPrompt && !isComplete && (
            <p className="text-sm text-muted-foreground truncate" data-testid="text-current-prompt">
              {status.currentPrompt}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant: 'default' | 'success' | 'destructive';
  testId: string;
}

function StatCard({ icon, value, label, variant, testId }: StatCardProps) {
  const bgClasses = {
    default: 'bg-muted/50',
    success: 'bg-chart-2/10',
    destructive: 'bg-destructive/10'
  };

  const textClasses = {
    default: 'text-foreground',
    success: 'text-chart-2',
    destructive: 'text-destructive'
  };

  return (
    <div className={`rounded-md p-4 ${bgClasses[variant]}`} data-testid={testId}>
      <div className={`flex items-center gap-2 ${textClasses[variant]} mb-1`}>
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
