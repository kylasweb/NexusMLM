import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layout,
  Type,
  Image,
  Square,
  Circle,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Save,
  Eye,
  Settings,
  Layers,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash,
  Move,
  FileText,
  Check,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PublicLayout from "../layout/PublicLayout";
import { Badge } from "@/components/ui/badge";

interface PageEditorProps {
  pageId?: string;
  isPreview?: boolean;
}

const PageEditor = ({ pageId, isPreview = false }: PageEditorProps) => {
  const [activePanel, setActivePanel] = useState("elements");
  const [showLeftPanel, setShowLeftPanel] = useState(!isPreview);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [pageName, setPageName] = useState("New Page");
  const [pageSlug, setPageSlug] = useState("new-page");
  const [pageStatus, setPageStatus] = useState("draft");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [previewMode, setPreviewMode] = useState(isPreview);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Mock data for demonstration
  const pageTemplates = [
    {
      id: "1",
      name: "Home Page",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "About Us",
      thumbnail:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Contact",
      thumbnail:
        "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Pricing",
      thumbnail:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=100&h=100&auto=format&fit=crop",
    },
  ];

  const savedPages = [
    { id: "1", name: "Home", slug: "home", status: "published" },
    { id: "2", name: "About", slug: "about", status: "published" },
    { id: "3", name: "Contact", slug: "contact", status: "published" },
    { id: "4", name: "FAQ", slug: "faq", status: "draft" },
  ];

  const elementCategories = [
    { id: "layout", name: "Layout", icon: <Layout className="h-4 w-4" /> },
    {
      id: "typography",
      name: "Typography",
      icon: <Type className="h-4 w-4" />,
    },
    { id: "media", name: "Media", icon: <Image className="h-4 w-4" /> },
    { id: "forms", name: "Forms", icon: <Square className="h-4 w-4" /> },
    {
      id: "components",
      name: "Components",
      icon: <Layers className="h-4 w-4" />,
    },
  ];

  const layoutElements = [
    { id: "section", name: "Section", icon: <Square className="h-4 w-4" /> },
    {
      id: "container",
      name: "Container",
      icon: <Square className="h-4 w-4" />,
    },
    { id: "columns", name: "Columns", icon: <Columns className="h-4 w-4" /> },
    { id: "rows", name: "Rows", icon: <Rows className="h-4 w-4" /> },
  ];

  const typographyElements = [
    { id: "heading", name: "Heading", icon: <Type className="h-4 w-4" /> },
    {
      id: "paragraph",
      name: "Paragraph",
      icon: <AlignLeft className="h-4 w-4" />,
    },
    { id: "list", name: "List", icon: <List className="h-4 w-4" /> },
    {
      id: "orderedList",
      name: "Ordered List",
      icon: <ListOrdered className="h-4 w-4" />,
    },
  ];

  const mediaElements = [
    { id: "image", name: "Image", icon: <Image className="h-4 w-4" /> },
    { id: "video", name: "Video", icon: <Square className="h-4 w-4" /> },
    { id: "icon", name: "Icon", icon: <Circle className="h-4 w-4" /> },
  ];

  const formElements = [
    { id: "input", name: "Input", icon: <Square className="h-4 w-4" /> },
    {
      id: "textarea",
      name: "Textarea",
      icon: <AlignLeft className="h-4 w-4" />,
    },
    { id: "checkbox", name: "Checkbox", icon: <Square className="h-4 w-4" /> },
    { id: "button", name: "Button", icon: <Square className="h-4 w-4" /> },
  ];

  const componentElements = [
    { id: "card", name: "Card", icon: <Square className="h-4 w-4" /> },
    { id: "tabs", name: "Tabs", icon: <Square className="h-4 w-4" /> },
    {
      id: "accordion",
      name: "Accordion",
      icon: <Square className="h-4 w-4" />,
    },
    { id: "modal", name: "Modal", icon: <Square className="h-4 w-4" /> },
    { id: "hero", name: "Hero Section", icon: <Layout className="h-4 w-4" /> },
    { id: "features", name: "Features Grid", icon: <Grid className="h-4 w-4" /> },
    { id: "testimonial", name: "Testimonial", icon: <Quote className="h-4 w-4" /> },
    { id: "cta", name: "Call to Action", icon: <Bell className="h-4 w-4" /> },
  ];

  const getElementsForCategory = (categoryId: string) => {
    switch (categoryId) {
      case "layout":
        return layoutElements;
      case "typography":
        return typographyElements;
      case "media":
        return mediaElements;
      case "forms":
        return formElements;
      case "components":
        return componentElements;
      default:
        return [];
    }
  };

  const [activeCategory, setActiveCategory] = useState("layout");

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData("text/plain", elementId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("text/plain");
    console.log(`Dropped element: ${elementId}`);
    // In a real implementation, this would add the element to the canvas
    setSelectedElement(elementId);
    setShowRightPanel(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSavePage = () => {
    // Simulate saving the page
    console.log("Saving page:", { pageName, pageSlug, pageStatus });
    setSaveSuccess(true);
    setShowSaveDialog(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
    setShowRightPanel(true);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // If in preview mode, render the page without editor UI
  if (previewMode) {
    return (
      <PublicLayout>
        <div className="container mx-auto py-8">
          {/* This would be the actual rendered page content */}
          <div className="prose max-w-none">
            <h1>{pageName}</h1>
            <p>This is a preview of your page content.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div
        className={`bg-white border-r w-64 transition-all duration-300 ${
          showLeftPanel ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <Tabs defaultValue={activePanel} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="elements" className="flex-1">
                Elements
                </TabsTrigger>
              <TabsTrigger value="pages" className="flex-1">
                Pages
                </TabsTrigger>
              </TabsList>

            <TabsContent value="elements" className="mt-4">
              <div className="space-y-4">
                    {elementCategories.map((category) => (
                  <div key={category.id}>
                    <button
                      className={`flex items-center w-full p-2 rounded-lg text-sm ${
                          activeCategory === category.id
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </button>
                      </div>
                    ))}
              </div>
            </TabsContent>

            <TabsContent value="pages" className="mt-4">
              <div className="space-y-4">
                    {savedPages.map((page) => (
                      <div
                        key={page.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                      >
                          <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                          </div>
                            <Badge
                      variant={page.status === "published" ? "default" : "secondary"}
                            >
                              {page.status}
                            </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeftPanel(!showLeftPanel)}
              >
                {showLeftPanel ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Input
                className="w-64"
                placeholder="Page name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
                            </Button>
                          </div>
                        </div>
                      </div>

        {/* Canvas Area */}
        <div
          className="flex-1 overflow-auto p-8 bg-gray-50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Add your canvas content here */}
          <div className="min-h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm p-8">
            {/* This is where dragged elements would be rendered */}
            <p className="text-gray-400 text-center">
              Drag and drop elements from the left panel to start building your page
            </p>
          </div>
                  </div>
                </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Page</DialogTitle>
            <DialogDescription>
              Configure your page settings before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
                  <div className="space-y-2">
              <Label htmlFor="page-name">Page Name</Label>
                    <Input
                id="page-name"
                      value={pageName}
                      onChange={(e) => setPageName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page-slug">URL Slug</Label>
                    <Input
                      id="page-slug"
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page-status">Status</Label>
                    <Select
                      value={pageStatus}
                onValueChange={(value) => setPageStatus(value)}
                    >
                <SelectTrigger id="page-status">
                  <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
          {saveSuccess && (
        <div className="fixed bottom-4 right-4">
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
              <AlertDescription>Page saved successfully!</AlertDescription>
            </Alert>
        </div>
          )}

      {/* Error Message */}
          {saveError && (
        <div className="fixed bottom-4 right-4">
          <Alert className="bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to save page. Please try again.</AlertDescription>
            </Alert>
        </div>
      )}
      </div>
  );
};

export default PageEditor;
