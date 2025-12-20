import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    value?: string | number;
}

export function FeatureCard({ title, description, icon, value }: FeatureCardProps) {
    return (
        <Card className="border border-border bg-card hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                    {icon && (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    {value && (
                        <div className="text-3xl font-bold">{value}</div>
                    )}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
