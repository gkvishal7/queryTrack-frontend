"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Sidebar } from "../components/Sidebar"
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Book,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  Users,
  Menu,
} from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion"

// Mock FAQ data
const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    questions: [
      {
        id: "q1",
        question: "How do I submit my first query?",
        answer:
          "To submit your first query, click the 'New Query' button on your dashboard or navigate to the Queries page and click 'Submit New Query'. Fill out the form with your issue details, select the appropriate category and priority, and click submit. You'll receive a confirmation email with your query ID.",
        tags: ["new user", "submit", "query"],
      },
      {
        id: "q2",
        question: "What information should I include in my query?",
        answer:
          "Include a clear, descriptive title and provide detailed information about your issue. Mention what you were trying to do, what went wrong, any error messages you saw, and steps you've already tried. The more information you provide, the faster we can help resolve your issue.",
        tags: ["best practices", "details"],
      },
      {
        id: "q3",
        question: "How do I track the status of my query?",
        answer:
          "You can track your query status by visiting the 'My Queries' page in your dashboard. Each query shows its current status (Open, In Progress, Pending, Resolved, or Closed). You'll also receive email notifications when the status changes.",
        tags: ["tracking", "status", "notifications"],
      },
    ],
  },
  {
    id: "account-management",
    title: "Account Management",
    icon: Users,
    questions: [
      {
        id: "q4",
        question: "How do I reset my password?",
        answer:
          "Click the 'Forgot Password' link on the login page, enter your email address, and follow the instructions in the email you receive. If you don't receive an email within a few minutes, check your spam folder or contact support.",
        tags: ["password", "reset", "login"],
      },
      {
        id: "q5",
        question: "How do I update my profile information?",
        answer:
          "Go to your Profile page by clicking your name in the top navigation, then click 'Edit Profile'. You can update your personal information, contact details, and notification preferences. Don't forget to save your changes.",
        tags: ["profile", "update", "information"],
      },
      {
        id: "q6",
        question: "Can I change my notification preferences?",
        answer:
          "Yes, you can customize your notification preferences in your Profile settings. You can choose to receive notifications via email, enable/disable push notifications, and set up weekly digests. These settings help you stay informed without being overwhelmed.",
        tags: ["notifications", "preferences", "email"],
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: HelpCircle,
    questions: [
      {
        id: "q7",
        question: "Why can't I log in to my account?",
        answer:
          "Common login issues include: incorrect username/password, account lockout after multiple failed attempts, or browser cache issues. Try clearing your browser cache, using an incognito window, or resetting your password. If problems persist, contact support.",
        tags: ["login", "troubleshooting", "access"],
      },
      {
        id: "q8",
        question: "I'm not receiving email notifications. What should I do?",
        answer:
          "First, check your spam/junk folder. Ensure your email address is correct in your profile settings and that email notifications are enabled. Add our support email to your contacts to prevent future emails from going to spam. If issues persist, contact your IT department or our support team.",
        tags: ["email", "notifications", "spam"],
      },
      {
        id: "q9",
        question: "The system seems slow or unresponsive. What can I do?",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. Check your internet connection and try accessing the system from a different device. If the issue persists, it might be a system-wide issue - check our status page or contact support.",
        tags: ["performance", "slow", "browser"],
      },
    ],
  },
]

const resources = [
  {
    title: "User Guide",
    description: "Comprehensive guide covering all features and functionality",
    icon: Book,
    type: "PDF",
    url: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video tutorials for common tasks",
    icon: Video,
    type: "Video",
    url: "#",
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers and integrations",
    icon: FileText,
    type: "Web",
    url: "#",
  },
  {
    title: "Best Practices Guide",
    description: "Tips and best practices for effective query management",
    icon: HelpCircle,
    type: "PDF",
    url: "#",
  },
]

const contactOptions = [
  {
    title: "Email Support",
    description: "Get help via email - we typically respond within 24 hours",
    icon: Mail,
    contact: "support@querytrack.com",
    availability: "24/7",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our support team",
    icon: Phone,
    contact: "+1 (555) 123-HELP",
    availability: "Mon-Fri, 9 AM - 6 PM EST",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: MessageSquare,
    contact: "Available in app",
    availability: "Mon-Fri, 9 AM - 6 PM EST",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openCategories, setOpenCategories] = useState<string[]>(["getting-started"])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop, overlay for mobile */}
      <div className="hidden md:block">
        <Sidebar userRole="user" />
      </div>
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: sidebarOpen ? 'rgba(0,0,0,0.3)' : 'transparent' }}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="w-64 h-full bg-white dark:bg-gray-900 shadow-lg" onClick={e => e.stopPropagation()}>
          <Sidebar userRole="user" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Help</h1>
          <div className="w-6 h-6" /> {/* Spacer for symmetry */}
        </div>
        <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Help Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions, browse our resources
            </p>
          </div>

          <div className="max-w-5xl">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                  
                </CardHeader>
                <CardContent className="space-y-4">
                  {(
                    <Accordion type="multiple" className="w-full">
                      {filteredFAQs.map((category) => (
                        <AccordionItem key={category.id} value={category.id}>
                          <AccordionTrigger className="text-lg font-semibold flex items-center gap-3">
                            <category.icon className="w-5 h-5" />
                            <span>{category.title}</span>
                            {/* <Badge variant="secondary">{category.questions.length}</Badge> */}
                          </AccordionTrigger>
                          <AccordionContent className="bg-muted/50 rounded-lg px-2 py-2">
                            <Accordion type="multiple" className="w-full">
                              {category.questions.map((question) => (
                                <AccordionItem key={question.id} value={question.id}>
                                  <AccordionTrigger className="text-base font-medium text-left">
                                    {question.question}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className=" bg-muted/50 rounded-lg p-4">
                                      <p className="text-gray-700 dark:text-gray-300 mb-3">{question.answer}</p>
                                      
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
