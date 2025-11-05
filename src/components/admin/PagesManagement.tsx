"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface PageContent {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  sectionTitle?: string;
  isPublished: boolean;
  updatedAt: string;
}

const PagesManagement: React.FC = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    content: "",
    sectionTitle: "",
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/pages/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }

        const result = await response.json();
        setPages(result.data || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast.error("Failed to load pages");
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [API_URL]);

  const handleCreatePage = async () => {
    try {
      if (
        !formData.slug ||
        !formData.title ||
        !formData.description ||
        !formData.content
      ) {
        toast.error("All fields are required");
        return;
      }

      setIsSaving(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/pages/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create page");
      }

      const result = await response.json();
      setPages([...pages, result.data]);
      setFormData({
        slug: "",
        title: "",
        description: "",
        content: "",
        sectionTitle: "",
      });
      setShowCreateDialog(false);
      toast.success("Page created successfully");
    } catch (error) {
      console.error("Error creating page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create page";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePage = async () => {
    try {
      if (!editingPage) return;
      if (!formData.title || !formData.description || !formData.content) {
        toast.error("All fields are required");
        return;
      }

      setIsSaving(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/pages/admin/${editingPage.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            sectionTitle: formData.sectionTitle,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update page");
      }

      const result = await response.json();
      setPages(pages.map((p) => (p._id === editingPage._id ? result.data : p)));
      setFormData({
        slug: "",
        title: "",
        description: "",
        content: "",
        sectionTitle: "",
      });
      setEditingPage(null);
      setShowEditDialog(false);
      toast.success("Page updated successfully");
    } catch (error) {
      console.error("Error updating page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update page";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async (page: PageContent) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/pages/admin/${page.slug}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPublished: !page.isPublished }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update page status");
      }

      const result = await response.json();
      setPages(pages.map((p) => (p._id === page._id ? result.data : p)));
      toast.success(`Page ${!page.isPublished ? "published" : "unpublished"}`);
    } catch (error) {
      console.error("Error updating page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update page status";
      toast.error(errorMessage);
    }
  };

  const handleDeletePage = async (page: PageContent) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/pages/admin/${page.slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      setPages(pages.filter((p) => p._id !== page._id));
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete page";
      toast.error(errorMessage);
    }
  };

  const openEditDialog = (page: PageContent) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      description: page.description,
      content: page.content,
      sectionTitle: page.sectionTitle || "",
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading pages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Page Slug
                </label>
                <Input
                  placeholder="e.g., privacy, terms, about"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase(),
                    })
                  }
                  disabled={editingPage !== null}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Page Title
                </label>
                <Input
                  placeholder="Page title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Brief description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <Textarea
                  placeholder="Page content (HTML supported)"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Footer Section (Optional)
                </label>
                <Input
                  placeholder="Link to footer section"
                  value={formData.sectionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, sectionTitle: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePage} disabled={isSaving}>
                  {isSaving ? "Creating..." : "Create Page"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No pages found. Create your first page to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page._id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{page.title}</h3>
                      <Badge
                        variant={page.isPublished ? "default" : "secondary"}
                      >
                        {page.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Slug:{" "}
                      <code className="bg-muted px-2 py-1 rounded">
                        {page.slug}
                      </code>
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {page.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated:{" "}
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishToggle(page)}
                    >
                      {page.isPublished ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(page)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePage(page)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Page Title
              </label>
              <Input
                placeholder="Page title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                placeholder="Page content (HTML supported)"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Footer Section (Optional)
              </label>
              <Input
                placeholder="Link to footer section"
                value={formData.sectionTitle}
                onChange={(e) =>
                  setFormData({ ...formData, sectionTitle: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingPage(null);
                  setFormData({
                    slug: "",
                    title: "",
                    description: "",
                    content: "",
                    sectionTitle: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdatePage} disabled={isSaving}>
                {isSaving ? "Updating..." : "Update Page"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PagesManagement;
