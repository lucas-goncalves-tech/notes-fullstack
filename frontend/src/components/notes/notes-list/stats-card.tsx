import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  color?: string;
  subtitle: string;
}

export function StatsCard({ title, value, color = "", subtitle }: StatsCardProps) {
  return (
    <Card className={`flex items-center justify-center py-10 ${color}`}>
      <CardContent>
        <div className="text-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        </div>
      </CardContent>
    </Card>
  );
}