import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PersonMetrics } from "@/lib/types";
import { format } from "date-fns";

interface RunnersTableProps {
    metrics: PersonMetrics[];
}

export function RunnersTable({ metrics }: RunnersTableProps) {
    // Sort by total miles desc
    const sorted = [...metrics].sort((a, b) => b.totalMiles - a.totalMiles);

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Runner</TableHead>
                            <TableHead className="text-right">Total Miles</TableHead>
                            <TableHead className="text-right">Avg / Run</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Last Run</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.map((person) => (
                            <TableRow key={person.person}>
                                <TableCell className="font-medium">{person.person}</TableCell>
                                <TableCell className="text-right">{person.totalMiles.toFixed(1)}</TableCell>
                                <TableCell className="text-right">{person.avgMiles.toFixed(1)}</TableCell>
                                <TableCell className="hidden sm:table-cell text-right">
                                    {format(person.lastRun, "MMM d, yyyy")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
