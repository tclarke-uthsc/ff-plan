import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Copy, Download, FileText } from "lucide-react"
import { toast } from "sonner"
import copy from "copy-to-clipboard"
import { saveAs } from "file-saver"

interface OutputDisplayProps {
  planOfDay: string
  postOpCourse: string
}

export function OutputDisplay({ planOfDay, postOpCourse }: OutputDisplayProps) {
  const [activeTab, setActiveTab] = useState<"plan" | "postop">("plan")

  const handleCopy = (text: string, type: string) => {
    // Create a temporary div to render the HTML and copy the rich text
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = text
    document.body.appendChild(tempDiv)
    
    // Select the content
    const range = document.createRange()
    range.selectNodeContents(tempDiv)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    
    // Copy the selected content
    document.execCommand('copy')
    selection?.removeAllRanges()
    
    // Clean up
    document.body.removeChild(tempDiv)
    
    toast.success(`${type} copied to clipboard`)
  }

  const handleExport = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/html;charset=utf-8" })
    saveAs(blob, filename)
    toast.success(`${filename} downloaded`)
  }

  const tabs = [
    { id: "plan" as const, label: "Plan of the Day", content: planOfDay, filename: "plan_of_day.html" },
    { id: "postop" as const, label: "Post-op Course", content: postOpCourse, filename: "postop_course.html" },
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)!

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Click "Copy" to copy formatted text for Epic, or "Select All" to manually select and copy
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const editor = document.getElementById('rich-text-editor')
                    if (editor) {
                      const range = document.createRange()
                      range.selectNodeContents(editor)
                      const selection = window.getSelection()
                      selection?.removeAllRanges()
                      selection?.addRange(range)
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(activeTabData.content, activeTabData.label)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(activeTabData.content, activeTabData.filename)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div 
              id="rich-text-editor"
              className="min-h-[600px] p-4 border border-gray-300 rounded-md bg-white overflow-auto prose max-w-none"
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: activeTabData.content }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
