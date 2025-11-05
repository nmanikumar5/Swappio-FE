"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterConfig {
  _id: string;
  sections: FooterSection[];
  brandName: string;
  brandDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function FooterManagement() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(
    null
  );
  const [editingSectionTitle, setEditingSectionTitle] = useState<string | null>(
    null
  );
  const [newSection, setNewSection] = useState({
    title: "",
    links: [{ label: "", href: "" }],
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const fetchFooterConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/footer/admin/config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch footer configuration");
      }

      const data = await response.json();
      setFooterConfig(data.data);
    } catch (error) {
      toast.error("Failed to load footer configuration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFooterConfig = async () => {
    if (!footerConfig) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/footer/admin/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sections: footerConfig.sections,
          brandName: footerConfig.brandName,
          brandDescription: footerConfig.brandDescription,
          contactEmail: footerConfig.contactEmail,
          contactPhone: footerConfig.contactPhone,
          socialLinks: footerConfig.socialLinks,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save configuration");
      }

      const data = await response.json();
      setFooterConfig(data.data);
      toast.success("Footer configuration saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save configuration"
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = () => {
    if (
      !newSection.title.trim() ||
      newSection.links.some((l) => !l.label.trim() || !l.href.trim())
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!footerConfig) return;

    setFooterConfig({
      ...footerConfig,
      sections: [
        ...footerConfig.sections,
        {
          title: newSection.title,
          links: newSection.links,
        },
      ],
    });

    setNewSection({ title: "", links: [{ label: "", href: "" }] });
    toast.success("Section added (not saved yet)");
  };

  const handleUpdateSection = (
    oldTitle: string,
    updatedSection: FooterSection
  ) => {
    if (!footerConfig) return;

    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.map((s) =>
        s.title === oldTitle ? updatedSection : s
      ),
    });

    setEditingSection(null);
    setEditingSectionTitle(null);
    toast.success("Section updated (not saved yet)");
  };

  const handleDeleteSection = (title: string) => {
    if (!footerConfig) return;

    if (footerConfig.sections.length <= 1) {
      toast.error(
        "Cannot delete the last section. Footer must have at least one section."
      );
      return;
    }

    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.filter((s) => s.title !== title),
    });

    toast.success("Section deleted (not saved yet)");
  };

  const handleDeleteLink = (sectionTitle: string, linkLabel: string) => {
    if (!footerConfig) return;

    const section = footerConfig.sections.find((s) => s.title === sectionTitle);
    if (section && section.links.length <= 1) {
      toast.error(
        "Cannot delete the last link. Each section must have at least one link."
      );
      return;
    }

    setFooterConfig({
      ...footerConfig,
      sections: footerConfig.sections.map((s) =>
        s.title === sectionTitle
          ? {
              ...s,
              links: s.links.filter((l) => l.label !== linkLabel),
            }
          : s
      ),
    });

    toast.success("Link deleted (not saved yet)");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!footerConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Failed to load footer configuration
            </p>
            <Button onClick={fetchFooterConfig} className="w-full mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Footer Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your website footer content, links, and brand information
        </p>
      </div>

      {/* Brand Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Brand Information
          </CardTitle>
          <CardDescription>
            Update your brand details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Brand Name
            </label>
            <Input
              value={footerConfig.brandName}
              onChange={(e) =>
                setFooterConfig({
                  ...footerConfig,
                  brandName: e.target.value,
                })
              }
              placeholder="Swappio"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Brand Description
            </label>
            <Textarea
              value={footerConfig.brandDescription}
              onChange={(e) =>
                setFooterConfig({
                  ...footerConfig,
                  brandDescription: e.target.value,
                })
              }
              placeholder="Your brand description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Email
              </label>
              <Input
                type="email"
                value={footerConfig.contactEmail}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    contactEmail: e.target.value,
                  })
                }
                placeholder="support@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Phone
              </label>
              <Input
                value={footerConfig.contactPhone}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    contactPhone: e.target.value,
                  })
                }
                placeholder="+1 (234) 567-8900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2Icon className="h-5 w-5" />
            Social Media Links
          </CardTitle>
          <CardDescription>Add your social media profile URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </label>
              <Input
                value={footerConfig.socialLinks.facebook || ""}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    socialLinks: {
                      ...footerConfig.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </label>
              <Input
                value={footerConfig.socialLinks.twitter || ""}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    socialLinks: {
                      ...footerConfig.socialLinks,
                      twitter: e.target.value,
                    },
                  })
                }
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </label>
              <Input
                value={footerConfig.socialLinks.instagram || ""}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    socialLinks: {
                      ...footerConfig.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </label>
              <Input
                value={footerConfig.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setFooterConfig({
                    ...footerConfig,
                    socialLinks: {
                      ...footerConfig.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Footer Sections</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>
                  Create a new footer section with links
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Section Title
                  </label>
                  <Input
                    value={newSection.title}
                    onChange={(e) =>
                      setNewSection({ ...newSection, title: e.target.value })
                    }
                    placeholder="e.g., Company"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Links
                  </label>
                  <div className="space-y-2">
                    {newSection.links.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          placeholder="Link Label"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...newSection.links];
                            updated[idx].label = e.target.value;
                            setNewSection({ ...newSection, links: updated });
                          }}
                        />
                        <Input
                          placeholder="URL"
                          value={link.href}
                          onChange={(e) => {
                            const updated = [...newSection.links];
                            updated[idx].href = e.target.value;
                            setNewSection({ ...newSection, links: updated });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewSection({
                              ...newSection,
                              links: newSection.links.filter(
                                (_, i) => i !== idx
                              ),
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewSection({
                        ...newSection,
                        links: [...newSection.links, { label: "", href: "" }],
                      });
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                <Button onClick={handleAddSection} className="w-full">
                  Create Section
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {footerConfig.sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{section.title}</CardTitle>
                <div className="flex gap-2">
                  <Dialog
                    open={editingSectionTitle === section.title}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingSection(null);
                        setEditingSectionTitle(null);
                      } else {
                        setEditingSection(section);
                        setEditingSectionTitle(section.title);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Section</DialogTitle>
                      </DialogHeader>
                      {editingSection && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-semibold mb-2 block">
                              Section Title
                            </label>
                            <Input
                              value={editingSection.title}
                              onChange={(e) =>
                                setEditingSection({
                                  ...editingSection,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">
                              Links
                            </label>
                            <div className="space-y-2">
                              {editingSection.links.map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <Input
                                    placeholder="Link Label"
                                    value={link.label}
                                    onChange={(e) => {
                                      const updated = [...editingSection.links];
                                      updated[idx].label = e.target.value;
                                      setEditingSection({
                                        ...editingSection,
                                        links: updated,
                                      });
                                    }}
                                  />
                                  <Input
                                    placeholder="URL"
                                    value={link.href}
                                    onChange={(e) => {
                                      const updated = [...editingSection.links];
                                      updated[idx].href = e.target.value;
                                      setEditingSection({
                                        ...editingSection,
                                        links: updated,
                                      });
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (editingSection.links.length > 1) {
                                        setEditingSection({
                                          ...editingSection,
                                          links: editingSection.links.filter(
                                            (_, i) => i !== idx
                                          ),
                                        });
                                      } else {
                                        toast.error(
                                          "Each section must have at least one link"
                                        );
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingSection({
                                  ...editingSection,
                                  links: [
                                    ...editingSection.links,
                                    { label: "", href: "" },
                                  ],
                                });
                              }}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Link
                            </Button>
                          </div>

                          <Button
                            onClick={() => {
                              handleUpdateSection(
                                section.title,
                                editingSection
                              );
                              setEditingSectionTitle(null);
                            }}
                            className="w-full"
                          >
                            Save Section
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSection(section.title)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.links.map((link) => (
                  <div
                    key={link.href}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {link.href}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteLink(section.title, link.label)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex gap-2 justify-end sticky bottom-4">
        <Button variant="outline" onClick={fetchFooterConfig}>
          Cancel
        </Button>
        <Button
          onClick={saveFooterConfig}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// Icon component helper
function Share2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}
