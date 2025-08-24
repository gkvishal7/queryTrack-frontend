
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface QueryStats {
    totalQueries: number;
    newQueries: number;
    inProgressQueries: number;
    resolvedQueries: number;
}

interface QueryStatsComponentProps {
    stats: QueryStats;
}

export default function QueryStatsComponent( { stats } : QueryStatsComponentProps){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQueries}</div>
                <p className="text-xs text-muted-foreground">
                  Total queries raised
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.newQueries}</div>
                <p className="text-xs text-muted-foreground">Yet to be Started</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressQueries}</div>
                <p className="text-xs text-muted-foreground">Yet to be Resolved</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Queries</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.resolvedQueries}</div>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </CardContent>
            </Card>
        </div>
    );
}