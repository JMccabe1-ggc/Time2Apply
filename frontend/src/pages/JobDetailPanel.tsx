import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
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
  applied: boolean;
  onAppliedChange?:(nextApplied:boolean) => void;
}

export function JobDetailPanel({
  job,
  onSave,
  saved = false,
  applied = false,
  onAppliedChange,
}: JobDetailPanelProps) {
  if (!job) return null;

  const salaryText = job.pay
    ? `${job.pay.currency} $${job.pay.min.toLocaleString()} - $${job.pay.max.toLocaleString()}`
    : "Pay not listed";

  const formattedDate = job.datePosted
        ? new Date(job.datePosted).toLocaleDateString()
        : "Date unknown";  

  return (
    <div className="w-full lg:w-[520px] shrink-0 border-x-1 border-y-1 rounded-xl border-blue-500 bg-card">
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
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            {job.pay && (
              <>
                <span className="mb-2">•</span>
                <div className="flex items-center gap-1.5 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{salaryText}</span>
                </div>
              </>
            )}
            <span className="mb-2">•</span>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Separator/>

          <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="flex items-center gap-50 m-2">
            <h4>Have you applied?</h4>
            <ButtonGroup>
              <Button 
              variant={"secondary"}
              className={cn("hover:bg-primary hover:text-white", applied && "text-white bg-primary"
              )}
              onClick={() => onAppliedChange?.(true)}
              >Yes</Button>
              <ButtonGroupSeparator/>
              <Button 
              variant={"secondary"}
              className={cn("hover:bg-primary hover:text-white", !applied && "text-white bg-primary"
              )}
              onClick={() => onAppliedChange?.(false)}
              >No</Button>
            </ButtonGroup>
          </div>

          <Separator/>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Skill Match</h4>
              <span className="text-xs text-muted-foreground">
                {job.match?.match_percentage != null
                  ? `${job.match.match_percentage.toFixed(1)}% overall match`
                  : "No match score yet"}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-emerald-700">Skills you have</p>
              {job.match?.matched_skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {job.match.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No matched skills identified.</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-700">Skills you are missing</p>
              {job.match?.missing_skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {job.match.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No missing skills listed.</p>
              )}
            </div>
          </div>

          {/* Job Description */}
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
