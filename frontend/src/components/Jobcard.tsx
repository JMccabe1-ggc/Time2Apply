
import "./ui/Jobcard.css";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import type { GhostRiskLevel } from "../types/job.ts";

type JobcardProps = {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string;
    publisher: string;
    jobType?: string;
    jobSite: string;
    applicationTypes: string;
    pay?: {
        min: number;
        max: number;
        currency: string;
    };
      payText?: string;
    applied: boolean;
    jobPostedDate: string;
    description?: string;
    applyUrl?: string;
    matchPercentage?: number;
    ghostRiskLevel?: GhostRiskLevel;
    onSelect?: (id: number) => void;
        onSave: () => void;
        isSaved: boolean;
        // onApply?: () => void;
};

const Jobcard = ({
    id,
    jobTitle,
    companyName,
    location,
    publisher,
    jobType,
    applicationTypes,
    pay,
    payText,
    applied,
    jobPostedDate,
    applyUrl,
    matchPercentage,
    ghostRiskLevel,
    onSelect,
    onSave,
    isSaved,
}: JobcardProps) => {


    const formattedPay = payText
        ? payText
        : pay
            ? `${pay.currency} $${pay.min.toLocaleString()} - $${pay.max.toLocaleString()}`
            : "Pay not listed";
    const formattedDate = jobPostedDate
        ? new Date(jobPostedDate).toLocaleDateString()
        : "Date unknown";
    
    const matchScoreColor = matchPercentage !== undefined 
        ? matchPercentage >= 75 ? "bg-green-100 text-green-900" 
        : matchPercentage >= 50 ? "bg-yellow-100 text-yellow-900"
        : "bg-red-100 text-red-900"
        : "";

    const ghostRiskBadgeColor = ghostRiskLevel
        ? ghostRiskLevel === "low" ? "bg-emerald-100 text-emerald-900"
        : ghostRiskLevel === "moderate" ? "bg-amber-100 text-amber-900"
        : ghostRiskLevel === "high" ? "bg-orange-100 text-orange-900"
        : "bg-rose-100 text-rose-900"
        : "";

    const ghostRiskLabel = ghostRiskLevel
      ? ghostRiskLevel === "very_high"
        ? "Very High"
        : ghostRiskLevel.charAt(0).toUpperCase() + ghostRiskLevel.slice(1)
      : "";

    const goToPosting = () => {
        if (applyUrl) {
            window.open(applyUrl, "_blank");
        }
    };

    return (
      <Card>
        <CardContent>
      <div className="jobcard space-y-4 w-full" onClick={() => onSelect?.(id)}>
        <div className="jobcard-header">
          <div>
            <h3 className="jobcard-title hover:cursor-pointer">{jobTitle}</h3>
            <p className="jobcard-company">{companyName}</p>
          </div>
          
          {applied && (
          <div className="flex items-center">
          <Badge variant="outline"
          className="bg-emerald-100 text-emerald-900 px-3 py-2 text-sm">
            <BadgeCheck className="h-6 w-6 mr-1"
            data-icon="inline-start"/>
            Applied
          </Badge>
        </div>)}
        </div>



        <div className="jobcard-badges">
          {jobType && <span className="jobcard-badge">{jobType}</span>}
          <span className="jobcard-badge jobcard-badge--muted">
            {publisher}
          </span>
          <span className="jobcard-badge jobcard-badge--muted">
            {applicationTypes}
          </span>
          {matchPercentage !== undefined && (
            <Badge className={`px-3 py-1 text-sm ${matchScoreColor}`}>
              {matchPercentage.toFixed(1)}% Match
            </Badge>
          )}
          {ghostRiskLevel && (
            <Badge className={`px-3 py-1 text-sm ${ghostRiskBadgeColor}`}>
              Ghost Risk: {ghostRiskLabel}
            </Badge>
          )}
        </div>

        <div className="jobcard-meta">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="jobcard-location">{location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span className="jobcard-pay">{formattedPay}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="jobcard-date">Posted {formattedDate}</span>
          </div>
        </div>

        <div className="jobcard-footer">
          <button
            className="jobcard-action jobcard-action--ghost"
            type="button"
            onClick={onSave}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            className="jobcard-action flex gap-1"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPosting();
              // onSelect?.(id); }}>
            }}
          >
            View role
            <ExternalLink className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      </CardContent>
      </Card>
    );
};

export default Jobcard;