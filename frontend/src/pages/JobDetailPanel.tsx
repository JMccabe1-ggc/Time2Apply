import { Button } from "@/components/ui/button";
import {
  X,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  Building2,
  DollarSign,
} from "lucide-react";
import type { Job } from "@/types/job";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface JobDetailPanelProps {
  job: Job | null;
  onClose: () => void;
  onSave?: (id: number) => void;
  saved?: boolean;
}

export function JobDetailPanel({
  job,
  onClose,
  onSave,
  saved = false,
}: JobDetailPanelProps) {
  if (!job) return null;

  const salaryText = job.pay
    ? `${job.pay.currency} $${job.pay.min.toLocaleString()} - $${job.pay.max.toLocaleString()}`
    : "Pay not listed";

  const formattedDate = job.datePosted
        ? new Date(job.datePosted).toLocaleDateString()
        : "Date unknown";  

  return (
    <div className="w-full lg:w-[480px] shrink-0 border-x-1 border-y-1 rounded-xl border-blue-500 bg-card">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border rounded-xl bg-card p-4">
        <h2 className="font-semibold text-foreground">Job Details</h2>
        {/* <Button variant="outline" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground leading-tight">
                {job.title}
              </h3>
              <p className="text-base text-muted-foreground mt-1">
                {job.company}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            {job.pay && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  <span>{salaryText}</span>
                </div>
              </>
            )}
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Separator/>

          {/* Job Description */}
          <ScrollArea className="h-[calc(100vh-180px)]">
          <div>
            <h4 className="font-semibold text-foreground mb-3 pt-4 pl-2">
              About this role
            </h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed p-2">
              {job.description || "No description provided."}
            </p>
          </div>
          </ScrollArea>

          {/* Fixed Actions */}
          <div className="sticky bottom-0 border-t border-border bg-card p-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={cn("flex-1 bg-transparent hover:bg-emerald-600 hover:text-white", saved && "text-white bg-emerald-600")}
                onClick={() => onSave?.(job.id)}
              >
                <Bookmark
                  className={cn("mr-2 h-4 w-4", saved && "fill-current")}
                />
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline"className="flex-1 text-white bg-blue-600 hover:bg-blue-700 hover:text-white" asChild>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
