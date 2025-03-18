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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PublicLayout from "../layout/PublicLayout";

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
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">{pageName}</h1>
            <p className="text-gray-600 mb-4">
              This is a preview of your page. In a real implementation, this would
              show the actual rendered content of your page.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 mb-6 text-center text-gray-500">
              Page content would appear here
            </div>
            <div className="flex justify-end">
              <Button onClick={togglePreviewMode}>
                <Eye className="mr-2 h-4 w-4" /> Exit Preview
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      {showLeftPanel && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Tabs defaultValue={activePanel} onValueChange={setActivePanel}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="elements">
                  <Layers className="h-4 w-4 mr-2" /> Elements
                </TabsTrigger>
                <TabsTrigger value="pages">
                  <FileText className="h-4 w-4 mr-2" /> Pages
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto">
            {activePanel === "elements" && (
              <div>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {elementCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setActiveCategory(category.id)}
                        className="flex-shrink-0"
                      >
                        {category.icon}
                        <span className="ml-1">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-13rem)]">
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {getElementsForCategory(activeCategory).map((element) => (
                      <div
                        key={element.id}
                        className="border border-gray-200 rounded-md p-2 flex flex-col items-center justify-center cursor-move hover:bg-gray-50"
                        draggable
                        onDragStart={(e) => handleDragStart(e, element.id)}
                        onClick={() => handleElementClick(element.id)}
                      >
                        <div className="w-8 h-8 flex items-center justify-center mb-1">
                          {element.icon}
                        </div>
                        <span className="text-xs">{element.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {activePanel === "pages" && (
              <ScrollArea className="h-[calc(100vh-9rem)]">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Page Templates</h3>
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4 mr-1" /> New
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {pageTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-md overflow-hidden hover:border-blue-500 cursor-pointer"
                      >
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-20 object-cover"
                        />
                        <div className="p-2 text-center text-xs">
                          {template.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Your Pages</h3>
                  </div>
                  <div className="space-y-2">
                    {savedPages.map((page) => (
                      <div
                        key={page.id}
                        className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block">{page.name}</span>
                            <span className="text-xs text-gray-500">
                              /{page.slug}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant={page.status === "published" ? "default" : "outline"}
                              className="mr-2"
                            >
                              {page.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}

            {activePanel === "settings" && (
              <div className="p-4">
                <h3 className="font-medium mb-4">Page Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
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
                      onValueChange={setPageStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="page-description">Meta Description</Label>
                    <Textarea
                      id="page-description"
                      placeholder="Enter a description for search engines"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setShowSaveDialog(true)}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Page
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeftPanel(!showLeftPanel)}
            >
              {showLeftPanel ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <Layers className="h-5 w-5" />
              )}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <Move className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <Bold className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Italic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Underline className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <AlignLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <AlignCenter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <AlignRight className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <Link className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Image className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="h-4 w-4 mr-2" /> Preview
            </Button>
            <Button
              size="sm"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 bg-gray-100 overflow-auto p-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {saveSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>Page saved successfully!</AlertDescription>
            </Alert>
          )}

          {saveError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to save page. Please try again.</AlertDescription>
            </Alert>
          )}

          <div className="bg-white min-h-[1000px] w-full max-w-5xl mx-auto shadow-md rounded-md p-8">
            {/* This would be the actual editable canvas */}
            <h1 className="text-3xl font-bold mb-6">{pageName}</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500">
              Drag and drop elements here to build your page
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Properties) */}
      {showRightPanel && selectedElement && (
        <div className="w-64 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Properties</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(false)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="element-id">Element Type</Label>
                <Input id="element-id" value={selectedElement} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="element-class">CSS Classes</Label>
                <Input id="element-class" placeholder="Add CSS classes" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Dimensions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">
                      Width
                    </Label>
                    <Input id="width" placeholder="Auto" />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">
                      Height
                    </Label>
                    <Input id="height" placeholder="Auto" />
                  </div>
                </div>
              </div>
