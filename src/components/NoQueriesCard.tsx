import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Plus } from "lucide-react";

export default function NoQueriesCard() {
    return (
        <Card>
            <CardContent className="text-center py-12">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Queries Yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        You haven't raised any queries yet. Create your first query to get started.
                    </p>
                    <Link to="/queries/new">
                        <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Query
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
  )
}