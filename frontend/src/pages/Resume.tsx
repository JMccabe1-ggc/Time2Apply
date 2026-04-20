import { useState, useEffect } from "react";
import Header from "@/components/Header";
import "../components/ui/Resume.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const API_BASE_URL = "http://127.0.0.1:8000";

type ResumeRow = {
  id: string;
  file_name: string;
  is_active: boolean;
  created_at: string;
  file_size?: number;
}

const Resume = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    education: "",
    experience: "",
    skills: "",
    licenses: "",
    references: "",
  });

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resume/active/skills`);
        const result = await response.json();

        console.log("loaded skills:", result);

        if (!response.ok) {
          throw new Error(result.detail || "Failed to load skills");
        }

        setFormData((prev) => ({
          ...prev,
          skills: Array.isArray(result.skills) ? result.skills.join(", ") : "",
        }));
      } catch (error) {
        console.error("Error loading skills:", error);
      }
    };

    loadSkills();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParseResume = async () => {
    if (!resumeFile) {
      alert("Please upload a resume first.");
      return;
    }

    const data = new FormData();
    data.append("file", resumeFile);

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      console.log("resume upload result:", result);
      console.log("skills_extracted:", result.skills_extracted);
      console.log("is array?", Array.isArray(result.skills_extracted));

      if (!response.ok) {
        throw new Error(result.detail || "Failed to parse resume");
      }
      setFormData((prev) => ({
        ...prev,
        skills: Array.isArray(result.skills_extracted)
          ? result.skills_extracted.join(", ")
          : typeof result.skills_extracted === "string"
            ? result.skills_extracted
            : "",
      }));
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Could not parse resume.");
    } finally {
      setLoading(false);
    }
  };

  async function handleResumeActiveChange(targetResumeId: string, isChecked: boolean) {
    if(!isChecked) {
      return;
    }
    
    /**save a copy */ 
    const previousResumes = [...resumes];
    
    /**switch active resume, other resumes inactive */
    const updatedResumes = previousResumes.map((resume) => ({
      ...resume,
      is_active: resume.id === targetResumeId,
    }))

    setResumes(updatedResumes)

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${targetResumeId}/active`, {
        method: "PATCH",
      })

      if(!response.ok) {
        throw new Error("Failed to update active resume")
      }
      
    } catch(error) {
      setResumes(previousResumes);
      console.error(error);
    }
  }

  const openDeleteDialog = (resumeId: string) => {
    setPendingDeleteId(resumeId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
  if (!pendingDeleteId) return;
  await handleDeleteResume(pendingDeleteId);
  setIsDeleteDialogOpen(false);
  setPendingDeleteId(null);
};

const handleDeleteResume = async (targetResumeId: string) => {

  const previousResumes = [...resumes];
  const updatedResumes = resumes.filter((resume) => resume.id !== targetResumeId);

  setResumes(updatedResumes);

  try {
    const response = await fetch(`${API_BASE_URL}/resume/${targetResumeId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete resume");
    }
  } catch (error) {
    console.error(error);
    setResumes(previousResumes);
    alert("Could not delete resume.");
  }
};

  useEffect(() => {
    const loadResume = async () => {

      try {
        setResumesLoading(true)

        const resumeResponse = await fetch(`${API_BASE_URL}/resume`)
        const resumeResult = await resumeResponse.json()

        console.log("uploaded resume", resumeResult)

        if(!resumeResponse.ok) {
          throw Error(resumeResult.detail || "failed to upload resume")
        }

        setResumes(resumeResult)

      } catch(error) {
        console.error("error uploading resume:", error)
      } finally {
        setResumesLoading(false)
      }
    }
    loadResume()
  }, [])

  return (
    <div className="resume-page">
      <Header />

      <main className="resume-content">
        <div className="resume-hero">
          <h1>Upload your resume</h1>
          <p>
            Parse your resume into structured fields you can review and edit
            before saving.
          </p>
        </div>

        <Tabs defaultValue="upload-tab" className="resume-tabs">
          <TabsList className="resume-tabs-list inset-shadow-sm bg-zinc-200">
            <TabsTrigger value="upload-tab">Upload</TabsTrigger>
            <TabsTrigger value="resumes-tab">Resumes</TabsTrigger>
          </TabsList>

          {/* Upload tab */}
          <TabsContent value="upload-tab" className="resume-upload-layout">
            <Card className="resume-card resume-upload-card">
              <div className="resume-upload">
                <CardContent className="resume-card-content">
                  <div>
                    <CardHeader>
                      <CardTitle>Resume File</CardTitle>
                    </CardHeader>
                    <input
                      id="resumeFile"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                    <button
                      className="resume-button"
                      type="button"
                      onClick={handleParseResume}
                      disabled={loading}
                    >
                      {loading ? "Parsing..." : "Parse resume"}
                    </button>
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="resume-card resume-upload-card">
              <CardContent className="resume-card-content">
                <div>
                  <CardHeader>
                    <CardTitle> Parsed Details</CardTitle>
                    <CardDescription>
                      Review the extracted and make edits if needed
                    </CardDescription>
                  </CardHeader>

                  <div className="resume-grid">
                    <div className="resume-field">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Alex Johnson"
                      />
                    </div>
                    <div className="resume-field">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="resume-field">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="alex@email.com"
                      />
                    </div>
                    <div className="resume-field resume-field--full">
                      <label htmlFor="education">Education</label>
                      <textarea
                        id="education"
                        name="education"
                        rows={4}
                        placeholder="University, degree, dates"
                      ></textarea>
                    </div>
                    <div className="resume-field resume-field--full">
                      <label htmlFor="experience">Experience</label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={5}
                        placeholder="Role, company, achievements"
                      ></textarea>
                    </div>
                    <div className="resume-field resume-field--full">
                      <label htmlFor="skills">Skills</label>
                      <textarea
                        id="skills"
                        name="skills"
                        rows={3}
                        placeholder="AWS Certified Solutions Architect"
                        value={formData.skills}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="resume-field resume-field--full">
                      <label htmlFor="licenses">Licenses / Certification</label>
                      <textarea
                        id="licenses"
                        name="licenses"
                        rows={3}
                        placeholder="AWS Certified Solutions Architect"
                        value={formData.licenses}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="resume-field resume-field--full">
                      <label htmlFor="references">References</label>
                      <textarea
                        id="references"
                        name="references"
                        rows={3}
                        placeholder="Name, relationship, contact"
                        value={formData.references}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="resume-actions">
                    <button className="resume-button" type="submit">
                      Save details
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resumes tab*/}
          <TabsContent value="resumes-tab" className="space-y-6">
            <Card>
              <div>
                <CardContent>
                  <div>
                    <CardHeader>
                      <CardTitle>Stored Resumes</CardTitle>
                      <CardDescription>
                        Review the uploads and make edits as needed
                      </CardDescription>
                    </CardHeader>

                    <Table>
                      <TableCaption>Documents Uploaded</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resume</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resumesLoading ? (
                          <TableRow>
                            <TableCell colSpan={3}>
                              Loading resumes...
                            </TableCell>
                          </TableRow>
                        ) : resumes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3}>
                              No resumes uploaded yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          resumes.map((resume) => {
                            const switchId = "toggle-resume" + resume.id;
                            return (
                              <TableRow key={resume.id}>
                                <TableCell>{resume.file_name}</TableCell>
                                <TableCell>
                                  <Switch
                                    checked={resume.is_active}
                                    onCheckedChange={(checked) =>
                                      handleResumeActiveChange(
                                        resume.id,
                                        checked,
                                      )
                                    }
                                    id={switchId}
                                  />
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant={"ghost"}
                                        size="icon"
                                        className="size-8"
                                      >
                                        <MoreHorizontalIcon />
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          openDeleteDialog(resume.id);
                                        }}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {setIsDeleteDialogOpen(open)
          if(!open) setPendingDeleteId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Resume;
