"use client"

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CustomModal } from "./ui/custom-modal";
import { Textarea } from "./ui/textarea";
import { Form, Link } from "@remix-run/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Campaign = {
    id: string;
    name: string;
    daily_budget: number;
};

type TableColumn = {
    key: keyof Campaign | 'actions';
    label: string;
    width?: string;
};

type CampaignListProps = {
    campaigns: Campaign[];
};

const allColumns: TableColumn[] = [
    { key: "id", label: "ID", width: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "daily_budget", label: "Budget" },
    { key: "actions", label: "Actions" },
];

const CampaignList = ({ campaigns }: CampaignListProps) => {
    const [columnOrder, setColumnOrder] = useState<string[]>(allColumns.map(col => col.key));

    return (
        <div className="w-full py-20">
            <Table>
                <TableCaption>A list of your campaigns.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {columnOrder.map(columnKey => {
                            const column = allColumns.find(col => col.key === columnKey);
                            if (!column) return null;
                            return (
                                <TableHead key={column.key} className={column.width}>
                                    {column.label}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            {columnOrder.map(columnKey => {
                                const column = allColumns.find(col => col.key === columnKey);
                                if (!column) return null;

                                if (column.key === 'actions') {
                                    return (
                                        <TableCell key={column.key}>
                                            <div className="flex gap-2">
                                                <Link to={`/campaign-edit/${campaign.id}`}>
                                                    <Button variant="outline">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Form method="post">
                                                    <input type="hidden" name="intent" value="delete-campaign" />
                                                    <input type="hidden" name="id" value={campaign.id} />
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                </Form>
                                            </div>
                                        </TableCell>
                                    );
                                }
                                if (column.key === 'name') {
                                    return (
                                        <TableCell key={column.key}>
                                            <Link
                                                to={`/campaign/${campaign.id}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {campaign[column.key]}
                                            </Link>
                                        </TableCell>
                                    );
                                }
                                return (
                                    <TableCell key={column.key}>
                                        {campaign[column.key]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CampaignList;