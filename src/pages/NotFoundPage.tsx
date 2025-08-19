"use client"

import { Button } from "../components/ui/button"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-md w-full text-center space-y-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</div>
          <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered
          the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg px-8 py-3">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="text-lg px-8 py-3">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>



        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  )
}
