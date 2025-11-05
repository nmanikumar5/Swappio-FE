"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { configService } from "@/services/api";
import {
  Settings,
  Lock,
  Plus,
  Edit,
  Trash2,
  Search,
  Key,
  Mail,
  CreditCard,
  Database,
  MessageSquare,
  Cloud,
  Package,
  RefreshCw,
} from "lucide-react";

interface Config {
  id: string;
  key: string;
  value: string;
  encrypted: boolean;
  category: string;
  description?: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  oauth: <Key className="h-4 w-4" />,
  api_keys: <Lock className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  features: <Package className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  storage: <Cloud className="h-4 w-4" />,
  general: <Settings className="h-4 w-4" />,
};

const categoryNames: Record<string, string> = {
  oauth: "OAuth & Authentication",
  api_keys: "API Keys",
  payment: "Payment",
  features: "Feature Flags",
  email: "Email",
  sms: "SMS",
  storage: "Storage",
  general: "General Settings",
};

export default function ConfigManagement() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    encrypted: false,
    category: "general",
    description: "",
  });

  useEffect(() => {
    loadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const params: { category?: string; search?: string } = {};
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const data = await configService.getAllConfigs(params);
      setConfigs(data);
    } catch (error) {
      console.error("Failed to load configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadConfigs();
  };

  const openCreateModal = () => {
    setFormData({
      key: "",
      value: "",
      encrypted: false,
      category: "general",
      description: "",
    });
    setShowCreateModal(true);
  };

  const openEditModal = (config: Config) => {
    setEditingConfig(config);
    setFormData({
      key: config.key,
      value: config.encrypted ? "" : config.value,
      encrypted: config.encrypted,
      category: config.category,
      description: config.description || "",
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    try {
      await configService.createConfig(formData);
      setShowCreateModal(false);
      loadConfigs();
      alert("Configuration created successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message || "Failed to create configuration");
    }
  };

  const handleUpdate = async () => {
    if (!editingConfig) return;

    try {
      const updates: {
        value?: string;
        encrypted?: boolean;
        category?: string;
        description?: string;
      } = {
        category: formData.category,
        description: formData.description,
        encrypted: formData.encrypted,
      };

      // Only send value if it's not empty (for encrypted values)
      if (formData.value.trim()) {
        updates.value = formData.value;
      }

      await configService.updateConfig(editingConfig.key, updates);
      setShowEditModal(false);
      setEditingConfig(null);
      loadConfigs();
      alert("Configuration updated successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message || "Failed to update configuration");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the configuration "${key}"?`))
      return;

    try {
      await configService.deleteConfig(key);
      loadConfigs();
      alert("Configuration deleted successfully!");
    } catch {
      alert("Failed to delete configuration");
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !confirm(
        "This will seed default configurations. Existing configs will not be overwritten. Continue?"
      )
    )
      return;

    try {
      const result = await configService.seedDefaultConfigs();
      alert(
        `Seeding complete! Created: ${result.created}, Skipped: ${result.skipped}`
      );
      loadConfigs();
    } catch {
      alert("Failed to seed default configurations");
    }
  };

  const filteredConfigs = configs.filter((config) => {
    if (
      searchQuery &&
      !config.key.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !config.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const groupedConfigs = filteredConfigs.reduce((acc, config) => {
    if (!acc[config.category]) acc[config.category] = [];
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, Config[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Configuration Management
          </h2>
          <p className="text-muted-foreground">
            Manage application settings, API keys, and feature flags
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Seed Defaults
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Configuration
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search configurations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.keys(categoryNames).map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="flex items-center gap-2"
            >
              {categoryIcons[cat]}
              {categoryNames[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredConfigs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">No configurations found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first configuration or seed default values
                </p>
              </CardContent>
            </Card>
          ) : selectedCategory === "all" ? (
            // Show grouped by category when "All" is selected
            <div className="space-y-6">
              {Object.entries(groupedConfigs).map(
                ([category, categoryConfigs]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {categoryIcons[category]}
                        {categoryNames[category]}
                        <Badge variant="outline" className="ml-auto">
                          {categoryConfigs.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryConfigs.map((config) => (
                          <ConfigItem
                            key={config.id}
                            config={config}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          ) : (
            // Show flat list when a specific category is selected
            <div className="space-y-3">
              {filteredConfigs.map((config) => (
                <ConfigItem
                  key={config.id}
                  config={config}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key*</Label>
                <Input
                  id="key"
                  placeholder="e.g., FEATURE_DARK_MODE"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      key: e.target.value.toUpperCase(),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this configuration
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value*</Label>
                <Input
                  id="value"
                  type={formData.encrypted ? "password" : "text"}
                  placeholder="Configuration value"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {Object.entries(categoryNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this configuration does..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="encrypted"
                  checked={formData.encrypted}
                  onChange={(e) =>
                    setFormData({ ...formData, encrypted: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="encrypted" className="cursor-pointer">
                  Encrypt this value (for sensitive data like API keys, secrets)
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={!formData.key || !formData.value}
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Key</Label>
                <Input
                  value={editingConfig.key}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Key cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-value">
                  Value{" "}
                  {editingConfig.encrypted && "(Leave empty to keep current)"}
                </Label>
                <Input
                  id="edit-value"
                  type={formData.encrypted ? "password" : "text"}
                  placeholder={
                    editingConfig.encrypted
                      ? "Enter new value or leave empty"
                      : formData.value
                  }
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {Object.entries(categoryNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe what this configuration does..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-encrypted"
                  checked={formData.encrypted}
                  onChange={(e) =>
                    setFormData({ ...formData, encrypted: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-encrypted" className="cursor-pointer">
                  Encrypt this value
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingConfig(null);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpdate}>
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Config Item Component
function ConfigItem({
  config,
  onEdit,
  onDelete,
}: {
  config: Config;
  onEdit: (config: Config) => void;
  onDelete: (key: string) => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono font-semibold">{config.key}</code>
          {config.encrypted && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Encrypted
            </Badge>
          )}
          {!config.isActive && <Badge variant="destructive">Inactive</Badge>}
        </div>
        {config.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {config.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Value:{" "}
            <code className="bg-muted px-2 py-0.5 rounded">{config.value}</code>
          </span>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(config)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(config.key)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
