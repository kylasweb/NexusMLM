import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
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
  Undo,
  Redo,
  Download,
  History,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { PageTemplate, getPageTemplates, createPageTemplate, updatePageTemplate, deletePageTemplate } from "@/lib/api";

interface EditorState {
  elements: any[];
  selectedElement: string | null;
  history: any[];
  currentHistoryIndex: number;
}

const WebsiteEditor = () => {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState("elements");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageTemplate | null>(null);
  const [pageTemplates, setPageTemplates] = useState<PageTemplate[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    elements: [],
    selectedElement: null,
    history: [],
    currentHistoryIndex: -1,
  });

  // Load page templates from database
  useEffect(() => {
    loadPageTemplates();
  }, []);

  const loadPageTemplates = async () => {
    try {
      const templates = await getPageTemplates();
      setPageTemplates(templates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load page templates",
        variant: "destructive",
      });
    }
  };

  // Save current state to history
  const saveToHistory = useCallback((newState: any) => {
    setEditorState(prev => {
      const newHistory = [...prev.history.slice(0, prev.currentHistoryIndex + 1), newState];
      return {
        ...prev,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Undo last action
  const handleUndo = () => {
    setEditorState(prev => {
      if (prev.currentHistoryIndex > 0) {
        return {
          ...prev,
          currentHistoryIndex: prev.currentHistoryIndex - 1,
          elements: prev.history[prev.currentHistoryIndex - 1],
        };
      }
      return prev;
    });
  };

  // Redo last action
  const handleRedo = () => {
    setEditorState(prev => {
      if (prev.currentHistoryIndex < prev.history.length - 1) {
        return {
          ...prev,
          currentHistoryIndex: prev.currentHistoryIndex + 1,
          elements: prev.history[prev.currentHistoryIndex + 1],
        };
      }
      return prev;
    });
  };

  // Save current page
  const handleSave = async () => {
    if (!currentPage) return;

    setIsSaving(true);
    try {
      const updatedPage = await updatePageTemplate(currentPage.id, {
        content: editorState.elements,
      });

      setCurrentPage(updatedPage);
      toast({
        title: "Success",
        description: "Page saved successfully",
      });
      loadPageTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Export template
  const handleExport = () => {
    const template = {
      name: currentPage?.name,
      elements: editorState.elements,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage?.name || 'template'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData("text/plain", elementId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("text/plain");
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = {
      id: `${elementId}-${Date.now()}`,
      type: elementId,
      position: { x, y },
      content: "",
    };

    setEditorState(prev => {
      const newElements = [...prev.elements, newElement];
      saveToHistory(newElements);
      return { ...prev, elements: newElements };
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Create new page
  const handleCreatePage = async () => {
    try {
      const newPage = await createPageTemplate({
        name: 'New Page',
        content: [],
      });

      setPageTemplates(prev => [newPage, ...prev]);
      setCurrentPage(newPage);
      setEditorState(prev => ({ ...prev, elements: [] }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new page",
        variant: "destructive",
      });
    }
  };

  // Delete page
  const handleDeletePage = async (pageId: string) => {
    try {
      await deletePageTemplate(pageId);
      setPageTemplates(prev => prev.filter(page => page.id !== pageId));
      if (currentPage?.id === pageId) {
        setCurrentPage(null);
        setEditorState(prev => ({ ...prev, elements: [] }));
      }
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  // Mock data for demonstration
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

  return (
    <DashboardLayout>
      <div className="flex h-full bg-gray-100">
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
                    <Layout className="h-4 w-4 mr-2" /> Pages
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
                      <Button size="sm" variant="ghost" onClick={handleCreatePage}>
                        <Plus className="h-4 w-4 mr-1" /> New
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {pageTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-gray-200 rounded-md overflow-hidden hover:border-blue-500 cursor-pointer"
                          onClick={() => {
                            setCurrentPage(template);
                            setEditorState(prev => ({
                              ...prev,
                              elements: template.content || []
                            }));
                          }}
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
                      {pageTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <span>{template.name}</span>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setCurrentPage(template);
                                  setEditorState(prev => ({
                                    ...prev,
                                    elements: template.content || []
                                  }));
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePage(template.id)}
                              >
                                <Trash className="h-4 w-4" />
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
                  <h3 className="font-medium mb-4">Site Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input id="site-name" defaultValue="MLM Matrix" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Description</Label>
                      <Input
                        id="site-description"
                        defaultValue="Binary Matrix MLM System"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primary-color"
                          defaultValue="#3B82F6"
                          className="flex-1"
                        />
                        <div
                          className="w-10 h-10 rounded-md border border-gray-200"
                          style={{ backgroundColor: "#3B82F6" }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <select
                        id="font-family"
                        className="w-full h-10 rounded-md border border-gray-200 px-3"
                      >
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                        <option>Lato</option>
                      </select>
                    </div>
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" /> Save Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeftPanel(!showLeftPanel)}
              >
                {showLeftPanel ? <ChevronLeft /> : <ChevronRight />}
              </Button>
              <h2 className="text-lg font-semibold">
                {currentPage?.name || 'Select a Page'}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={editorState.currentHistoryIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={editorState.currentHistoryIndex >= editorState.history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="animate-spin">⌛</span>
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div
            ref={editorRef}
            className="flex-1 p-4 overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isPreviewMode ? (
              <div className="preview-container">
                {editorState.elements.map((element) => (
                  <div
                    key={element.id}
                    style={{
                      position: 'absolute',
                      left: element.position.x,
                      top: element.position.y,
                    }}
                  >
                    {/* Render element based on type */}
                    {element.type === 'heading' && <h1>{element.content}</h1>}
                    {element.type === 'paragraph' && <p>{element.content}</p>}
                    {element.type === 'image' && <img src={element.content} alt="" />}
                    {/* Add more element type renderers */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="editor-container">
                {editorState.elements.map((element) => (
                  <div
                    key={element.id}
                    className="editor-element"
                    style={{
                      position: 'absolute',
                      left: element.position.x,
                      top: element.position.y,
                    }}
                    onClick={() => setEditorState(prev => ({
                      ...prev,
                      selectedElement: element.id
                    }))}
                  >
                    {/* Render element with edit controls */}
                    {element.type === 'heading' && (
                      <input
                        type="text"
                        value={element.content}
                        onChange={(e) => {
                          setEditorState(prev => ({
                            ...prev,
                            elements: prev.elements.map(el =>
                              el.id === element.id
                                ? { ...el, content: e.target.value }
                                : el
                            )
                          }));
                        }}
                      />
                    )}
                    {/* Add more element type editors */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebsiteEditor;
