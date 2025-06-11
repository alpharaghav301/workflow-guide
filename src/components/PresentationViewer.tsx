"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Monitor,
  Users,
  Settings,
  Edit3,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Slide, Presentation } from "@/types/presentation";
import { presentationData } from "@/data/presentationData";

const PresentationViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [presentation, setPresentation] =
    useState<Presentation>(presentationData);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [customLinkLabels, setCustomLinkLabels] = useState<{
    [key: string]: string;
  }>({});
  const [showLinkEditor, setShowLinkEditor] = useState(false);

  const slides = presentation.slides;
  const currentSlide = slides[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditingSlide(null);
    if (isAutoPlay) {
      setIsAutoPlay(false);
    }
  };

  const startEditingSlide = (slide: Slide) => {
    setEditingSlide({ ...slide });
  };

  const saveSlideChanges = () => {
    if (!editingSlide) return;

    const updatedSlides = slides.map((slide) =>
      slide.id === editingSlide.id ? editingSlide : slide
    );

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    setEditingSlide(null);
    setHasUnsavedChanges(true);
  };

  const cancelEdit = () => {
    setEditingSlide(null);
  };

  const updateSlideTitle = (title: string) => {
    if (!editingSlide) return;
    setEditingSlide((prev) => (prev ? { ...prev, title } : null));
  };

  const updateSlideContent = (content: string[]) => {
    if (!editingSlide) return;
    setEditingSlide((prev) => (prev ? { ...prev, content } : null));
  };

  const addNewSlide = () => {
    const newSlide: Slide = {
      id: Math.max(...slides.map((s) => s.id)) + 1,
      title: "New Slide",
      content: ["Add your content here"],
      type: "content",
    };

    const newSlides = [
      ...slides.slice(0, currentSlideIndex + 1),
      newSlide,
      ...slides.slice(currentSlideIndex + 1),
    ];
    setPresentation((prev) => ({
      ...prev,
      slides: newSlides,
    }));

    setCurrentSlideIndex(currentSlideIndex + 1);
    setHasUnsavedChanges(true);
  };

  const deleteSlide = (slideId: number) => {
    if (slides.length <= 1) return; // Don't delete if it's the only slide

    const updatedSlides = slides.filter((slide) => slide.id !== slideId);
    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(updatedSlides.length - 1);
    }

    setHasUnsavedChanges(true);
  };

  const moveSlideUp = (index: number) => {
    if (index === 0) return;

    const newSlides = [...slides];
    [newSlides[index - 1], newSlides[index]] = [
      newSlides[index],
      newSlides[index - 1],
    ];

    setPresentation((prev) => ({
      ...prev,
      slides: newSlides,
    }));

    if (currentSlideIndex === index) {
      setCurrentSlideIndex(index - 1);
    } else if (currentSlideIndex === index - 1) {
      setCurrentSlideIndex(index);
    }

    setHasUnsavedChanges(true);
  };

  const moveSlideDown = (index: number) => {
    if (index === slides.length - 1) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [
      newSlides[index + 1],
      newSlides[index],
    ];

    setPresentation((prev) => ({
      ...prev,
      slides: newSlides,
    }));

    if (currentSlideIndex === index) {
      setCurrentSlideIndex(index + 1);
    } else if (currentSlideIndex === index + 1) {
      setCurrentSlideIndex(index);
    }

    setHasUnsavedChanges(true);
  };

  const exportPresentation = () => {
    const dataStr = JSON.stringify(presentation, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "n8n-presentation.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importPresentation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setPresentation(imported);
        setCurrentSlideIndex(0);
        setHasUnsavedChanges(false);
      } catch (error) {
        alert("Error importing presentation. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  // Extract all links from the presentation
  const extractLinksFromPresentation = () => {
    const links = new Set<string>();
    presentation.slides.forEach((slide) => {
      slide.content.forEach((line) => {
        const urlMatches = line.match(/(https?:\/\/[^\s]+)/g);
        const emailMatches = line.match(
          /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
        );

        if (urlMatches) urlMatches.forEach((url) => links.add(url));
        if (emailMatches) emailMatches.forEach((email) => links.add(email));
      });
    });
    return Array.from(links);
  };

  const updateCustomLinkLabel = (url: string, label: string) => {
    setCustomLinkLabels((prev) => ({
      ...prev,
      [url]: label,
    }));
    setHasUnsavedChanges(true);
  };

  const getDefaultLinkText = (link: string) => {
    if (link.includes("@")) {
      if (link.includes("team@")) return "Team Email";
      if (link.includes("support@")) return "Support Email";
      if (link.includes("alerts@")) return "Alerts";
      return "Email";
    } else {
      if (link.includes("api.example.com")) return "API Docs";
      if (link.includes("wiki.example.com")) return "Wiki";
      if (link.includes("github.com")) return "GitHub";
      if (link.includes("docs")) return "Documentation";
      return "Link";
    }
  };

  // Function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    if (!urlRegex.test(text) && !emailRegex.test(text)) {
      return text;
    }

    const parts = text.split(
      /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    );

    return parts.map((part, index) => {
      if (urlRegex.test(part) || emailRegex.test(part)) {
        const linkText = customLinkLabels[part] || getDefaultLinkText(part);
        const isEmail = emailRegex.test(part);

        return (
          <a
            key={index}
            href={isEmail ? `mailto:${part}` : part}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
            title={part}
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    if (isAutoPlay && !isEditMode) {
      const interval = setInterval(nextSlide, 5000);
      setAutoPlayInterval(interval);
    } else {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [isAutoPlay, isEditMode]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isEditMode || showLinkEditor) return; // Disable keyboard nav in edit mode

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
      } else if (event.key === "Escape") {
        setIsAutoPlay(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isEditMode, showLinkEditor]);

  const renderLinkEditor = () => {
    if (!showLinkEditor) return null;

    const allLinks = extractLinksFromPresentation();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customize Link Labels
            </h2>
            <button
              onClick={() => setShowLinkEditor(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {allLinks.map((link, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Link:{" "}
                    <span className="text-blue-600 font-mono text-xs">
                      {link}
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  value={customLinkLabels[link] || getDefaultLinkText(link)}
                  onChange={(e) => updateCustomLinkLabel(link, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder={getDefaultLinkText(link)}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Preview: {renderTextWithLinks(`Check out ${link}`)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setCustomLinkLabels({});
                setHasUnsavedChanges(true);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Reset All
            </button>
            <button
              onClick={() => setShowLinkEditor(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditableContent = (slide: Slide) => {
    const isCurrentlyEditing = editingSlide?.id === slide.id;

    if (isCurrentlyEditing) {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => updateSlideTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-xl font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (one line per item)
                </label>
                <textarea
                  value={editingSlide.content.join("\n")}
                  onChange={(e) =>
                    updateSlideContent(e.target.value.split("\n"))
                  }
                  rows={12}
                  className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tips: Use " •" for bullets, " •" for sub-bullets. URLs and
                  emails will be automatically linked.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={saveSlideChanges}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show regular content with edit overlay
    return (
      <div className="relative">
        {isEditMode && (
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button
              onClick={() => startEditingSlide(slide)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
              title="Edit this slide"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {slides.length > 1 && (
              <button
                onClick={() => deleteSlide(slide.id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
                title="Delete this slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {renderSlideContent(slide)}
      </div>
    );
  };

  const renderSlideContent = (slide: Slide) => {
    if (slide.type === "title") {
      return (
        <div className="text-center space-y-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              {slide.title}
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-6">
            {slide.content.map((line, index) => (
              <p
                key={index}
                className={`
                  ${
                    index === 0
                      ? "text-3xl text-gray-700 font-semibold"
                      : "text-xl text-gray-600"
                  }
                  ${
                    index === 2
                      ? "mt-12 text-2xl text-blue-600 font-medium"
                      : ""
                  }
                  ${index === 3 ? "text-lg text-gray-500" : ""}
                `}
              >
                {renderTextWithLinks(line)}
              </p>
            ))}
          </div>
        </div>
      );
    }

    if (slide.type === "qa") {
      return (
        <div className="text-center space-y-12 max-w-3xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {slide.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
            {slide.content.map((line, index) => (
              <p
                key={index}
                className={`
                  ${index === 0 ? "text-3xl font-bold text-gray-800 mb-6" : ""}
                  ${index === 1 ? "hidden" : ""}
                  ${
                    index === 2
                      ? "text-2xl font-semibold text-blue-700 mb-4"
                      : ""
                  }
                  ${
                    index > 2
                      ? "text-lg text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                      : ""
                  }
                `}
              >
                {renderTextWithLinks(line)}
              </p>
            ))}
          </div>
        </div>
      );
    }

    if (slide.type === "agenda") {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-blue-600 mb-6">
              {slide.title}
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slide.content.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {renderTextWithLinks(item)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            {slide.title}
          </h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="space-y-4">
            {slide.content.map((line, index) => {
              if (line === "") {
                return <div key={index} className="h-6"></div>;
              }

              const isMainHeading =
                !line.startsWith("  ") &&
                !line.includes("{") &&
                !line.includes("}");
              const isMainBullet =
                line.startsWith("  •") ||
                line.startsWith("  1.") ||
                line.startsWith("  2.") ||
                line.startsWith("  3.") ||
                line.startsWith("  4.") ||
                line.startsWith("  5.") ||
                line.startsWith("  6.");
              const isSubBullet =
                line.startsWith("    •") || line.startsWith("    ◦");
              const isCode =
                line.includes("{") || line.includes("}") || line.includes('"');

              return (
                <div
                  key={index}
                  className={`
                  ${isMainHeading ? "mb-6 mt-8 first:mt-0" : ""}
                  ${isMainBullet ? "ml-6" : ""}
                  ${isSubBullet ? "ml-12" : ""}
                  ${isCode ? "ml-8" : ""}
                `}
                >
                  <p
                    className={`
                    ${
                      isMainHeading
                        ? "text-2xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r-lg"
                        : ""
                    }
                    ${
                      isMainBullet
                        ? "text-lg text-gray-700 flex items-start"
                        : ""
                    }
                    ${
                      isSubBullet
                        ? "text-base text-gray-600 flex items-start"
                        : ""
                    }
                    ${
                      isCode
                        ? "font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border"
                        : ""
                    }
                    leading-relaxed
                  `}
                  >
                    {isMainBullet && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    )}
                    {isSubBullet && (
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    )}
                    <span
                      className={isMainBullet || isSubBullet ? "flex-1" : ""}
                    >
                      {isCode
                        ? line.replace(/^(\s*[•◦]|\s*\d+\.)\s*/, "")
                        : renderTextWithLinks(
                            line.replace(/^(\s*[•◦]|\s*\d+\.)\s*/, "")
                          )}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header with Edit Controls */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  N8N Workflow Presentation
                  {hasUnsavedChanges && (
                    <span className="text-orange-600 ml-2">*</span>
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? "Edit Mode - Click slides to modify"
                    : "Interactive Training Session"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Edit Mode Controls */}
              <div className="flex items-center space-x-2">
                {isEditMode && (
                  <>
                    <button
                      onClick={() => setShowLinkEditor(true)}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      title="Customize link labels"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={addNewSlide}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Add new slide"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={exportPresentation}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      title="Export presentation"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <label
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                      title="Import presentation"
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept=".json"
                        onChange={importPresentation}
                        className="hidden"
                      />
                    </label>
                  </>
                )}

                <button
                  onClick={toggleEditMode}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isEditMode
                      ? "bg-orange-100 hover:bg-orange-200 text-orange-600"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                  }`}
                  title={isEditMode ? "Exit edit mode" : "Enter edit mode"}
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {!isEditMode && (
                <button
                  onClick={toggleAutoPlay}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isAutoPlay
                      ? "bg-red-100 hover:bg-red-200 text-red-600"
                      : "bg-green-100 hover:bg-green-200 text-green-600"
                  }`}
                  title={isAutoPlay ? "Pause auto-play" : "Start auto-play"}
                >
                  {isAutoPlay ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with improved layout */}
      <div className="flex-1 flex min-h-[calc(100vh-5rem)]">
        {/* Enhanced Slide Thumbnails with Reordering */}
        <div className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Navigation</h3>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {slides.map((slide, index) => (
                <div key={slide.id} className="relative group">
                  <button
                    onClick={() => goToSlide(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      index === currentSlideIndex
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                        : "bg-gray-50 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          index === currentSlideIndex
                            ? "bg-white text-blue-600"
                            : "bg-blue-600 text-white group-hover:bg-blue-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm font-semibold block truncate ${
                            index === currentSlideIndex
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {slide.title}
                        </span>
                        <span
                          className={`text-xs block truncate ${
                            index === currentSlideIndex
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {slide.type === "title"
                            ? "Title Slide"
                            : slide.type === "agenda"
                            ? "Overview"
                            : slide.type === "qa"
                            ? "Q&A Session"
                            : "Content"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Reorder Controls */}
                  {isEditMode && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveSlideUp(index)}
                        disabled={index === 0}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        title="Move slide up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveSlideDown(index)}
                        disabled={index === slides.length - 1}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        title="Move slide down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Slide Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto h-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl h-full p-12 flex items-center justify-center border border-gray-200 min-h-[600px]">
                <div className="w-full">
                  {isEditMode
                    ? renderEditableContent(currentSlide)
                    : renderSlideContent(currentSlide)}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-8 py-6 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={previousSlide}
                disabled={currentSlideIndex === 0}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  {isEditMode
                    ? "Edit Mode Active"
                    : "Use ← → keys or spacebar to navigate"}
                </span>
                <div className="flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlideIndex
                          ? "bg-blue-600 scale-125 shadow-lg"
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Link Editor Modal */}
      {renderLinkEditor()}
    </div>
  );
};

export default PresentationViewer;
