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
        <Card className="light-card dark:glass-card border-border/50 dark:border-border/50 hover:border-accent/50 transition-all group">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                    {icon && (
                        <div className="w-12 h-12 rounded-lg bg-accent/5 dark:bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                            {icon}
                        </div>
                    )}
                    {value && (
                        <div className="text-4xl font-bold notion-text-gradient dark:text-foreground">{value}</div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
