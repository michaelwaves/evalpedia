import { getJobs } from "@/lib/actions/evals/jobs";
import JobsDisplayClient from "./JobsDisplayClient";

export default async function JobsPage() {
    const jobs = await getJobs();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Jobs</h1>
            <JobsDisplayClient jobs={jobs} />
        </div>
    );
}
