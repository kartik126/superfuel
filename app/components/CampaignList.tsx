import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { CustomModal } from "./ui/custom-modal";
import { Textarea } from "./ui/textarea";
import { Link } from "@remix-run/react";

type Campaign = {
    id: string;
    name: string;
    description: string;
};

type CampaignListProps = {
    campaigns: Campaign[];
};

const CampaignList = ({ campaigns }: CampaignListProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/campaigns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create campaign");
            }

            // Reset form and close modal
            setFormData({ name: "", description: "" });
            setIsModalOpen(false);
            // Refresh the page to show new campaign
            window.location.reload();
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = async (campaignId: string) => {
        // TODO: Implement edit functionality
        console.log("Editing campaign:", campaignId);
    };

    const handleDelete = async (campaignId: string) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            try {
                const response = await fetch(`/api/campaigns/${campaignId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete campaign");
                }

                // Refresh the page to update the list
                window.location.reload();
            } catch (error) {
                console.error("Error deleting campaign:", error);
            }
        }
    };

    return (
        <div className="w-full py-20">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsModalOpen(true)}>Add Campaign</Button>
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Campaign"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Campaign Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter campaign name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter campaign description"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create Campaign</Button>
                    </div>
                </form>
            </CustomModal>

            <Table>
                <TableCaption>A list of your campaigns.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.id}</TableCell>
                            <TableCell>
                                <Link 
                                    to={`/campaign/${campaign.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {campaign.name}
                                </Link>
                            </TableCell>
                            <TableCell>{campaign.description}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleEdit(campaign.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive"
                                        onClick={() => handleDelete(campaign.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CampaignList;