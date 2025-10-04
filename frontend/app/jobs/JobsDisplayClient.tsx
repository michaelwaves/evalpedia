"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
    job_id: string;
    config: {
        eval: string;
        model: string;
        limit: number;
        system_prompt: string | null;
        epochs: number;
        temperature: number;
        max_connections: number;
        task_arguments: Record<string, any>;
    };
    status: string;
    command: string;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
    error_message: string | null;
    process_id: string | null;
}

interface JobsDisplayClientProps {
    jobs: Job[];
}

function JobsDisplayClient({ jobs }: JobsDisplayClientProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500';
            case 'running':
                return 'bg-blue-500';
            case 'failed':
                return 'bg-red-500';
            case 'queued':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const calculateDuration = (start: string | null, end: string | null) => {
        if (!start) return 'N/A';
        const startTime = new Date(start).getTime();
        const endTime = end ? new Date(end).getTime() : Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        return `${duration}s`;
    };

    return (
        <div className="space-y-4">
            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No jobs found</p>
                    </CardContent>
                </Card>
            ) : (
                jobs.map((job) => (
                    <Card key={job.job_id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">
                                        {job.config.eval}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {job.job_id}
                                    </p>
                                </div>
                                <Badge className={getStatusColor(job.status)}>
                                    {job.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                                    <p className="text-sm font-mono">{job.config.model}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Limit</p>
                                    <p className="text-sm">{job.config.limit}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                                    <p className="text-sm">{job.config.temperature}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Epochs</p>
                                    <p className="text-sm">{job.config.epochs}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                                    <p className="text-sm">{formatDate(job.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Started</p>
                                    <p className="text-sm">{formatDate(job.started_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                    <p className="text-sm">{calculateDuration(job.started_at, job.completed_at)}</p>
                                </div>
                            </div>

                            {job.config.system_prompt && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">System Prompt</p>
                                    <p className="text-sm bg-muted p-2 rounded">{job.config.system_prompt}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Command</p>
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                    {job.command}
                                </pre>
                            </div>

                            {job.error_message && (
                                <div>
                                    <p className="text-sm font-medium text-destructive mb-1">Error</p>
                                    <p className="text-sm bg-destructive/10 text-destructive p-2 rounded">
                                        {job.error_message}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

export default JobsDisplayClient;