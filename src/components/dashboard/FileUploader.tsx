"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const start = e.dataTransfer.files[0];
            if (start && start.type === "text/csv") {
                onFileSelect(start);
            } else if (start && start.name.endsWith(".csv")) {
                // Fallback if type is missing/generic
                onFileSelect(start);
            } else {
                alert("Please upload a CSV file.");
            }
        },
        [onFileSelect]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <Card className={cn("w-full max-w-md mx-auto border-2 border-dashed transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/50"
        )}>
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center">
                <div className="p-4 rounded-full bg-background border shadow-sm">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                        Upload Running Data
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Drag and drop your CSV file here, or click to browse.
                    </p>
                </div>
                <div className="grid gap-2">
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleChange}
                    />
                    <Button variant="outline" asChild className="cursor-pointer">
                        <label htmlFor="file-upload">
                            Select CSV File
                        </label>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                    Required columns: Date, Person, Miles
                </p>
            </CardContent>
        </Card>
    );
}
